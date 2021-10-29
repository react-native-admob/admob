import { useCallback, useEffect, useMemo, useState } from 'react';
import AppOpenAd from 'src/ads/AppOpenAd';

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

  const init = () => {
    setAdLoaded(false);
    setAdPresented(false);
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
        init();
        ad.load(requestOptions);
      } else {
        console.warn('Ad is not created. Did you set unitId?');
      }
    },
    [ad]
  );

  const show = useCallback(() => {
    if (ad && adLoaded) {
      if (!adPresented) {
        ad.show();
      } else {
        console.warn('Ad is already presented once.');
      }
    } else {
      console.warn('Ad is not loaded.');
    }
  }, [ad, adPresented, adLoaded]);

  useEffect(() => {
    if (!ad) {
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
    const rewardListener = isRewardedAd
      ? ad.addEventListener('rewarded', (r: Reward) => setReward(r))
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
