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
  /**
   * Creates a new RewardedInterstitialAd instance.
   * @param adUnitId The Ad Unit ID for the Rewarded Interstitial Ad. You can find this on your Google AdMob dashboard.
   */
  static createAd(unitId: string) {
    const requestId = _rewardedInterstitialRequest++;
    return new RewardedInterstitialAd(
      'RewardedInterstitial',
      requestId,
      unitId
    );
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
