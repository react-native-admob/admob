import { Reducer, useCallback, useEffect, useReducer } from 'react';

import AdError from '../AdError';
import {
  AppOpenAd,
  InterstitialAd,
  RewardedAd,
  RewardedInterstitialAd,
} from '../ads/fullscreen';
import {
  AdHookReturns,
  FullScreenAdState,
  RequestOptions,
  Reward,
} from '../types';

const initialState: FullScreenAdState = {
  adLoaded: false,
  adPresented: false,
  adDismissed: false,
  adLoadError: undefined,
  adPresentError: undefined,
  reward: undefined,
};

export default function useFullScreenAd<
  T extends
    | InterstitialAd
    | RewardedAd
    | RewardedInterstitialAd
    | AppOpenAd
    | null
>(ad: T): AdHookReturns {
  const [state, setState] = useReducer<
    Reducer<FullScreenAdState, Partial<FullScreenAdState>>
  >((prevState, newState) => ({ ...prevState, ...newState }), initialState);
  const adShowing = state.adPresented && !state.adDismissed;

  const load = useCallback(
    (requestOptions?: RequestOptions) => {
      if (ad) {
        setState(initialState);
        ad.load(requestOptions).catch(() => {});
      }
    },
    [ad]
  );

  const show = useCallback(() => {
    if (ad) {
      ad.show().catch(() => {});
    }
  }, [ad]);

  useEffect(() => {
    setState(initialState);
    if (!ad) {
      return;
    }
    const listeners = [
      ad.addEventListener('adLoaded', () => setState({ adLoaded: true })),
      ad.addEventListener('adFailedToLoad', (error: AdError) =>
        setState({ adLoadError: error })
      ),
      ad.addEventListener('adPresented', () => setState({ adPresented: true })),
      ad.addEventListener('adFailedToPresent', (error: AdError) =>
        setState({ adPresentError: error })
      ),
      ad.addEventListener('adDismissed', () => {
        setState({ adDismissed: true });
        if (ad.options.loadOnDismissed) {
          setState(initialState);
        }
      }),
      ad.type === 'Rewarded' || ad.type === 'RewardedInterstitial'
        ? (ad as RewardedAd | RewardedInterstitialAd).addEventListener(
            'rewarded',
            (reward: Reward) => setState({ reward })
          )
        : undefined,
    ];
    return () => {
      listeners.forEach((listener) => listener?.remove());
    };
  }, [ad]);

  return {
    ...state,
    adShowing,
    load,
    show,
  };
}
