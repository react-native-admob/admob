import { useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { InterstitialAd } from '../ads/fullscreen';
import { AdHookReturns, FullScreenAdOptions } from '../types';

import useFullScreenAd from './useFullScreenAd';

/**
 * React Hook for AdMob Interstitial Ad.
 * @param unitId Interstitial Ad Unit Id
 * @param options `FullScreenAdOptions`
 */
export default function useInterstitialAd(
  unitId: string | null,
  options: FullScreenAdOptions = {}
): Omit<AdHookReturns, 'reward'> {
  const [interstitialAd, setInterstitialAd] = useState<InterstitialAd | null>(
    null
  );

  useDeepCompareEffect(() => {
    setInterstitialAd((prevAd) => {
      prevAd?.destroy();
      return unitId ? InterstitialAd.createAd(unitId, options) : null;
    });
  }, [unitId, options]);

  return useFullScreenAd(interstitialAd);
}
