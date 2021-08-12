import { useCallback, useEffect, useMemo, useState } from 'react';

import InterstitialAd from '../ads/InterstitialAd';
import { AdHookOptions, AdHookResult, RequestOptions } from '../types';

const defaultOptions: AdHookOptions = {
  requestOnMounted: true,
  presentOnLoaded: false,
  requestOnDismissed: false,
  requestOptions: {},
};

/**
 * React Hook for AdMob Interstitial ad.
 * @param unitId Interstitial Ad Unit Id
 * @param options `AdHookOptions`
 */
export default function (
  unitId: string,
  options?: AdHookOptions
): AdHookResult {
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
    requestOnMounted,
    presentOnLoaded,
    requestOnDismissed,
    requestOptions: adRequestOptions,
  } = Object.assign(defaultOptions, options);

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

  const requestAd = useCallback(
    (requestOptions: RequestOptions = adRequestOptions!) => {
      init();
      interstitialAd
        .requestAd(requestOptions)
        .catch((e: Error) => setAdLoadError(e))
        .then(() => setAdLoaded(true));
    },
    [interstitialAd, adRequestOptions]
  );

  const presentAd = useCallback(() => {
    if (adPresented) {
      console.warn('[RNAdmob(InterstitialAd)] Ad is already presented once.');
    } else if (adLoaded) {
      interstitialAd
        .presentAd()
        .catch((e: Error) => setAdPresentError(e))
        .then(() => setAdPresented(true));
    } else {
      console.warn('[RNAdmob(InterstitialAd)] Ad is not loaded.');
    }
  }, [interstitialAd, adPresented, adLoaded]);

  useEffect(() => {
    if (!interstitialAd.requested && requestOnMounted) {
      requestAd();
    }
  }, [interstitialAd, requestOnMounted, requestAd]);

  useEffect(() => {
    if (adLoaded && presentOnLoaded) {
      presentAd();
    }
  }, [adLoaded, presentOnLoaded, presentAd]);

  useEffect(() => {
    if (adDismissed && requestOnDismissed) {
      requestAd();
    }
  }, [adDismissed, requestOnDismissed, requestAd]);

  useEffect(() => {
    interstitialAd.addEventListener('adDismissed', () => setAdDismissed(true));
    return () => interstitialAd.removeAllListeners();
  }, [interstitialAd]);

  return {
    adLoaded,
    adPresented,
    adDismissed,
    adShowing,
    adLoadError,
    adPresentError,
    requestAd,
    presentAd,
  };
}
