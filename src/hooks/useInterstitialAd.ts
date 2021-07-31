import { useCallback, useEffect, useMemo, useState } from 'react';

import InterstitialAd from '../ads/InterstitialAd';
import { AdHookOptions } from '../types';

const defaultOptions: AdHookOptions = {
  requestOnMounted: true,
  presentOnLoaded: false,
  requestOnDismissed: false,
};

const useInterstitialAd = (unitId: string, options?: AdHookOptions) => {
  const [prevUnitId, setPrevUnitId] = useState('');
  const [adLoaded, setAdLoaded] = useState(false);
  const [adPresented, setAdPresented] = useState(false);
  const [adDismissed, setAdDismissed] = useState(false);
  const [adLoadError, setAdLoadError] = useState<Error | null>(null);
  const [adPresentError, setAdPresentError] = useState<Error | null>(null);
  const _options = Object.assign(defaultOptions, options);

  const init = () => {
    setAdLoaded(false);
    setAdPresented(false);
    setAdDismissed(false);
    setAdLoadError(null);
    setAdPresentError(null);
  };

  const adShowing = useMemo(
    () => adPresented && !adDismissed,
    [adPresented, adDismissed]
  );

  const requestAd = useCallback(() => {
    if (adShowing) {
      console.warn(
        '[RNAdmob(InterstitialAd)] You can not request ad when the ad is showing.'
      );
      return;
    }
    init();
    setPrevUnitId(unitId);
    InterstitialAd.requestAd()
      .catch((e: Error) => setAdLoadError(e))
      .then(() => setAdLoaded(true));
  }, [unitId, adShowing]);

  const presentAd = useCallback(() => {
    if (adLoaded) {
      InterstitialAd.presentAd()
        .catch((e: Error) => setAdPresentError(e))
        .then(() => setAdPresented(true));
    } else {
      console.log('[RNAdmob(InterstitialAd)] Ad is not loaded.');
    }
  }, [adLoaded]);

  useEffect(() => {
    if (unitId === prevUnitId) {
      return;
    }

    InterstitialAd.setUnitId(unitId);
    if (_options?.requestOnMounted) {
      requestAd();
    }
  }, [unitId, prevUnitId, _options, requestAd]);

  useEffect(() => {
    if (adLoaded && _options?.presentOnLoaded) {
      presentAd();
    }
  }, [adLoaded, _options, presentAd]);

  useEffect(() => {
    if (adDismissed && _options.requestOnDismissed) {
      requestAd();
    }
  }, [adDismissed, _options, requestAd]);

  useEffect(() => {
    InterstitialAd.addEventListener('adDismissed', () => setAdDismissed(true));
    return () => InterstitialAd.removeAllListeners();
  }, []);

  return {
    adLoaded,
    adPresented,
    adDismissed,
    adLoadError,
    adPresentError,
    adShowing,
    requestAd,
    presentAd,
  };
};

export default useInterstitialAd;
