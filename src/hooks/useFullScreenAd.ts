import { useCallback, useEffect, useMemo, useState } from 'react';

import AppOpenAd from '../ads/AppOpenAd';
import InterstitialAd from '../ads/InterstitialAd';
import RewardedAd from '../ads/RewardedAd';
import RewardedInterstitialAd from '../ads/RewardedInterstitialAd';
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

  const initialize = () => {
    setAdLoaded(false);
    setAdPresented(false);
    setAdDismissed(false);
    setAdLoadError(undefined);
    setAdPresentError(undefined);
    setReward(undefined);
  };

  const adShowing = useMemo(
    () => adPresented && !adDismissed,
    [adPresented, adDismissed]
  );

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
    const loadListener = ad.addEventListener('adLoaded', () => {
      setAdLoaded(true);
      setAdPresented(false);
    });
    const loadFailListener = ad.addEventListener(
      'adFailedToLoad',
      (error: Error) => setAdLoadError(error)
    );
    const presentListener = ad.addEventListener('adPresented', () => {
      setAdPresented(true);
      setAdDismissed(false);
    });
    const presentFailListener = ad.addEventListener(
      'adFailedToPresent',
      (error: Error) => setAdPresentError(error)
    );
    const dismissListener = ad.addEventListener('adDismissed', () => {
      setAdDismissed(true);
      setAdLoaded(false);
    });
    const isRewardedAd =
      ad instanceof RewardedAd || ad instanceof RewardedInterstitialAd;
    let rewardListener = isRewardedAd
      ? (ad as RewardedAd | RewardedInterstitialAd).addEventListener(
          'rewarded',
          (r: Reward) => setReward(r)
        )
      : undefined;
    return () => {
      loadListener.remove();
      loadFailListener.remove();
      presentListener.remove();
      presentFailListener.remove();
      dismissListener.remove();
      rewardListener?.remove();
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
