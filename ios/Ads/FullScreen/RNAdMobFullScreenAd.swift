import Foundation
import GoogleMobileAds

class RNAdMobFullScreenAd<T>: NSObject {
    let adHolder = RNAdMobAdHolder<T>()
    let presentPromiseHolder = RNAdMobPromiseHolder()
    var delegateMap = Dictionary<Int, FullScreenContentDelegate>()
    
    func getAdType() -> String {
        fatalError("Method `getAdType` must be overriden")
    }
    
    func load(unitId: String, adRequest: GAMRequest, adLoadDelegate: AdLoadDelegate, fullScreenContentDelegate: FullScreenContentDelegate) {
        fatalError("Method `load` must be overriden")
    }
    
    func show(ad: T, viewController: UIViewController, requestId: Int) {
        fatalError("Method `show` must be overriden")
    }
    
    func sendEvent(eventName: String, requestId: Int, data: Dictionary<String, Any>?) {
        RNAdMobEvent.send(eventName, type: getAdType(), requestId: NSNumber(value: requestId), data: data)
    }
    
    func sendError(eventName: String, requestId: Int, reject: RCTPromiseRejectBlock?, errorData: Dictionary<String, Any>) {
        let error = NSError.init(domain: "com.rnadmob.admob", code: 0, userInfo: errorData)
        if (reject != nil) {
            var message = ""
            if (eventName == kEventAdFailedToLoad) {
                message = "Error occurred while loading ad."
            } else {
                message = "Error occurred while showing ad."
            }
            reject!(eventName, message, error)
        } else if (eventName == kEventAdFailedToPresent) {
            presentPromiseHolder.reject(requestId: requestId, errorData: errorData)
        }
        sendEvent(eventName: eventName, requestId: requestId, data: errorData)
    }
    
    func createErrorData(code: Int?, message: String) -> Dictionary<String, Any> {
        var error = Dictionary<String, Any>()
        if (code != nil) {
            error.updateValue(code!, forKey: "code")
        }
        error.updateValue(message, forKey: "message")
        return error
    }
    
    func createErrorData(error: Error) -> Dictionary<String, Any> {
        return createErrorData(code: (error as NSError).code, message: error.localizedDescription)
    }
    
    func getViewController(reject: RCTPromiseRejectBlock?) -> UIViewController? {
        var viewController = RCTKeyWindow()?.rootViewController
        while true {
            if let presented = viewController?.presentedViewController {
                viewController = presented
            } else if let nav = viewController as? UINavigationController {
                viewController = nav.visibleViewController
            } else if let tab = viewController as? UITabBarController {
                viewController = tab.selectedViewController
            } else {
                break
            }
        }
        return viewController
    }
    
    class AdLoadDelegate {
        let module: RNAdMobFullScreenAd
        let requestId: Int
        let options: Dictionary<String, Any>
        let resolve: RCTPromiseResolveBlock?
        let reject: RCTPromiseRejectBlock?
        init(module: RNAdMobFullScreenAd, requestId: Int, options: Dictionary<String, Any>, resolve: RCTPromiseResolveBlock?, reject: RCTPromiseRejectBlock?) {
            self.module = module
            self.requestId = requestId
            self.options = options
            self.resolve = resolve
            self.reject = reject
        }
        func onAdLoaded(ad: T) {
            module.adHolder.add(requestId: requestId, ad: ad)
            
            let ssv = RNAdMobCommon.buildServerSideVerificationOptions(options["requestOptions"] as? [AnyHashable : Any])
            if (module.getAdType() == RNAdMobRewarded.AD_TYPE) {
                (ad as! GADRewardedAd).serverSideVerificationOptions = ssv
            } else if (module.getAdType() == RNAdMobRewardedInterstitial.AD_TYPE) {
                (ad as! GADRewardedInterstitialAd).serverSideVerificationOptions = ssv
            }
            
            if (resolve != nil) {
                resolve!(nil)
            }
            
            module.sendEvent(eventName: kEventAdLoaded, requestId: requestId, data: nil)
            
            var haveToShow = false
            if (options["showOnLoaded"] != nil) {
                haveToShow = options["showOnLoaded"] as! Bool
            } else if (!RNAdMobAppOpen.appStarted && options["showOnColdStart"] != nil) {
                RNAdMobAppOpen.appStarted = true
                haveToShow = options["showOnColdStart"] as! Bool
            }
            
            if (haveToShow) {
                module.presentAd(requestId, resolve: nil, reject: nil)
            }
        }
        func onAdFailedToLoad(error: Error) {
            let errorData = module.createErrorData(error: error)
            module.sendError(eventName: kEventAdFailedToLoad, requestId: requestId, reject: reject, errorData: errorData)
            
            if (module.getAdType() == RNAdMobAppOpen.AD_TYPE) {
                if (!RNAdMobAppOpen.appStarted) {
                    RNAdMobAppOpen.appStarted = true
                }
            }
        }
    }
    
