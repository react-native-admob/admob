import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

import AdError from '../../AdError';
import {
  AdType,
  AppOpenAdOptions,
  FullScreenAdEvent,
  FullScreenAdHandlerType,
  FullScreenAdOptions,
  RequestOptions,
  RewardedAdEvent,
  RewardedAdHandlerType,
} from '../../types';

const RNAdMobEvent = NativeModules.RNAdMobEvent;

const eventEmitter = new NativeEventEmitter(RNAdMobEvent);

type Event = {
  type: AdType;
  requestId: number;
  data?: any;
};

interface FullScreenAdInterface {
  requestAd: (
    requestId: number,
    unitId: string,
    options: FullScreenAdOptions | AppOpenAdOptions
  ) => Promise<void>;
  presentAd: (requestId: number) => Promise<void>;
  destroyAd: (requestId: number) => void;
}

const defaultOptions: FullScreenAdOptions = {
  loadOnMounted: true,
  showOnLoaded: false,
  loadOnDismissed: false,
  requestOptions: {},
};

export default class FullScreenAd<
  E extends RewardedAdEvent = FullScreenAdEvent,
  H extends RewardedAdHandlerType = FullScreenAdHandlerType
> {
  readonly type: AdType;
  readonly requestId: number;
  readonly unitId: string;
  readonly options: FullScreenAdOptions | AppOpenAdOptions;
  private listeners: EmitterSubscription[];
  private nativeModule: FullScreenAdInterface;

  protected constructor(
    type: AdType,
    requestId: number,
    unitId: string,
    options?: FullScreenAdOptions | AppOpenAdOptions
  ) {
    this.type = type;
    this.requestId = requestId;
    this.unitId = unitId;
    this.listeners = [];
    this.options =
      type === 'AppOpen' ? options! : { ...defaultOptions, ...options };
    this.nativeModule = NativeModules[`RNAdMob${type}Ad`];
    if (
      type === 'AppOpen' ||
      (this.options as FullScreenAdOptions).loadOnMounted
    ) {
      this.load().catch(() => {});
    }
  }

  /**
   * Sets RequestOptions for this Ad instance.
   * @param requestOptions RequestOptions used to load the ad.
   */
  setRequestOptions(requestOptions: RequestOptions = {}) {
    this.options.requestOptions = requestOptions;
  }

  /**
   * Adds an event handler for an ad event.
   * @param event Event name
   * @param handler Event handler
   */
  addEventListener(event: E, handler: H) {
    const eventHandler = (e: Event) => {
      if (e.type === this.type && e.requestId === this.requestId) {
        if (event === 'adFailedToLoad' || event === 'adFailedToPresent') {
          // @ts-ignore
          handler(new AdError(e.data.message, e.data.code));
        } else {
          handler(e.data);
        }
      }
    };
    const listener = eventEmitter.addListener(event, eventHandler);
    this.listeners.push(listener);
    return {
      remove: () => {
        listener.remove();
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
          this.listeners.splice(index, 1);
        }
      },
    };
  }

  /**
   * Removes all registered event handlers for this ad.
   */
  removeAllListeners() {
    this.listeners.forEach((listener) => listener.remove());
    this.listeners = [];
  }

  /**
   * Loads a new Ad.
   * @param requestOptions Optional RequestOptions used to load the ad.
   */
  async load(requestOptions: RequestOptions = {}) {
    const options = {
      ...this.options,
      ...({
        requestOptions,
      } as FullScreenAdOptions | AppOpenAdOptions),
    };
    try {
      return this.nativeModule.requestAd(this.requestId, this.unitId, options);
    } catch (error: any) {
      if (error.code === 'adFailedToLoad') {
        return Promise.reject(
          new AdError(error.userInfo.message, error.userInfo.code)
        );
      } else {
        return Promise.reject(error);
      }
    }
  }

  /**
   * Shows loaded Ad.
   */
  async show() {
    try {
      return this.nativeModule.presentAd(this.requestId);
    } catch (error: any) {
      if (error.code === 'adFailedToPresent') {
        return Promise.reject(
          new AdError(error.userInfo.message, error.userInfo.code)
        );
      } else {
        return Promise.reject(error);
      }
    }
  }

  /**
   * Destroys the Ad.
   */
  destroy() {
    this.removeAllListeners();
    this.nativeModule.destroyAd(this.requestId);
  }
}
