import { useCallback, useEffect, useMemo, useState } from 'react';

import RewardedInterstitialAd from '../ads/RewardedInterstitialAd';
import {
  AdHookReturns,
  FullScreenAdOptions,
  RequestOptions,
  Reward,
} from '../types';

/**
 * React Hook for AdMob Rewarded Interstitial Ad.
 * @param unitId Rewarded Interstitial Ad Unit Id
 * @param options `FullScreenAdOptions`
 */
export default function useRewardedInterstitialAd(
  unitId: string,
  options?: FullScreenAdOptions
): AdHookReturns {
  const rewardedInterstitialAd = useMemo(
    () => RewardedInterstitialAd.createAd(unitId, options),
    [unitId, options]
  );
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
      init();
      rewardedInterstitialAd.load(requestOptions);
    },
    [rewardedInterstitialAd]
  );

  const show = useCallback(() => {
    if (adPresented) {
      console.warn(
        '[RNAdMob(RewardedInterstitialAd)] Ad is already presented once.'
      );
    } else if (adLoaded) {
      rewardedInterstitialAd.show();
    } else {
      console.warn('[RNAdMob(RewardedInterstitialAd)] Ad is not loaded.');
    }
  }, [rewardedInterstitialAd, adPresented, adLoaded]);

  useEffect(() => {
    const loadListener = rewardedInterstitialAd.addEventListener(
      'adLoaded',
      () => {
        setAdLoaded(true);
        setAdPresented(false);
      }
    );
    const loadFailListener = rewardedInterstitialAd.addEventListener(
      'adFailedToLoad',
      (error: Error) => setAdLoadError(error)
    );
    const presentListener = rewardedInterstitialAd.addEventListener(
      'adPresented',
      () => {
        setAdPresented(true);
        setAdDismissed(false);
      }
    );
    const presentFailListener = rewardedInterstitialAd.addEventListener(
      'adFailedToPresent',
      (error: Error) => setAdPresentError(error)
    );
    const dismissListener = rewardedInterstitialAd.addEventListener(
      'adDismissed',
      () => {
        setAdDismissed(true);
        setAdLoaded(false);
      }
    );
    const rewardListener = rewardedInterstitialAd.addEventListener(
      'rewarded',
      (r: Reward) => setReward(r)
    );
    return () => {
      loadListener.remove();
      loadFailListener.remove();
      presentListener.remove();
      presentFailListener.remove();
      dismissListener.remove();
      rewardListener.remove();
    };
  }, [rewardedInterstitialAd]);

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
