import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

import {
  AdType,
  AppOpenAdOptions,
  FullScreenAdOptions,
  RequestOptions,
} from '../types';

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

const requestIdMap = new Map<AdType, Set<number>>();
requestIdMap.set('Interstitial', new Set());
requestIdMap.set('Rewarded', new Set());
requestIdMap.set('RewardedInterstitial', new Set());
requestIdMap.set('AppOpen', new Set());

export default class FullScreenAd<
  E extends string,
  H extends (event?: any) => any
> {
  type: AdType;
  requestId: number;
  unitId: string;
  listeners: EmitterSubscription[];
  options: FullScreenAdOptions | AppOpenAdOptions;
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
      type !== 'AppOpen' &&
      (this.options as FullScreenAdOptions).loadOnMounted &&
      !requestIdMap.get(type)?.has(requestId)
    ) {
      this.load();
    }
    requestIdMap.get(type)?.add(requestId);
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
        handler(e.data);
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
  load(requestOptions: RequestOptions = {}) {
    const options = {
      ...this.options,
      ...({
        requestOptions,
      } as FullScreenAdOptions | AppOpenAdOptions),
    };
    return this.nativeModule.requestAd(this.requestId, this.unitId, options);
  }

  /**
   * Shows loaded Ad.
   */
  show() {
    return this.nativeModule.presentAd(this.requestId);
  }

  /**
   * Destroys the Ad.
   */
  destroy() {
    this.removeAllListeners();
    requestIdMap.get(this.type)?.delete(this.requestId);
    this.nativeModule.destroyAd(this.requestId);
  }
}
