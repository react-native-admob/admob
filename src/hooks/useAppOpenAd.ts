import { useCallback, useEffect, useMemo, useState } from 'react';

import AppOpenAd from '../ads/AppOpenAd';
import { AdHookReturns, AppOpenAdOptions, RequestOptions } from '../types';

/**
 * React Hook for AdMob App Open Ad.
 */
export default function (
  unitId: string | null,
  options?: AppOpenAdOptions
): AdHookReturns {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adPresented, setAdPresented] = useState(false);
  const [adDismissed, setAdDismissed] = useState(false);
  const [adLoadError, setAdLoadError] = useState<Error>();
  const [adPresentError, setAdPresentError] = useState<Error>();

  const init = () => {
    setAdLoaded(false);
    setAdPresented(false);
    setAdLoadError(undefined);
    setAdPresentError(undefined);
  };

  const adShowing = useMemo(
    () => adPresented && !adDismissed,
    [adPresented, adDismissed]
  );

  const load = (requestOptions?: RequestOptions) => {
    init();
    AppOpenAd.load(requestOptions);
  };

  const show = useCallback(() => {
    if (adLoaded) {
      AppOpenAd.show();
    } else {
      console.warn('[RNAdmob(AppOpenAd)] Ad is not loaded.');
    }
  }, [adLoaded]);

  useEffect(() => {
    if (!unitId) {
      return;
    }
    AppOpenAd.createAd(unitId, options);

    const loadListener = AppOpenAd.addEventListener('adLoaded', () => {
      setAdLoaded(true);
      setAdPresented(false);
    });
    const loadFailListener = AppOpenAd.addEventListener(
      'adFailedToLoad',
      (error: Error) => setAdLoadError(error)
    );
    const presentListener = AppOpenAd.addEventListener('adPresented', () => {
      setAdPresented(true);
      setAdDismissed(false);
    });
    const presentFailListener = AppOpenAd.addEventListener(
      'adFailedToPresent',
      (error) => setAdPresentError(error)
    );
    const dismissListener = AppOpenAd.addEventListener('adDismissed', () => {
      setAdDismissed(true);
      setAdLoaded(false);
    });
    return () => {
      loadListener.remove();
      loadFailListener.remove();
      presentListener.remove();
      presentFailListener.remove;
      dismissListener.remove();
    };
  }, [unitId, options]);

  return {
    adLoaded,
    adPresented,
    adDismissed,
    adShowing,
    adLoadError,
    adPresentError,
    load,
    show,
  };
}
