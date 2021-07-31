import { useCallback, useEffect, useMemo, useState } from 'react';

import RewardedAd from '../ads/RewardedAd';
import { AdHookOptions, Reward } from '../types';

const defaultOptions: AdHookOptions = {
  requestOnMounted: true,
  presentOnLoaded: false,
  requestOnDismissed: false,
};

const useRewardedAd = (unitId: string, options = defaultOptions) => {
  const [prevUnitId, setPrevUnitId] = useState('');
  const [adLoaded, setAdLoaded] = useState(false);
  const [adPresented, setAdPresented] = useState(false);
  const [adDismissed, setAdDismissed] = useState(false);
  const [adLoadError, setAdLoadError] = useState<Error | null>(null);
  const [adPresentError, setAdPresentError] = useState<Error | null>(null);
  const [reward, setReward] = useState<Reward | null>(null);
  const _options = Object.assign(defaultOptions, options);

  const init = () => {
    setAdLoaded(false);
    setAdPresented(false);
    setAdDismissed(false);
    setAdLoadError(null);
    setAdPresentError(null);
    setReward(null);
  };

  const adShowing = useMemo(
    () => adPresented && !adDismissed,
    [adPresented, adDismissed]
  );

  const requestAd = useCallback(() => {
    if (adShowing) {
      console.warn(
        '[RNAdmob(RewardedAd)] You can not request ad when the ad is showing.'
      );
      return;
    }
    init();
    setPrevUnitId(unitId);
    RewardedAd.requestAd()
      .catch((e: Error) => setAdLoadError(e))
      .then(() => setAdLoaded(true));
  }, [unitId, adShowing]);

  const presentAd = useCallback(() => {
    if (adLoaded) {
      RewardedAd.presentAd()
        .catch((e: Error) => setAdPresentError(e))
        .then(() => setAdPresented(true));
    } else {
      console.log('[RNAdmob(RewardedAd)] Ad is not loaded.');
    }
  }, [adLoaded]);

  useEffect(() => {
    if (unitId === prevUnitId) {
      return;
    }

    RewardedAd.setUnitId(unitId);
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
    RewardedAd.addEventListener('adDismissed', () => setAdDismissed(true));
    RewardedAd.addEventListener('rewarded', (r: Reward) => setReward(r));
    return () => RewardedAd.removeAllListeners();
  }, []);

  return {
    adLoaded,
    adPresented,
    adDismissed,
    adLoadError,
    adPresentError,
    adShowing,
    reward,
    requestAd,
    presentAd,
  };
};

export default useRewardedAd;
