import { useEffect, useState } from 'react';

import RewardedInterstitialAd from '../ads/RewardedInterstitialAd';
import { AdHookReturns, FullScreenAdOptions } from '../types';

import useFullScreenAd from './useFullScreenAd';

/**
 * React Hook for AdMob Rewarded Interstitial Ad.
 * @param unitId Rewarded Interstitial Ad Unit Id
 * @param options `FullScreenAdOptions`
 */
export default function useRewardedInterstitialAd(
  unitId: string | null,
  options?: FullScreenAdOptions
): AdHookReturns {
  const [rewardedInterstitialAd, setRewardedInterstitialAd] =
    useState<RewardedInterstitialAd | null>(null);
  const returns = useFullScreenAd(rewardedInterstitialAd);

  useEffect(() => {
    if (!unitId) {
      setRewardedInterstitialAd((prevAd) => {
        if (prevAd) {
          prevAd.destroy();
        }
        return null;
      });
      return;
    }
    setRewardedInterstitialAd(RewardedInterstitialAd.createAd(unitId, options));
  }, [unitId, options]);

  return returns;
}
