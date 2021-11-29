import {
  AppOpenAdOptions,
  FullScreenAdEvent,
  FullScreenAdHandlerType,
  RequestOptions,
} from '../../types';

import FullScreenAd from './FullScreenAd';

const defaultOptions: AppOpenAdOptions = {
  showOnColdStart: false,
  showOnAppForeground: true,
  loadOnDismissed: true,
  requestOptions: {},
};

let _appOpenRequest = 0;

export default class AppOpenAd extends FullScreenAd {
  private constructor(
    requestId: number,
    unitId: string,
    options: AppOpenAdOptions
  ) {
    super('AppOpen', requestId, unitId, options);
  }

  private static sharedInstance: AppOpenAd | null = null;

  private static checkInstance() {
    if (!this.sharedInstance) {
      throw new Error('AppOpenAd is not created.');
    }
  }

  /**
   * Creates a AppOpenAd instance. Ad is loaded automatically after created and after dismissed.
   * @param unitId The Ad Unit ID for the App Open Ad. You can find this on your Google AdMob dashboard.
   * @param options Optional AppOpenAdOptions object.
   */
  static createAd(unitId: string, options?: AppOpenAdOptions) {
    const _options = { ...defaultOptions, ...options };

    this.sharedInstance?.destroy();

    const requestId = _appOpenRequest++;
    this.sharedInstance = new AppOpenAd(requestId, unitId, _options);
    return this.sharedInstance;
  }

  /**
   * Returns loaded App Open Ad instance.
   */
  static getAd() {
    return this.sharedInstance;
  }

  /**
   * Loads a new App Open ad.
   * @param requestOptions Optional RequestOptions used to load the ad.
   */
  static load(requestOptions?: RequestOptions) {
    this.checkInstance();
    return this.sharedInstance!.load(requestOptions);
  }

  /**
   * Shows loaded App Open Ad.
   */
  static show() {
    this.checkInstance();
    return this.sharedInstance!.show();
  }

  /**
   * Destroys the App Open Ad.
   */
  static destroy() {
    this.checkInstance();
    this.sharedInstance!.destroy();
    this.sharedInstance = null;
  }

  /**
   * Sets RequestOptions for this Ad instance.
   * @param requestOptions RequestOptions used to load the ad.
   */
  static setRequestOptions(requestOptions?: RequestOptions) {
    this.checkInstance();
    return this.sharedInstance!.setRequestOptions(requestOptions);
  }

  /**
   * Adds an event handler for an ad event.
   * @param event Event name
   * @param handler Event handler
   */
  static addEventListener(
    event: FullScreenAdEvent,
    handler: FullScreenAdHandlerType
  ) {
    this.checkInstance();
    return this.sharedInstance!.addEventListener(event, handler);
  }

  /**
   * Removes all registered event handlers for this ad.
   */
  static removeAllListeners() {
    this.checkInstance();
    return this.sharedInstance!.removeAllListeners();
  }
}
