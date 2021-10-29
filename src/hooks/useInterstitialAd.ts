import { useEffect, useState } from 'react';

import InterstitialAd from '../ads/InterstitialAd';
import { AdHookReturns, FullScreenAdOptions } from '../types';

import useFullScreenAd from './useFullScreenAd';

/**
 * React Hook for AdMob Interstitial Ad.
 * @param unitId Interstitial Ad Unit Id
 * @param options `FullScreenAdOptions`
 */
export default function (
  unitId: string | null,
  options?: FullScreenAdOptions
): Omit<AdHookReturns, 'reward'> {
  const [interstitialAd, setInterstitialAd] = useState<InterstitialAd | null>(
    null
  );
  const returns = useFullScreenAd(interstitialAd);

  useEffect(() => {
    if (!unitId) {
      setInterstitialAd((prevAd) => {
        if (prevAd) {
          prevAd.destroy();
        }
        return null;
      });
      return;
    }
    setInterstitialAd(InterstitialAd.createAd(unitId, options));
  }, [unitId, options]);

  return returns;
}
