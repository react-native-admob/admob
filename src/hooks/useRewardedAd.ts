import { useCallback, useEffect, useMemo, useState } from 'react';

import RewardedAd from '../ads/RewardedAd';
import { AdHookOptions, AdHookReturns, RequestOptions, Reward } from '../types';

const defaultOptions: AdHookOptions = {
  loadOnMounted: true,
  showOnLoaded: false,
  loadOnDismissed: false,
  requestOptions: {},
};

/**
 * React Hook for AdMob Rewarded Ad.
 * @param unitId Rewarded Ad Unit Id
 * @param options `AdHookOptions`
 */
export default function useRewardedAd(
  unitId: string,
  options = defaultOptions
): AdHookReturns {
  const rewardedAd = useMemo(() => RewardedAd.createAd(unitId), [unitId]);
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
      rewardedAd
        .load(requestOptions)
        .catch((e: Error) => setAdLoadError(e))
        .then(() => setAdLoaded(true));
    },
    [rewardedAd, adRequestOptions]
  );

  const show = useCallback(() => {
    if (adPresented) {
      console.warn('[RNAdmob(RewardedAd)] Ad is already presented once.');
    } else if (adLoaded) {
      rewardedAd
        .show()
        .catch((e: Error) => setAdPresentError(e))
        .then(() => setAdPresented(true));
    } else {
      console.warn('[RNAdmob(RewardedAd)] Ad is not loaded.');
    }
  }, [rewardedAd, adPresented, adLoaded]);

  useEffect(() => {
    if (!rewardedAd.requested && loadOnMounted) {
      load();
    }
  }, [rewardedAd, loadOnMounted, load]);

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
    load,
    show,
  };
}
