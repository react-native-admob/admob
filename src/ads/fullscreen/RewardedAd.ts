import {
  FullScreenAdOptions,
  RewardedAdEvent,
  RewardedAdHandlerType,
} from '../../types';

import FullScreenAd from './FullScreenAd';

let _rewardedRequest = 0;

export default class RewardedAd extends FullScreenAd<
  RewardedAdEvent,
  RewardedAdHandlerType
> {
  private constructor(
    requestId: number,
    unitId: string,
    options?: FullScreenAdOptions
  ) {
    super('Rewarded', requestId, unitId, options);
  }

  /**
   * Creates a new RewardedAd instance.
   * @param unitId The Ad Unit ID for the Rewarded Ad. You can find this on your Google AdMob dashboard.
   * @param options Optional FullScreenAdOptions for this ad.
   */
  static createAd(unitId: string, options?: FullScreenAdOptions) {
    const requestId = _rewardedRequest++;
    return new RewardedAd(requestId, unitId, options);
  }
}
