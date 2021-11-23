import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  AppOpenAd,
  InterstitialAd,
  RewardedAd,
  RewardedInterstitialAd,
} from '../ads/fullscreen';
import { AdHookReturns, RequestOptions, Reward } from '../types';

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
  const [adLoadError, setAdLoadError] = useState<Error>();
  const [adPresentError, setAdPresentError] = useState<Error>();
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
        ad.load(requestOptions);
      }
    },
    [ad]
  );

  const show = useCallback(() => {
    if (ad) {
      ad.show();
    }
  }, [ad]);

  useEffect(() => {
    if (!ad) {
      initialize();
      return;
    }
    const isRewardedAd =
      ad instanceof RewardedAd || ad instanceof RewardedInterstitialAd;
    const listeners = [
      ad.addEventListener('adLoaded', () => {
        setAdLoaded(true);
        setAdPresented(false);
      }),
      ad.addEventListener('adFailedToLoad', (error: Error) =>
        setAdLoadError(error)
      ),
      ad.addEventListener('adPresented', () => {
        setAdPresented(true);
        setAdDismissed(false);
      }),
      ad.addEventListener('adFailedToPresent', (error: Error) =>
        setAdPresentError(error)
      ),
      ad.addEventListener('adDismissed', () => {
        setAdDismissed(true);
        setAdLoaded(false);
      }),
      isRewardedAd
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
