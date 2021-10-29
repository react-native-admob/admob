import { useEffect, useState } from 'react';

import RewardedAd from '../ads/RewardedAd';
import { AdHookReturns, FullScreenAdOptions } from '../types';

import useFullScreenAd from './useFullScreenAd';

/**
 * React Hook for AdMob Rewarded Ad.
 * @param unitId Rewarded Ad Unit Id
 * @param options `FullScreenAdOptions`
 */
export default function useRewardedAd(
  unitId: string | null,
  options?: FullScreenAdOptions
): AdHookReturns {
  const [rewardedAd, setRewardedAd] = useState<RewardedAd | null>(null);
  const returns = useFullScreenAd(rewardedAd);

  useEffect(() => {
    if (!unitId) {
      setRewardedAd((prevAd) => {
        if (prevAd) {
          prevAd.destroy();
        }
        return null;
      });
      return;
    }
    setRewardedAd(RewardedAd.createAd(unitId, options));
  }, [unitId, options]);

  return returns;
}
