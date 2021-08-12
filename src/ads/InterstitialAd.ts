import { NativeModules } from 'react-native';

import {
  FullScreenAdInterface,
  InterstitialAdEvent,
  RequestOptions,
} from '../types';

import MobileAd from './MobileAd';

const { requestAd, presentAd } =
  NativeModules.RNAdMobInterstitial as FullScreenAdInterface;

type HandlerType = () => void | ((error: Error) => void);

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
   * Requests a new Interstitial Ad.
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
   * Presents loaded Interstitial Ad.
   */
  presentAd() {
    return presentAd(this.requestId);
  }
}
