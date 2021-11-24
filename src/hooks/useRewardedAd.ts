import { useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { RewardedAd } from '../ads/fullscreen';
import { AdHookReturns, FullScreenAdOptions } from '../types';

import useFullScreenAd from './useFullScreenAd';

/**
 * React Hook for AdMob Rewarded Ad.
 * @param unitId Rewarded Ad Unit Id
 * @param options `FullScreenAdOptions`
 */
export default function useRewardedAd(
  unitId: string | null,
  options: FullScreenAdOptions = {}
): AdHookReturns {
  const [rewardedAd, setRewardedAd] = useState<RewardedAd | null>(null);

  useDeepCompareEffect(() => {
    setRewardedAd((prevAd) => {
      prevAd?.destroy();
      return unitId ? RewardedAd.createAd(unitId, options) : null;
    });
  }, [unitId, options]);

  return useFullScreenAd(rewardedAd);
}
