import { useCallback, useEffect, useMemo, useState } from 'react';

import RewardedAd from '../ads/RewardedAd';
import { AdHookOptions, AdHookResult, Reward } from '../types';

const defaultOptions: AdHookOptions = {
  requestOnMounted: true,
  presentOnLoaded: false,
  requestOnDismissed: false,
};

/**
 * React Hook for AdMob Rewarded ad.
 * @param unitId Rewarded Ad Unit Id
 * @param options `AdHookOptions`
 */
export default function useRewardedAd(
  unitId: string,
  options = defaultOptions
): AdHookResult {
  const rewardedAd = useMemo(() => RewardedAd.createAd(unitId), [unitId]);
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
    rewardedAd
      .requestAd()
      .catch((e: Error) => setAdLoadError(e))
      .then(() => setAdLoaded(true));
  }, [rewardedAd]);

  const presentAd = useCallback(() => {
    if (adPresented) {
      console.warn('[RNAdmob(RewardedAd)] Ad is already presented once.');
    } else if (adLoaded) {
      rewardedAd
        .presentAd()
        .catch((e: Error) => setAdPresentError(e))
        .then(() => setAdPresented(true));
    } else {
      console.warn('[RNAdmob(RewardedAd)] Ad is not loaded.');
    }
  }, [rewardedAd, adPresented, adLoaded]);

  useEffect(() => {
    if (!rewardedAd.requested && _options?.requestOnMounted) {
      requestAd();
    }
  }, [rewardedAd, _options, requestAd]);

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
    rewardedAd.addEventListener('adDismissed', () => setAdDismissed(true));
    rewardedAd.addEventListener('rewarded', (r: Reward) => setReward(r));
    return () => rewardedAd.removeAllListeners();
  }, [rewardedAd]);

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
