import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

import { AdType, RequestOptions } from '../types';

const RNAdMobEvent = NativeModules.RNAdMobEvent;

const eventEmitter = new NativeEventEmitter(RNAdMobEvent);

type Event = {
  type: AdType;
  requestId: number;
  data?: any;
};
type EventHandler = (event: Event) => any;

export default class MobileAd<
  E extends string,
  H extends (event?: any) => any
> {
  type: AdType;
  requestId: number;
  unitId: string;
  requestOptions: RequestOptions;
  subscriptions: Map<EventHandler, EmitterSubscription>;
  requested: boolean;

  constructor(type: AdType, requestId: number, unitId: string) {
    this.type = type;
    this.requestId = requestId;
    this.unitId = unitId;
    this.requestOptions = {};
    this.subscriptions = new Map<EventHandler, EmitterSubscription>();
    this.requested = false;
  }

  /**
   * Sets RequestOptions for this Ad instance.
   * @param requestOptions RequestOptions used to load the ad.
   */
  setRequestOptions(requestOptions: RequestOptions = {}) {
    this.requestOptions = requestOptions;
  }

  addEventListener(event: E, handler: H) {
    const eventHandler = (e: Event) => {
      if (e.type === this.type && e.requestId === this.requestId) {
        if (event === 'adDismissed') {
          this.requested = false;
        }
        handler(e.data);
      }
    };
    const listener = eventEmitter.addListener(event, eventHandler);
    this.subscriptions.set(eventHandler, listener);
    return {
      remove: () => this.removeEventListener(handler),
    };
  }

  removeEventListener(handler: H) {
    const listener = this.subscriptions.get(handler);
    if (!listener) {
      return;
    }
    listener.remove();
    this.subscriptions.delete(handler);
  }

  removeAllListeners() {
    this.subscriptions.forEach((listener, key, map) => {
      listener.remove();
      map.delete(key);
    });
  }
}
