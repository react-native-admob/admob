import { NativeModules } from 'react-native';

import {
  FullScreenAdInterface,
  RequestOptions,
  Reward,
  RewardedAdEvent,
} from '../types';

import MobileAd from './MobileAd';

const { requestAd, presentAd } =
  NativeModules.RNAdMobRewarded as FullScreenAdInterface;

type HandlerType =
  | (() => void)
  | ((error: Error) => void)
  | ((reward: Reward) => void);

let _rewardedRequest = 0;

export default class RewardedAd extends MobileAd<RewardedAdEvent, HandlerType> {
  /**
   * Creates a new RewardedAd instance.
   * @param adUnitId The Ad Unit ID for the Rewarded Ad. You can find this on your Google AdMob dashboard.
   */
  static createAd(unitId: string) {
    const requestId = _rewardedRequest++;
    return new RewardedAd('Rewarded', requestId, unitId);
  }

  /**
   * Requests a new Rewarded Ad.
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
   * Presents loaded Rewarded Ad.
   */
  presentAd() {
    return presentAd(this.requestId);
  }
}
