import { useContext } from 'react';

import AppOpenAdContext from '../ads/AppOpenAdContext';
import { AdHookReturns } from '../types';

import useFullScreenAd from './useFullScreenAd';

/**
 * React Hook for AdMob App Open Ad.
 * Must be created inside `AppOpenAdProvider`.
 */
export default function useAppOpenAd(): Omit<AdHookReturns, 'reward'> {
  const appOpenAdContext = useContext(AppOpenAdContext);
  if (!appOpenAdContext) {
    throw new Error(
      'AppOpenAdProvider is not found. You should wrap your components with AppOpenProvider to use useAppOpenAd hook.'
    );
  }

  return useFullScreenAd(appOpenAdContext.appOpenAd);
}
