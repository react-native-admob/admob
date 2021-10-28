import {
  AppOpenAdEvent,
  AppOpenAdOptions,
  HandlerType,
  RequestOptions,
} from '../types';

import FullScreenAd from './FullScreenAd';

const defaultOptions: AppOpenAdOptions = {
  showOnColdStart: false,
  showOnAppForeground: true,
  requestOptions: {},
};

export default class AppOpenAd extends FullScreenAd<
  AppOpenAdEvent,
  HandlerType
> {
  private constructor(unitId: string, options: AppOpenAdOptions) {
    super('AppOpen', 0, unitId, options);
    this.options = options;
    this.setRequestOptions(options.requestOptions);
    this.addEventListener('adFailedToLoad', this.handleLoadError);
    this.load();
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
   * Creates a AppOpenAd instance. Ad is loaded automatically after created and dismissed.
   * @param unitId The Ad Unit ID for the App Open Ad. You can find this on your Google AdMob dashboard.
   * @param options Optional AppOpenAdOptions object.
   */
  static createAd(unitId: string, options?: AppOpenAdOptions) {
    const _options = { ...defaultOptions, ...options };

    if (this.sharedInstance) {
      if (this.sharedInstance.unitId === unitId) {
        this.sharedInstance.options = _options;
        return;
      }
      this.sharedInstance.removeAllListeners();
    }

    this.sharedInstance = new AppOpenAd(unitId, _options);
  }

  /**
   * Loads a new App Open ad.
   * @param requestOptions Optional RequestOptions used to load the ad.
   */
  static load(requestOptions?: RequestOptions) {
    this.checkInstance();
    return this.sharedInstance.load(requestOptions);
  }

  /**
   * Shows loaded App Open Ad.
   */
  static show() {
    this.checkInstance();
    return this.sharedInstance.show();
  }

  /**
   * Sets RequestOptions for this Ad instance.
   * @param requestOptions RequestOptions used to load the ad.
   */
  static setRequestOptions(requestOptions?: RequestOptions) {
    this.checkInstance();
    this.sharedInstance.setRequestOptions(requestOptions);
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
