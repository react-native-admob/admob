import Foundation
import GoogleMobileAds

class RNAdMobAppOpen: RNAdMobFullScreenAd<GADAppOpenAd>, RCTInvalidating {
    static let AD_TYPE = "AppOpen"
    static let AD_EXPIRE_HOUR = 4
    
    static var requestId = 0
    static var appStarted = false
    
    var showOnAppForeground = true
    lazy var loadTime = Date()
    
    override init() {
        super.init()
        NotificationCenter.default.addObserver(self, selector: #selector(applicationDidBecomeActive), name: UIApplication.didBecomeActiveNotification, object: nil)
    }
    
    func invalidate() {
        RNAdMobAppOpen.appStarted = false
    }
    
    override func getAdType() -> String {
        return RNAdMobAppOpen.AD_TYPE
    }
    
    override func requestAd(_ requestId: Int, unitId: String, options: Dictionary<String, Any>, resolve: RCTPromiseResolveBlock?, reject: RCTPromiseRejectBlock?) {
        super.requestAd(requestId, unitId: unitId, options: options, resolve: resolve, reject: reject)
        RNAdMobAppOpen.requestId = requestId
        if (options["showOnAppForeground"] != nil) {
            showOnAppForeground = options["showOnAppForeground"] as! Bool
        }
    }
    
    override func load(unitId: String, adRequest: GAMRequest, adLoadDelegate: RNAdMobFullScreenAd<GADAppOpenAd>.AdLoadDelegate, fullScreenContentDelegate: RNAdMobFullScreenAd<GADAppOpenAd>.FullScreenContentDelegate) {
        GADAppOpenAd.load(withAdUnitID: unitId, request: adRequest, orientation: UIInterfaceOrientation.portrait) {
            (ad, error) in
            if (error != nil) {
                adLoadDelegate.onAdFailedToLoad(error: error!)
                return
            }
            ad!.fullScreenContentDelegate = fullScreenContentDelegate
            self.loadTime = Date()
            adLoadDelegate.onAdLoaded(ad: ad!)
        }
    }
    
    override func show(ad: GADAppOpenAd, viewController: UIViewController, requestId: Int) {
        if (isAdExpired()) {
            presentPromiseHolder.reject(requestId: requestId, code: "E_AD_NOT_READY", message: "Ad is expired")
            var error = Dictionary<String, Any>()
            error.updateValue("Ad is expired", forKey: "message")
            sendEvent(eventName: kEventAdFailedToPresent, requestId: requestId, data: error)
            return
        }
        ad.present(fromRootViewController: viewController)
    }
    
    func isAdExpired() -> Bool {
        let now = Date()
        let timeIntervalBetweenNowAndLoadTime = now.timeIntervalSince(loadTime)
        let secondsPerHour = 3600.0;
        let intervalInHours = timeIntervalBetweenNowAndLoadTime / secondsPerHour;
        return intervalInHours > Double(RNAdMobAppOpen.AD_EXPIRE_HOUR);
    }
    
    @objc func applicationDidBecomeActive(notification: NSNotification) {
        if (showOnAppForeground) {
            presentAd(RNAdMobAppOpen.requestId, resolve: nil, reject: nil)
        }
    }
}

@objc(RNAdMobAppOpenAd)
class RNAdMobAppOpenAd: NSObject, RCTInvalidating {
    static let ad = RNAdMobAppOpen()
    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }
    @objc func invalidate() {
        RNAdMobAppOpenAd.ad.invalidate()
    }
    @objc func requestAd(_ requestId: NSNumber, unitId: String, options: NSDictionary, resolve: RCTPromiseResolveBlock?, reject: RCTPromiseRejectBlock?) {
        RNAdMobAppOpenAd.ad.requestAd(requestId.intValue, unitId: unitId, options: options as! Dictionary<String, Any>, resolve: resolve, reject: reject)
    }
    @objc func presentAd(_ requestId: NSNumber, resolve: RCTPromiseResolveBlock?, reject: RCTPromiseRejectBlock?) {
        RNAdMobAppOpenAd.ad.presentAd(requestId.intValue, resolve: resolve, reject: reject)
    }
    @objc func destroyAd(_ requestId: NSNumber) {
        RNAdMobAppOpenAd.ad.destroyAd(requestId.intValue)
    }
}
