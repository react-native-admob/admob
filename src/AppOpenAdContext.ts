import * as React from 'react';

import AppOpenAd from './ads/AppOpenAd';
import { AppOpenAdOptions } from './types';

interface AppOpenAdContextState {
  unitId: string | null;
  options?: AppOpenAdOptions;
  appOpenAd: AppOpenAd | null;
}

/**
 * Context which holds the App Open Ad.
 */
const AppOpenAdContext = React.createContext<AppOpenAdContextState | undefined>(
  undefined
);

export default AppOpenAdContext;
