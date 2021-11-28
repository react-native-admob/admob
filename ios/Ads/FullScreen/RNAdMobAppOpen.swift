import Foundation
import GoogleMobileAds

class RNAdMobAppOpen: RNAdMobFullScreenAd<GADAppOpenAd> {
    static let AD_TYPE = "AppOpen"
    static let AD_EXPIRE_HOUR = 4
    
    static var appStarted = false
    
    var requestId: Int? = nil
    var unitId: String? = nil
    var options: Dictionary<String, Any>? = nil
    
    lazy var loadTime = Date()
    
    override init() {
        super.init()
        NotificationCenter.default.addObserver(self, selector: #selector(applicationDidBecomeActive), name: UIApplication.didBecomeActiveNotification, object: nil)
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    
    override func getAdType() -> String {
        return RNAdMobAppOpen.AD_TYPE
    }
    
    override func requestAd(_ requestId: Int, unitId: String, options: Dictionary<String, Any>, resolve: RCTPromiseResolveBlock?, reject: RCTPromiseRejectBlock?) {
        super.requestAd(requestId, unitId: unitId, options: options, resolve: resolve, reject: reject)
        self.requestId = requestId
        self.unitId = unitId
        self.options = options
    }
    
    override func destroyAd(_ requestId: Int) {
        super.destroyAd(requestId)
        self.requestId = nil
        unitId = nil
        options = nil
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
            let errorData = createErrorData(code: nil, message: "Ad is expired.")
            sendError(eventName: kEventAdFailedToPresent, requestId: requestId, reject: nil, errorData: errorData)
            
            requestAd(requestId, unitId: unitId!, options: options!, resolve: nil, reject: nil)
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
        if (requestId == nil || unitId == nil || options == nil) {
            return
        }
        var showOnAppForeground = true
        if (options!["showOnAppForeground"] != nil) {
            showOnAppForeground = options!["showOnAppForeground"] as! Bool
        }
        if (showOnAppForeground) {
            if (adHolder.get(requestId: requestId!) != nil) {
                presentAd(requestId!, resolve: nil, reject: nil)
            } else {
                requestAd(requestId!, unitId: unitId!, options: options!, resolve: nil, reject: nil)
            }
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
        RNAdMobAppOpen.appStarted = false
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
