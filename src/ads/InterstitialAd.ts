import { NativeModules } from 'react-native';

import { FullScreenAdInterface, InterstitialAdEvent } from '../types';

import MobileAd from './MobileAd';

const { requestAd, presentAd } =
  NativeModules.RNAdMobInterstitial as FullScreenAdInterface;

type HandlerType = () => void | ((error: Error) => void);

let _interstitialRequest = 0;

export default class InterstitialAd extends MobileAd<
  HandlerType,
  InterstitialAdEvent
> {
  static createAd(unitId: string) {
    const requestId = _interstitialRequest++;
    return new InterstitialAd('Interstitial', requestId, unitId);
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
