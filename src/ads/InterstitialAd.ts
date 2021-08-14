import { NativeModules } from 'react-native';

import {
  FullScreenAdInterface,
  HandlerType,
  InterstitialAdEvent,
  RequestOptions,
} from '../types';

import MobileAd from './MobileAd';

const { requestAd, presentAd } =
  NativeModules.RNAdMobInterstitial as FullScreenAdInterface;

let _interstitialRequest = 0;

export default class InterstitialAd extends MobileAd<
  InterstitialAdEvent,
  HandlerType
> {
  /**
   * Creates a new InterstitialAd instance.
   * @param adUnitId The Ad Unit ID for the Interstitial Ad. You can find this on your Google AdMob dashboard.
   */
  static createAd(unitId: string) {
    const requestId = _interstitialRequest++;
    return new InterstitialAd('Interstitial', requestId, unitId);
  }

  /**
   * Loads a new Interstitial Ad.
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
   * Shows loaded Interstitial Ad.
   */
  show() {
    return presentAd(this.requestId);
  }
}
