import { useCallback, useEffect, useMemo, useState } from 'react';

import AdError from '../AdError';
import {
  AppOpenAd,
  InterstitialAd,
  RewardedAd,
  RewardedInterstitialAd,
} from '../ads/fullscreen';
import {
  AdHookReturns,
  FullScreenAdOptions,
  RequestOptions,
  Reward,
} from '../types';

export default function useFullScreenAd<
  T extends
    | InterstitialAd
    | RewardedAd
    | RewardedInterstitialAd
    | AppOpenAd
    | null
>(ad: T): AdHookReturns {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adPresented, setAdPresented] = useState(false);
  const [adDismissed, setAdDismissed] = useState(false);
  const [adLoadError, setAdLoadError] = useState<AdError>();
  const [adPresentError, setAdPresentError] = useState<AdError>();
  const [reward, setReward] = useState<Reward>();

  const adShowing = useMemo(
    () => adPresented && !adDismissed,
    [adPresented, adDismissed]
  );

  const initialize = () => {
    setAdLoaded(false);
    setAdPresented(false);
    setAdDismissed(false);
    setAdLoadError(undefined);
    setAdPresentError(undefined);
    setReward(undefined);
  };

  const load = useCallback(
    (requestOptions?: RequestOptions) => {
      if (ad) {
        initialize();
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
    if (!ad) {
      initialize();
      return;
    }
    const listeners = [
      ad.addEventListener('adLoaded', () => {
        setAdLoaded(true);
      }),
      ad.addEventListener('adFailedToLoad', (error: AdError) =>
        setAdLoadError(error)
      ),
      ad.addEventListener('adPresented', () => {
        setAdPresented(true);
      }),
      ad.addEventListener('adFailedToPresent', (error: AdError) =>
        setAdPresentError(error)
      ),
      ad.addEventListener('adDismissed', () => {
        setAdDismissed(true);
        if (
          ad.type !== 'AppOpen' &&
          (ad.options as FullScreenAdOptions).loadOnDismissed
        ) {
          initialize();
        }
      }),
      ad.type === 'Rewarded' || ad.type === 'RewardedInterstitial'
        ? (ad as RewardedAd | RewardedInterstitialAd).addEventListener(
            'rewarded',
            (r: Reward) => setReward(r)
          )
        : undefined,
    ];
    return () => {
      listeners.forEach((listener) => listener?.remove());
    };
  }, [ad]);

  return {
    adLoaded,
    adPresented,
    adDismissed,
    adShowing,
    adLoadError,
    adPresentError,
    reward,
    load,
    show,
  };
}
