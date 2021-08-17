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

export default class MobileAd<
  E extends string,
  H extends (event?: any) => any
> {
  type: AdType;
  requestId: number;
  unitId: string;
  requestOptions: RequestOptions;
  requested: boolean;
  listeners: EmitterSubscription[];

  constructor(type: AdType, requestId: number, unitId: string) {
    this.type = type;
    this.requestId = requestId;
    this.unitId = unitId;
    this.requestOptions = {};
    this.requested = false;
    this.listeners = [];
  }

  /**
   * Sets RequestOptions for this Ad instance.
   * @param requestOptions RequestOptions used to load the ad.
   */
  setRequestOptions(requestOptions: RequestOptions = {}) {
    this.requestOptions = requestOptions;
  }

  /**
   * Adds an event handler for an ad event.
   * @param event Event name
   * @param handler Event handler
   */
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
}
