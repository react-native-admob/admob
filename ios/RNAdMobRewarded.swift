import Foundation
import GoogleMobileAds

class RNAdMobRewarded: RNAdMobFullScreenAd<GADRewardedAd> {
    static let AD_TYPE = "Rewarded"
    
    override func getAdType() -> String {
        return RNAdMobRewarded.AD_TYPE
    }
    
    override func load(unitId: String, adRequest: GAMRequest, adLoadDelegate: RNAdMobFullScreenAd<GADRewardedAd>.AdLoadDelegate, fullScreenContentDelegate: RNAdMobFullScreenAd<GADRewardedAd>.FullScreenContentDelegate) {
        GADRewardedAd.load(withAdUnitID: unitId, request: adRequest) {
            (ad, error) in
            if (error != nil) {
                adLoadDelegate.onAdFailedToLoad(error: error!)
                return
            }
            ad!.fullScreenContentDelegate = fullScreenContentDelegate
            adLoadDelegate.onAdLoaded(ad: ad!)
        }
    }
    
    override func show(ad: GADRewardedAd, viewController: UIViewController, requestId: Int) {
        ad.present(fromRootViewController: viewController) {
            var reward = Dictionary<String, Any>()
            reward.updateValue(ad.adReward.amount, forKey: "amount")
            reward.updateValue(ad.adReward.type, forKey: "type")
            self.sendEvent(eventName: kEventRewarded, requestId: requestId, data: reward)
        }
    }
}

@objc(RNAdMobRewardedAd)
class RNAdMobRewardedAd: NSObject {
    static let ad = RNAdMobRewarded()
    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }
    @objc func requestAd(_ requestId: NSNumber, unitId: String, options: NSDictionary, resolve: RCTPromiseResolveBlock?, reject: RCTPromiseRejectBlock?) {
        RNAdMobRewardedAd.ad.requestAd(requestId.intValue, unitId: unitId, options: options as! Dictionary<String, Any>, resolve: resolve, reject: reject)
    }
    @objc func presentAd(_ requestId: NSNumber, resolve: RCTPromiseResolveBlock?, reject: RCTPromiseRejectBlock?) {
        RNAdMobRewardedAd.ad.presentAd(requestId.intValue, resolve: resolve, reject: reject)
    }
    @objc func destroyAd(_ requestId: NSNumber) {
        RNAdMobRewardedAd.ad.destroyAd(requestId.intValue)
    }
}
