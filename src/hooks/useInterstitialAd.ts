import { useCallback, useEffect, useMemo, useState } from 'react';

import InterstitialAd from '../ads/InterstitialAd';
import { AdHookReturns, FullScreenAdOptions, RequestOptions } from '../types';

/**
 * React Hook for AdMob Interstitial Ad.
 * @param unitId Interstitial Ad Unit Id
 * @param options `FullScreenAdOptions`
 */
export default function (
  unitId: string,
  options?: FullScreenAdOptions
): AdHookReturns {
  const interstitialAd = useMemo(
    () => InterstitialAd.createAd(unitId, options),
    [unitId, options]
  );
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

  const load = useCallback(
    (requestOptions?: RequestOptions) => {
      init();
      interstitialAd.load(requestOptions);
    },
    [interstitialAd]
  );

  const show = useCallback(() => {
    if (adPresented) {
      console.warn('[RNAdmob(InterstitialAd)] Ad is already presented once.');
    } else if (adLoaded) {
      interstitialAd.show();
    } else {
      console.warn('[RNAdmob(InterstitialAd)] Ad is not loaded.');
    }
  }, [interstitialAd, adPresented, adLoaded]);

  useEffect(() => {
    const loadListener = interstitialAd.addEventListener('adLoaded', () => {
      setAdLoaded(true);
      setAdPresented(false);
    });
    const loadFailListener = interstitialAd.addEventListener(
      'adFailedToLoad',
      (error: Error) => setAdLoadError(error)
    );
    const presentListener = interstitialAd.addEventListener(
      'adPresented',
      () => {
        setAdPresented(true);
        setAdDismissed(false);
      }
    );
    const presentFailListener = interstitialAd.addEventListener(
      'adFailedToPresent',
      (error) => setAdPresentError(error)
    );
    const dismissListener = interstitialAd.addEventListener(
      'adDismissed',
      () => {
        setAdDismissed(true);
        setAdLoaded(false);
      }
    );
    return () => {
      loadListener.remove();
      loadFailListener.remove();
      presentListener.remove();
      presentFailListener.remove();
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
