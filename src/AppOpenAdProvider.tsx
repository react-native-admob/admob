import React, { useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import AppOpenAd from './ads/AppOpenAd';
import AppOpenAdContext from './AppOpenAdContext';
import { AppOpenAdOptions } from './types';

export interface AppOpenAdProviderProps {
  unitId: string | null;
  options?: AppOpenAdOptions;
  children: React.ReactNode;
}

const AppOpenAdProvider = ({
  unitId,
  options,
  children,
}: AppOpenAdProviderProps) => {
  const [appOpenAd, setAppOpenAd] = useState<AppOpenAd | null>(null);

  useDeepCompareEffect(() => {
    setAppOpenAd(unitId ? AppOpenAd.createAd(unitId, options) : null);
  }, [unitId, options]);

  return (
    <AppOpenAdContext.Provider value={{ unitId, options, appOpenAd }}>
      {children}
    </AppOpenAdContext.Provider>
  );
};

export default AppOpenAdProvider;
