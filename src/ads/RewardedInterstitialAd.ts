import { NativeModules } from 'react-native';

import {
  FullScreenAdInterface,
  RequestOptions,
  Reward,
  RewardedAdEvent,
} from '../types';

import MobileAd from './MobileAd';

const { requestAd, presentAd } =
  NativeModules.RNAdMobRewardedInterstitial as FullScreenAdInterface;

type HandlerType =
  | (() => void)
  | ((error: Error) => void)
  | ((reward: Reward) => void);

let _rewardedInterstitialRequest = 0;

export default class RewardedInterstitialAd extends MobileAd<
  RewardedAdEvent,
  HandlerType
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
   * Requests a new Rewarded Interstitial Ad.
   * @param requestOptions Optional RequestOptions used to load the ad.
   */
  requestAd(requestOptions?: RequestOptions) {
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
   * Presents loaded Rewarded Interstitial Ad.
   */
  presentAd() {
    return presentAd(this.requestId);
  }
}
