import Foundation
import GoogleMobileAds

extension UIWindow {
    func visibleViewController() -> UIViewController? {
        var top = self.rootViewController
        while true {
            if let presented = top?.presentedViewController {
                top = presented
            } else if let nav = top as? UINavigationController {
                top = nav.visibleViewController
            } else if let tab = top as? UITabBarController {
                top = tab.selectedViewController
            } else {
                break
            }
        }
        return top
    }
}

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
    
    func getViewController(reject: RCTPromiseRejectBlock?) -> UIViewController? {
        let viewController = RCTKeyWindow()?.visibleViewController()
        if (viewController == nil && reject != nil) {
            reject!("E_NIL_VC", "Cannot process Ad because the current View Controller is nil.", nil)
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
            if (reject != nil) {
                let code = String.localizedStringWithFormat("E_AD_LOAD_FAILED(%d)", (error as NSError).code)
                reject!(code, error.localizedDescription, error)
            }
            
            var data = Dictionary<String, Any>()
            data.updateValue((error as NSError).code, forKey: "code")
            data.updateValue(error.localizedDescription, forKey: "message")
            module.sendEvent(eventName: kEventAdFailedToLoad, requestId: requestId, data: data)
            
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
            module.presentPromiseHolder.reject(requestId: requestId, error: error)
            module.sendEvent(eventName: kEventAdFailedToPresent, requestId: requestId, data: nil)
            
            var data = Dictionary<String, Any>()
            data.updateValue((error as NSError).code, forKey: "code")
            data.updateValue(error.localizedDescription, forKey: "message")
            module.sendEvent(eventName: kEventAdFailedToLoad, requestId: requestId, data: data)
            
            module.adHolder.remove(requestId: requestId)
        }
        func adDidDismissFullScreenContent(_ ad: GADFullScreenPresentingAd) {
            module.sendEvent(eventName: kEventAdDismissed, requestId: requestId, data: nil)
            
            var haveToRequest = false
            if (options["loadOnDismissed"] != nil) {
                haveToRequest = options["loadOnDismissed"] as! Bool
            } else if (module.getAdType() == RNAdMobAppOpen.AD_TYPE) {
                haveToRequest = true
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
                return
            }
            
            let ad = adHolder.get(requestId: requestId)
            if (ad != nil) {
                if (resolve != nil && reject != nil) {
                    presentPromiseHolder.add(requestId: requestId, resolve: resolve!, reject: reject!)
                }
                self.show(ad: ad!, viewController: viewController!, requestId: requestId)
            } else {
                if (reject != nil) {
                    reject!("E_AD_NOT_READY", "Ad is not ready", nil)
                }
                var error = Dictionary<String, Any>()
                error.updateValue("Ad is not ready", forKey: "message")
                sendEvent(eventName: kEventAdFailedToPresent, requestId: requestId, data: error)
            }
        }
    }
    
    func destroyAd(_ requestId: Int) {
        adHolder.remove(requestId: requestId)
        presentPromiseHolder.reject(requestId: requestId, code: "E_AD_DESTROYED", message: "Ad has been destroyed")
    }
}
