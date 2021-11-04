import Foundation
import GoogleMobileAds

@objc(RNAdMobInterstitial)
class RNAdMobInterstitial: RNAdMobFullScreenAd<GAMInterstitialAd> {
    static let AD_TYPE = "Interstitial"
    
    override func getAdType() -> String {
        return RNAdMobInterstitial.AD_TYPE
    }
    
    override func load(unitId: String, adRequest: GAMRequest, adLoadDelegate: RNAdMobFullScreenAd<GAMInterstitialAd>.AdLoadDelegate, fullScreenContentDelegate: RNAdMobFullScreenAd<GAMInterstitialAd>.FullScreenContentDelegate) {
        GAMInterstitialAd.load(withAdManagerAdUnitID: unitId, request: adRequest) {
            (ad, error) in
            if (error != nil) {
                adLoadDelegate.onAdFailedToLoad(error: error!)
                return
            }
            ad!.fullScreenContentDelegate = fullScreenContentDelegate
            adLoadDelegate.onAdLoaded(ad: ad!)
        }
    }
    
    override func show(ad: GAMInterstitialAd, viewController: UIViewController, requestId: Int) {
        ad.present(fromRootViewController: viewController)
    }
}

@objc(RNAdMobInterstitialAd)
class RNAdMobInterstitialAd: NSObject {
    static let ad = RNAdMobInterstitial()
    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }
    @objc func requestAd(_ requestId: NSNumber, unitId: String, options: NSDictionary, resolve: RCTPromiseResolveBlock?, reject: RCTPromiseRejectBlock?) {
        RNAdMobInterstitialAd.ad.requestAd(requestId.intValue, unitId: unitId, options: options as! Dictionary<String, Any>, resolve: resolve, reject: reject)
    }
    @objc func presentAd(_ requestId: NSNumber, resolve: RCTPromiseResolveBlock?, reject: RCTPromiseRejectBlock?) {
        RNAdMobInterstitialAd.ad.presentAd(requestId.intValue, resolve: resolve, reject: reject)
    }
    @objc func destroyAd(_ requestId: NSNumber) {
        RNAdMobInterstitialAd.ad.destroyAd(requestId.intValue)
    }
}
