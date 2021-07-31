import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

import { FullScreenAdInterface, Reward, RewardedAdEvent } from './types';

const RNAdMobRewarded = NativeModules.RNAdMobRewarded;

const eventEmitter = new NativeEventEmitter(RNAdMobRewarded);

const eventMap = {
  adPresented: 'rewardedAdPresented',
  adFailedToPresent: 'rewardedAdFailedToPresent',
  adDismissed: 'rewardedAdDismissed',
  rewarded: 'rewardedAdRewarded',
};

type HandlerType =
  | (() => void)
  | ((error: Error) => void)
  | ((reward: Reward) => void);

const _subscriptions = new Map<HandlerType, EmitterSubscription>();

const addEventListener = (event: RewardedAdEvent, handler: HandlerType) => {
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
  ...(RNAdMobRewarded as FullScreenAdInterface),
  addEventListener,
  removeEventListener,
  removeAllListeners,
};
