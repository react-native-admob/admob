import { NativeModules } from 'react-native';

import {
  FullScreenAdInterface,
  RequestOptions,
  RewardedAdEvent,
  RewardedAdHandlerType,
} from '../types';

import MobileAd from './MobileAd';

const { requestAd, presentAd } =
  NativeModules.RNAdMobRewardedInterstitial as FullScreenAdInterface;

let _rewardedInterstitialRequest = 0;

export default class RewardedInterstitialAd extends MobileAd<
  RewardedAdEvent,
  RewardedAdHandlerType
> {
  private constructor(requestId: number, unitId: string) {
    super('RewardedInterstitial', requestId, unitId);
  }

  /**
   * Creates a new RewardedInterstitialAd instance.
   * @param unitId The Ad Unit ID for the Rewarded Interstitial Ad. You can find this on your Google AdMob dashboard.
   * @param requestOptions Optional RequestOptions used to load the ad.
   */
  static createAd(unitId: string, requestOptions?: RequestOptions) {
    const requestId = _rewardedInterstitialRequest++;
    const ad = new RewardedInterstitialAd(requestId, unitId);
    ad.setRequestOptions(requestOptions);
    return ad;
  }

  /**
   * Loads a new Rewarded Interstitial Ad.
   * @param requestOptions Optional RequestOptions used to load the ad.
   */
  load(requestOptions?: RequestOptions) {
    if (!this.requested) {
      this.requested = true;
      return requestAd(
        this.requestId,
        this.unitId,
        requestOptions || this.requestOptions
      );
    } else {
      return Promise.reject('Ad is already requested');
    }
  }

  /**
   * Shows loaded Rewarded Interstitial Ad.
   */
  show() {
    return presentAd(this.requestId);
  }
}
