import { NativeModules } from 'react-native';
import {
  AppOpenAdEvent,
  AppOpenAdOptions,
  FullScreenAdInterface,
  HandlerType,
  RequestOptions,
} from 'src/types';

import MobileAd from './MobileAd';

interface AppOpenAdInterface extends FullScreenAdInterface {
  setUnitId: (unitId: string) => void;
  setOptions: (options: AppOpenAdOptions) => void;
}

const { requestAd, presentAd, setUnitId, setOptions } =
  NativeModules.RNAdMobAppOpen as AppOpenAdInterface;

const defaultOptions: AppOpenAdOptions = {
  showOnColdStart: false,
  showOnAppForeground: true,
  requestOptions: {},
};

export default class AppOpenAd extends MobileAd<AppOpenAdEvent, HandlerType> {
  private options: AppOpenAdOptions;

  private constructor(unitId: string, options: AppOpenAdOptions) {
    super('AppOpen', 0, unitId);
    this.options = options;
    this.setRequestOptions(options.requestOptions);
    this.addEventListener('adFailedToLoad', this.handleLoadError);
    setUnitId(unitId);
    setOptions(options);
  }

  private handleLoadError = (error: Error) => {
    if (error.message.startsWith('Frequency')) {
      console.info(
        '[RNAdmob(AppOpenAd)] Ad not loaded because frequency cap reached.'
      );
    } else {
      console.error(error);
    }
  };

  static sharedInstance: AppOpenAd;

  private static checkInstance() {
    if (!this.sharedInstance) {
      throw new Error('[RNAdmob(AppOpenAd)] AppOpenAd is not created.');
    }
  }

  /**
   * Creates a AppOpenAd instance. If you create ad more than once, ad created before is destroyed. Ad is loaded automatically after created and dismissed.
   * @param unitId The Ad Unit ID for the App Open Ad. You can find this on your Google AdMob dashboard.
   * @param options Optional AppOpenAdOptions object.
   */
  static createAd(unitId: string, options: AppOpenAdOptions) {
    if (this.sharedInstance) {
      this.sharedInstance.removeAllListeners();
    }

    const _options = Object.assign(defaultOptions, options);

    this.sharedInstance = new AppOpenAd(unitId, _options);
  }

  /**
   * Loads a new App Open ad.
   * @param requestOptions Optional RequestOptions used to load the ad.
   */
  static load(requestOptions?: RequestOptions) {
    this.checkInstance();
    return requestAd(
      this.sharedInstance.requestId,
      this.sharedInstance.unitId,
      requestOptions || this.sharedInstance.requestOptions
    );
  }

  /**
   * Shows loaded App Open Ad.
   */
  static show() {
    this.checkInstance();
    return presentAd(this.sharedInstance.requestId);
  }

  /**
   * Sets RequestOptions for this Ad instance.
   * @param requestOptions RequestOptions used to load the ad.
   */
  static setRequestOptions(requestOptions?: RequestOptions) {
    this.checkInstance();
    this.sharedInstance.setRequestOptions(requestOptions);

    let options = { ...this.sharedInstance.options };
    options.requestOptions = requestOptions || {};
    setOptions(options);
  }

  /**
   * Adds an event handler for an ad event.
   * @param event Event name
   * @param handler Event handler
   */
  static addEventListener(event: AppOpenAdEvent, handler: HandlerType) {
    this.checkInstance();
    return this.sharedInstance.addEventListener(event, handler);
  }

  /**
   * Removes all registered event handlers for this ad.
   */
  static removeAllListeners() {
    this.checkInstance();
    return this.sharedInstance.removeAllListeners();
  }
}
