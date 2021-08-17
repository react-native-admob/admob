import { useCallback, useEffect, useMemo, useState } from 'react';

import InterstitialAd from '../ads/InterstitialAd';
import { AdHookOptions, AdHookReturns, RequestOptions } from '../types';

const defaultOptions: AdHookOptions = {
  loadOnMounted: true,
  showOnLoaded: false,
  loadOnDismissed: false,
  requestOptions: {},
};

/**
 * React Hook for AdMob Interstitial Ad.
 * @param unitId Interstitial Ad Unit Id
 * @param options `AdHookOptions`
 */
export default function (
  unitId: string,
  options?: AdHookOptions
): AdHookReturns {
  const interstitialAd = useMemo(
    () => InterstitialAd.createAd(unitId),
    [unitId]
  );
  const [adLoaded, setAdLoaded] = useState(false);
  const [adPresented, setAdPresented] = useState(false);
  const [adDismissed, setAdDismissed] = useState(false);
  const [adLoadError, setAdLoadError] = useState<Error>();
  const [adPresentError, setAdPresentError] = useState<Error>();
  const {
    loadOnMounted,
    showOnLoaded,
    loadOnDismissed,
    requestOptions: adRequestOptions,
  } = Object.assign(defaultOptions, options);

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

  const load = useCallback(
    (requestOptions: RequestOptions = adRequestOptions!) => {
      init();
      interstitialAd
        .load(requestOptions)
        .catch((e: Error) => setAdLoadError(e))
        .then(() => setAdLoaded(true));
    },
    [interstitialAd, adRequestOptions]
  );

  const show = useCallback(() => {
    if (adPresented) {
      console.warn('[RNAdmob(InterstitialAd)] Ad is already presented once.');
    } else if (adLoaded) {
      interstitialAd
        .show()
        .catch((e: Error) => setAdPresentError(e))
        .then(() => setAdPresented(true));
    } else {
      console.warn('[RNAdmob(InterstitialAd)] Ad is not loaded.');
    }
  }, [interstitialAd, adPresented, adLoaded]);

  useEffect(() => {
    if (!interstitialAd.requested && loadOnMounted) {
      load();
    }
  }, [interstitialAd, loadOnMounted, load]);

  useEffect(() => {
    if (adLoaded && showOnLoaded) {
      show();
    }
  }, [adLoaded, showOnLoaded, show]);

  useEffect(() => {
    if (adDismissed && loadOnDismissed) {
      load();
    }
  }, [adDismissed, loadOnDismissed, load]);

  useEffect(() => {
    const presentListener = interstitialAd.addEventListener('adPresented', () =>
      setAdDismissed(false)
    );
    const dismissListener = interstitialAd.addEventListener(
      'adDismissed',
      () => {
        setAdDismissed(true);
        init();
      }
    );
    return () => {
      presentListener.remove();
      dismissListener.remove();
    };
  }, [interstitialAd]);

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
