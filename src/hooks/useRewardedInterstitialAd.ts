import { useCallback, useEffect, useMemo, useState } from 'react';

import RewardedInterstitialAd from '../ads/RewardedInterstitialAd';
import { AdHookOptions, AdHookReturns, RequestOptions, Reward } from '../types';

const defaultOptions: AdHookOptions = {
  loadOnMounted: true,
  showOnLoaded: false,
  loadOnDismissed: false,
  requestOptions: {},
};

/**
 * React Hook for AdMob Rewarded Interstitial ad.
 * @param unitId Rewarded Interstitial Ad Unit Id
 * @param options `AdHookOptions`
 */
export default function useRewardedInterstitialAd(
  unitId: string,
  options = defaultOptions
): AdHookReturns {
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
  const {
    loadOnMounted,
    showOnLoaded,
    loadOnDismissed,
    requestOptions: adRequestOptions,
  } = Object.assign(defaultOptions, options);

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

  const load = useCallback(
    (requestOptions: RequestOptions = adRequestOptions!) => {
      init();
      rewardedInterstitialAd
        .load(requestOptions)
        .catch((e: Error) => setAdLoadError(e))
        .then(() => setAdLoaded(true));
    },
    [rewardedInterstitialAd, adRequestOptions]
  );

  const show = useCallback(() => {
    if (adPresented) {
      console.warn(
        '[RNAdMob(RewardedInterstitialAd)] Ad is already presented once.'
      );
    } else if (adLoaded) {
      rewardedInterstitialAd
        .show()
        .catch((e: Error) => setAdPresentError(e))
        .then(() => setAdPresented(true));
    } else {
      console.warn('[RNAdMob(RewardedInterstitialAd)] Ad is not loaded.');
    }
  }, [rewardedInterstitialAd, adPresented, adLoaded]);

  useEffect(() => {
    if (!rewardedInterstitialAd.requested && loadOnMounted) {
      load();
    }
  }, [rewardedInterstitialAd, loadOnMounted, load]);

  useEffect(() => {
    if (adLoaded && showOnLoaded) {
      show();
    }
  }, [adLoaded, showOnLoaded, show]);

  useEffect(() => {
    if (adDismissed && loadOnDismissed) {
      load();
    }
  }, [adDismissed, loadOnDismissed, load]);

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
    load,
    show,
  };
}
