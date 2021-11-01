import Foundation
import GoogleMobileAds

@objc(RNAdMobRewardedInterstitial)
class RNAdMobRewardedInterstitial: RNAdMobFullScreenAd<GADRewardedInterstitialAd> {
    static let AD_TYPE = "RewardedInterstitial"
    
    override func getAdType() -> String {
        return RNAdMobRewardedInterstitial.AD_TYPE
    }
    
    override func load(unitId: String, adRequest: GAMRequest, adLoadDelegate: RNAdMobFullScreenAd<GADRewardedInterstitialAd>.AdLoadDelegate, fullScreenContentDelegate: RNAdMobFullScreenAd<GADRewardedInterstitialAd>.FullScreenContentDelegate) {
        GADRewardedInterstitialAd.load(withAdUnitID: unitId, request: adRequest) {
            (ad, error) in
            if (error != nil) {
                adLoadDelegate.onAdFailedToLoad(error: error!)
                return
            }
            ad!.fullScreenContentDelegate = fullScreenContentDelegate
            adLoadDelegate.onAdLoaded(ad: ad!)
        }
    }
    
    override func show(ad: GADRewardedInterstitialAd, viewController: UIViewController, requestId: Int) {
        ad.present(fromRootViewController: viewController) {
            var reward = Dictionary<String, Any>()
            reward.updateValue(ad.adReward.amount, forKey: "amount")
            reward.updateValue(ad.adReward.type, forKey: "type")
            self.sendEvent(eventName: kEventRewarded, requestId: requestId, data: reward)
        }
    }
}

@objc(RNAdMobRewardedInterstitialAd)
class RNAdMobRewardedInterstitialAd: NSObject {
    static let ad = RNAdMobRewardedInterstitial()
    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }
    @objc func requestAd(_ requestId: NSNumber, unitId: String, options: NSDictionary, resolve: RCTPromiseResolveBlock?, reject: RCTPromiseRejectBlock?) {
        RNAdMobRewardedInterstitialAd.ad.requestAd(requestId.intValue, unitId: unitId, options: options as! Dictionary<String, Any>, resolve: resolve, reject: reject)
    }
    @objc func presentAd(_ requestId: NSNumber, resolve: RCTPromiseResolveBlock?, reject: RCTPromiseRejectBlock?) {
        RNAdMobRewardedInterstitialAd.ad.presentAd(requestId.intValue, resolve: resolve, reject: reject)
    }
    @objc func destroyAd(_ requestId: NSNumber) {
        RNAdMobRewardedInterstitialAd.ad.destroyAd(requestId.intValue)
    }
}
