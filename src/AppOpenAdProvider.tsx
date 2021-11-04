import React, { useEffect, useState } from 'react';

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

  return (
    <AppOpenAdContext.Provider value={{ unitId, options, appOpenAd }}>
      {children}
    </AppOpenAdContext.Provider>
  );
};

export default AppOpenAdProvider;
