import { useEffect, useState } from 'react';

import AppOpenAd from '../ads/AppOpenAd';
import { AdHookReturns, AppOpenAdOptions } from '../types';

import useFullScreenAd from './useFullScreenAd';

/**
 * React Hook for AdMob App Open Ad.
 * @param unitId App Open Ad Unit Id
 * @param options `AppOpenAdOptions`
 */
export default function (
  unitId: string | null,
  options?: AppOpenAdOptions
): Omit<AdHookReturns, 'reward'> {
  const [appOpenAd, setAppOpenAd] = useState<AppOpenAd | null>(null);
  const returns = useFullScreenAd(appOpenAd);

  useEffect(() => {
    if (!unitId) {
      setAppOpenAd((prevAd) => {
        if (prevAd) {
          prevAd.destroy();
        }
        return null;
      });
      return;
    }
    setAppOpenAd(AppOpenAd.createAd(unitId, options));
  }, [unitId, options]);

  return returns;
}