    class FullScreenContentDelegate: NSObject, GADFullScreenContentDelegate {
        let module: RNAdMobFullScreenAd
        let requestId: Int
        let unitId: String
        let options: Dictionary<String, Any>
        init(module: RNAdMobFullScreenAd, requestId: Int, unitId: String, options: Dictionary<String, Any>) {
            self.module = module
            self.requestId = requestId;
            self.unitId = unitId;
            self.options = options;
        }
        func adDidPresentFullScreenContent(_ ad: GADFullScreenPresentingAd) {
            module.presentPromiseHolder.resolve(requestId: requestId)
            module.sendEvent(eventName: kEventAdPresented, requestId: requestId, data: nil)
        }
        func ad(_ ad: GADFullScreenPresentingAd, didFailToPresentFullScreenContentWithError error: Error) {
            let errorData = module.createErrorData(error: error)
            module.sendError(eventName: kEventAdFailedToPresent, requestId: requestId, reject: nil, errorData: errorData)
            
            module.adHolder.remove(requestId: requestId)
        }
        func adDidDismissFullScreenContent(_ ad: GADFullScreenPresentingAd) {
            module.sendEvent(eventName: kEventAdDismissed, requestId: requestId, data: nil)
            
            var haveToRequest = false
            if (options["loadOnDismissed"] != nil) {
                haveToRequest = options["loadOnDismissed"] as! Bool
            }
            
            if (haveToRequest) {
                module.requestAd(requestId, unitId: unitId, options: options, resolve: nil, reject: nil)
            } else {
                module.adHolder.remove(requestId: requestId)
            }
        }
    }
    
    func requestAd(_ requestId: Int, unitId: String, options: Dictionary<String, Any>, resolve: RCTPromiseResolveBlock?, reject: RCTPromiseRejectBlock?) {
        DispatchQueue.main.async { [self] in
            adHolder.remove(requestId: requestId)
            
            let adRequest = RNAdMobCommon.buildAdRequest(options["requestOptions"] as? [AnyHashable : Any])
            let adLoadDelegate = AdLoadDelegate(module: self, requestId: requestId, options: options, resolve: resolve, reject: reject)
            let fullScreenContentDelegate = FullScreenContentDelegate(module: self, requestId: requestId, unitId: unitId, options: options)
            delegateMap.updateValue(fullScreenContentDelegate, forKey: requestId)
            
            self.load(unitId: unitId, adRequest: adRequest!, adLoadDelegate: adLoadDelegate, fullScreenContentDelegate: fullScreenContentDelegate)
        }
    }
    
    func presentAd(_ requestId: Int, resolve: RCTPromiseResolveBlock?, reject: RCTPromiseRejectBlock?) {
        DispatchQueue.main.async { [self] in
            let viewController = getViewController(reject: reject)
            if (viewController == nil) {
                let errorData = createErrorData(code: nil, message: "Current view controller is nil.")
                sendError(eventName: kEventAdFailedToPresent, requestId: requestId, reject: reject, errorData: errorData)
                return
            }
            
            let ad = adHolder.get(requestId: requestId)
            if (ad != nil) {
                if (resolve != nil && reject != nil) {
                    presentPromiseHolder.add(requestId: requestId, resolve: resolve!, reject: reject!)
                }
                self.show(ad: ad!, viewController: viewController!, requestId: requestId)
            } else {
                let errorData = createErrorData(code: nil, message: "Ad is not loaded.")
                sendError(eventName: kEventAdFailedToPresent, requestId: requestId, reject: nil, errorData: errorData)
            }
        }
    }
    
    func destroyAd(_ requestId: Int) {
        adHolder.remove(requestId: requestId)
        
        let errorData = createErrorData(code: nil, message: "Ad has been destroyed.")
        presentPromiseHolder.reject(requestId: requestId, errorData: errorData)
    }
}
