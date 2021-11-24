import { useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { RewardedInterstitialAd } from '../ads/fullscreen';
import { AdHookReturns, FullScreenAdOptions } from '../types';

import useFullScreenAd from './useFullScreenAd';

/**
 * React Hook for AdMob Rewarded Interstitial Ad.
 * @param unitId Rewarded Interstitial Ad Unit Id
 * @param options `FullScreenAdOptions`
 */
export default function useRewardedInterstitialAd(
  unitId: string | null,
  options: FullScreenAdOptions = {}
): AdHookReturns {
  const [rewardedInterstitialAd, setRewardedInterstitialAd] =
    useState<RewardedInterstitialAd | null>(null);

  useDeepCompareEffect(() => {
    setRewardedInterstitialAd((prevAd) => {
      prevAd?.destroy();
      return unitId ? RewardedInterstitialAd.createAd(unitId, options) : null;
    });
  }, [unitId, options]);

  return useFullScreenAd(rewardedInterstitialAd);
}
