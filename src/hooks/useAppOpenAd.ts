import { useCallback, useEffect, useMemo, useState } from 'react';

import AppOpenAd from '../ads/AppOpenAd';
import { AdHookReturns, AppOpenAdOptions, RequestOptions } from '../types';

const defaultOptions: AppOpenAdOptions = {
  showOnColdStart: false,
  showOnAppForeground: true,
  requestOptions: {},
};

/**
 * React Hook for AdMob App Open Ad.
 */
export default function (
  unitId: string,
  options?: AppOpenAdOptions
): AdHookReturns {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adPresented, setAdPresented] = useState(false);
  const [adDismissed, setAdDismissed] = useState(false);
  const [adLoadError, setAdLoadError] = useState<Error>();
  const [adPresentError, setAdPresentError] = useState<Error>();
  const { requestOptions: adRequestOptions } = Object.assign(
    defaultOptions,
    options
  );

  const init = () => {
    setAdLoaded(false);
    setAdPresented(false);
    setAdDismissed(false);
    setAdLoadError(undefined);
    setAdPresentError(undefined);
  };

  const adShowing = useMemo(
    () => adPresented && !adDismissed,
    [adPresented, adDismissed]
  );

  const load = useCallback(
    (requestOptions: RequestOptions = adRequestOptions!) => {
      init();
      AppOpenAd.load(requestOptions)
        .catch((e: Error) => setAdLoadError(e))
        .then(() => setAdLoaded(true));
    },
    [adRequestOptions]
  );

  const show = useCallback(() => {
    if (adLoaded) {
      AppOpenAd.show()
        .catch((e: Error) => setAdPresentError(e))
        .then(() => setAdPresented(true));
    } else {
      console.warn('[RNAdmob(AppOpenAd)] Ad is not loaded.');
    }
  }, [adLoaded]);

  useEffect(() => {
    // Surround with try catch to prevent Ad created more than once.
    try {
      AppOpenAd.createAd(unitId, options!);
    } catch {}
    AppOpenAd.addEventListener('adDismissed', () => setAdDismissed(true));
    return () => AppOpenAd.removeAllListeners();
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
