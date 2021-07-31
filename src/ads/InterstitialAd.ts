import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

import { FullScreenAdInterface, InterstitialAdEvent } from '../types';

const RNAdMobInterstitial = NativeModules.RNAdMobInterstitial;

const eventEmitter = new NativeEventEmitter(RNAdMobInterstitial);

const eventMap = {
  adPresented: 'interstitialAdPresented',
  adFailedToPresent: 'interstitialAdFailedToPresent',
  adDismissed: 'interstitialAdDismissed',
};

type HandlerType = () => void | ((error: Error) => void);

const _subscriptions = new Map<HandlerType, EmitterSubscription>();

const addEventListener = (event: InterstitialAdEvent, handler: HandlerType) => {
  const mappedEvent = eventMap[event];
  if (mappedEvent) {
    const listener = eventEmitter.addListener(mappedEvent, handler);
    _subscriptions.set(handler, listener);
    return {
      remove: () => removeEventListener(handler),
    };
  } else {
    console.warn(`Trying to subscribe to unknown event: "${event}"`);
    return {
      remove: () => {},
    };
  }
};

const removeEventListener = (handler: HandlerType) => {
  const listener = _subscriptions.get(handler);
  if (!listener) {
    return;
  }
  listener.remove();
  _subscriptions.delete(handler);
};

const removeAllListeners = () => {
  _subscriptions.forEach((listener, key, map) => {
    listener.remove();
    map.delete(key);
  });
};

export default {
  ...(RNAdMobInterstitial as FullScreenAdInterface),
  addEventListener,
  removeEventListener,
  removeAllListeners,
};
