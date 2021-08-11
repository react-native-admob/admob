import { useCallback, useEffect, useMemo, useState } from 'react';

import RewardedInterstitialAd from '../ads/RewardedInterstitialAd';
import { AdHookOptions, AdHookResult, Reward } from '../types';

const defaultOptions: AdHookOptions = {
  requestOnMounted: true,
  presentOnLoaded: false,
  requestOnDismissed: false,
};

/**
 * React Hook for AdMob Rewarded Interstitial ad.
 * @param unitId Rewarded Interstitial Ad Unit Id
 * @param options `AdHookOptions`
 */
export default function useRewardedInterstitialAd(
  unitId: string,
  options = defaultOptions
): AdHookResult {
  const rewardedInterstitialAd = useMemo(
    () => RewardedInterstitialAd.createAd(unitId),
    [unitId]
  );
  const [adLoaded, setAdLoaded] = useState(false);
  const [adPresented, setAdPresented] = useState(false);
  const [adDismissed, setAdDismissed] = useState(false);
  const [adLoadError, setAdLoadError] = useState<Error>();
  const [adPresentError, setAdPresentError] = useState<Error>();
  const [reward, setReward] = useState<Reward>();
  const _options = Object.assign(defaultOptions, options);

  const init = () => {
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

  const requestAd = useCallback(() => {
    init();
    rewardedInterstitialAd
      .requestAd()
      .catch((e: Error) => setAdLoadError(e))
      .then(() => setAdLoaded(true));
  }, [rewardedInterstitialAd]);

  const presentAd = useCallback(() => {
    if (adPresented) {
      console.warn(
        '[RNAdMob(RewardedInterstitialAd)] Ad is already presented once.'
      );
    } else if (adLoaded) {
      rewardedInterstitialAd
        .presentAd()
        .catch((e: Error) => setAdPresentError(e))
        .then(() => setAdPresented(true));
    } else {
      console.warn('[RNAdMob(RewardedInterstitialAd)] Ad is not loaded.');
    }
  }, [rewardedInterstitialAd, adPresented, adLoaded]);

  useEffect(() => {
    if (!rewardedInterstitialAd.requested && _options?.requestOnMounted) {
      requestAd();
    }
  }, [rewardedInterstitialAd, _options, requestAd]);

  useEffect(() => {
    if (adLoaded && _options?.presentOnLoaded) {
      presentAd();
    }
  }, [adLoaded, _options, presentAd]);

  useEffect(() => {
    if (adDismissed && _options.requestOnDismissed) {
      requestAd();
    }
  }, [adDismissed, _options, requestAd]);

  useEffect(() => {
    rewardedInterstitialAd.addEventListener('adDismissed', () =>
      setAdDismissed(true)
    );
    rewardedInterstitialAd.addEventListener('rewarded', (r: Reward) =>
      setReward(r)
    );
    return () => rewardedInterstitialAd.removeAllListeners();
  }, [rewardedInterstitialAd]);

  return {
    adLoaded,
    adPresented,
    adDismissed,
    adShowing,
    adLoadError,
    adPresentError,
    reward,
    requestAd,
    presentAd,
  };
}
