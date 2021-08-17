import { AppState, AppStateStatus, NativeModules } from 'react-native';
import {
  AppOpenAdEvent,
  AppOpenAdOptions,
  FullScreenAdInterface,
  HandlerType,
  RequestOptions,
} from 'src/types';

import MobileAd from './MobileAd';

const { requestAd, presentAd } =
  NativeModules.RNAdMobAppOpen as FullScreenAdInterface;

const defaultOptions: AppOpenAdOptions = {
  showOnColdStart: false,
  showOnAppForeground: true,
  requestOptions: {},
};

export default class AppOpenAd extends MobileAd<AppOpenAdEvent, HandlerType> {
  private constructor(unitId: string) {
    super('AppOpen', 0, unitId);
  }

  private currentAppState: AppStateStatus = 'unknown';

  private handleLoadError = (error: Error) => {
    if (error.message.startsWith('Frequency')) {
      console.info(
        '[RNAdmob(AppOpenAd)] Ad not loaded because frequency cap reached.'
      );
    } else {
      console.error(error);
    }
  };

  private handleAppStateChange = (state: AppStateStatus) => {
    if (this.currentAppState === 'background' && state === 'active') {
      AppOpenAd.show().catch((err) => {
        if (err.code === 'E_AD_NOT_READY') {
          AppOpenAd.load().catch(this.handleLoadError);
        }
      });
    }
    this.currentAppState = state;
  };

  static sharedInstance: AppOpenAd;

  private static checkInstance() {
    if (!this.sharedInstance) {
      throw new Error('[RNAdmob(AppOpenAd)] AppOpenAd is not created.');
    }
  }

  /**
   * Creates a AppOpenAd instance. You can create AppOpenAd only once in your app. Ad is loaded automatically after created and dismissed.
   * @param unitId The Ad Unit ID for the App Open Ad. You can find this on your Google AdMob dashboard.
   * @param options Optional AppOpenAdOptions object.
   */
  static createAd(unitId: string, options: AppOpenAdOptions) {
    if (this.sharedInstance) {
      throw new Error(
        '[RNAdmob(AppOpenAd)] You already created AppOpenAd once.'
      );
    }

    const { showOnColdStart, showOnAppForeground, requestOptions } =
      Object.assign(defaultOptions, options);

    this.sharedInstance = new AppOpenAd(unitId);
    this.sharedInstance.setRequestOptions(requestOptions);
    this.sharedInstance.addEventListener('adDismissed', () => {
      this.load().catch(this.sharedInstance.handleLoadError);
    });

    this.load()
      .then(() => {
        if (showOnColdStart) {
          this.show();
        }
      })
      .catch(this.sharedInstance.handleLoadError);

    if (showOnAppForeground) {
      AppState.addEventListener(
        'change',
        this.sharedInstance.handleAppStateChange
      );
    }
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
    return this.sharedInstance.setRequestOptions(requestOptions);
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
