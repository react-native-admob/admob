import { NativeModules } from 'react-native';

import { FullScreenAdInterface, Reward, RewardedAdEvent } from '../types';

import MobileAd from './MobileAd';

const { requestAd, presentAd } =
  NativeModules.RNAdMobRewarded as FullScreenAdInterface;

type HandlerType =
  | (() => void)
  | ((error: Error) => void)
  | ((reward: Reward) => void);

let _rewardedRequest = 0;

export default class RewardedAd extends MobileAd<RewardedAdEvent, HandlerType> {
  static createAd(unitId: string) {
    const requestId = _rewardedRequest++;
    return new RewardedAd('Rewarded', requestId, unitId);
  }

  requestAd() {
    if (!this.requested) {
      this.requested = true;
      return requestAd(this.requestId, this.unitId);
    } else {
      return Promise.reject('Ad is already requested');
    }
  }

  presentAd() {
    return presentAd(this.requestId);
  }
}
