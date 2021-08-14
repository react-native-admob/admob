import { NativeModules } from 'react-native';

import {
  FullScreenAdInterface,
  RequestOptions,
  RewardedAdEvent,
  RewardedAdHandlerType,
} from '../types';

import MobileAd from './MobileAd';

const { requestAd, presentAd } =
  NativeModules.RNAdMobRewarded as FullScreenAdInterface;

let _rewardedRequest = 0;

export default class RewardedAd extends MobileAd<
  RewardedAdEvent,
  RewardedAdHandlerType
> {
  /**
   * Creates a new RewardedAd instance.
   * @param adUnitId The Ad Unit ID for the Rewarded Ad. You can find this on your Google AdMob dashboard.
   */
  static createAd(unitId: string) {
    const requestId = _rewardedRequest++;
    return new RewardedAd('Rewarded', requestId, unitId);
  }

  /**
   * Loads a new Rewarded Ad.
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
   * Shows loaded Rewarded Ad.
   */
  show() {
    return presentAd(this.requestId);
  }
}
