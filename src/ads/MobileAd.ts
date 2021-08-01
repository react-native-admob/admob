import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

import { AdType } from '../types';

const RNAdMobEvent = NativeModules.RNAdMobEvent;

const eventEmitter = new NativeEventEmitter(RNAdMobEvent);

type Event = {
  type: AdType;
  requestId: number;
  data?: any;
};
type EventHandler = (event: Event) => any;

export default class MobileAd<
  H extends (event?: any) => any,
  E extends string
> {
  type: AdType;
  requestId: number;
  unitId: string;
  subscriptions: Map<EventHandler, EmitterSubscription>;
  requested: boolean;

  constructor(type: AdType, requestId: number, unitId: string) {
    this.type = type;
    this.requestId = requestId;
    this.unitId = unitId;
    this.subscriptions = new Map<EventHandler, EmitterSubscription>();
    this.requested = false;
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
