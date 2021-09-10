import { useCallback, useEffect, useMemo, useState } from 'react';

import RewardedAd from '../ads/RewardedAd';
import {
  AdHookReturns,
  FullScreenAdOptions,
  RequestOptions,
  Reward,
} from '../types';

/**
 * React Hook for AdMob Rewarded Ad.
 * @param unitId Rewarded Ad Unit Id
 * @param options `FullScreenAdOptions`
 */
export default function useRewardedAd(
  unitId: string,
  options?: FullScreenAdOptions
): AdHookReturns {
  const rewardedAd = useMemo(
    () => RewardedAd.createAd(unitId, options),
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
      rewardedAd.load(requestOptions);
    },
    [rewardedAd]
  );

  const show = useCallback(() => {
    if (adPresented) {
      console.warn('[RNAdmob(RewardedAd)] Ad is already presented once.');
    } else if (adLoaded) {
      rewardedAd.show();
    } else {
      console.warn('[RNAdmob(RewardedAd)] Ad is not loaded.');
    }
  }, [rewardedAd, adPresented, adLoaded]);

  useEffect(() => {
    const loadListener = rewardedAd.addEventListener('adLoaded', () => {
      setAdLoaded(true);
      setAdPresented(false);
    });
    const loadFailListener = rewardedAd.addEventListener(
      'adFailedToLoad',
      (error: Error) => setAdLoadError(error)
    );
    const presentListener = rewardedAd.addEventListener('adPresented', () => {
      setAdPresented(true);
      setAdDismissed(false);
    });
    const presentFailListener = rewardedAd.addEventListener(
      'adFailedToPresent',
      (error: Error) => setAdPresentError(error)
    );
    const dismissListener = rewardedAd.addEventListener('adDismissed', () => {
      setAdDismissed(true);
      setAdLoaded(false);
    });
    const rewardListener = rewardedAd.addEventListener(
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
