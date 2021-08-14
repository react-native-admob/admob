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
  private constructor(requestId: number, unitId: string) {
    super('Rewarded', requestId, unitId);
  }

  /**
   * Creates a new RewardedAd instance.
   * @param unitId The Ad Unit ID for the Rewarded Ad. You can find this on your Google AdMob dashboard.
   * @param requestOptions Optional RequestOptions used to load the ad.
   */
  static createAd(unitId: string, requestOptions?: RequestOptions) {
    const requestId = _rewardedRequest++;
    const ad = new RewardedAd(requestId, unitId);
    ad.setRequestOptions(requestOptions);
    return ad;
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
