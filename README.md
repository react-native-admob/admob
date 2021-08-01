# React Native Admob

Admob for React Native with powerful hooks

## Installation

See [Installation Guide](https://react-native-admob.github.io/docs)

## Documentation

[Docs](https://react-native-admob.github.io/docs)

## Usage

```js
import {
  AdManager,
  AdMobBanner,
  useInterstitialAd,
  useRewardedAd,
} from '@react-native-admob/admob';

// Display a banner
<BannerAd
  size={BannerAdSize.BANNER}
  unitId={UNIT_ID_BANNER}
  onAdFailedToLoad={(error) => console.error(error)}
  ref={bannerRef}
/>;

// Options for Hook
const hookOptions = {
  requestOnDismissed: true,
};

// Interstitial Ad using Hook(Recommended)
const interstitalAd = useInterstitialAd(UNIT_ID_INTERSTITIAL, hookOptions);

useEffect(() => {
  const { adLoadError, adPresentError } = interstitalAd;
  if (adLoadError) {
    console.error(adLoadError);
  } else if (adPresentError) {
    console.error(adPresentError);
  }
}, [interstitalAd]);

// Rewarded Ad using Hook(Recommended)
const rewardedAd = useRewardedAd(UNIT_ID_REWARDED, hookOptions);

useEffect(() => {
  if (rewardedAd.reward) {
    console.log('Reward earned: ');
    console.log(rewardedAd.reward);
  }
}, [rewardedAd.reward]);

// Rewarded Ad using class instance
const rewardedAd = useMemo(() => Rewarded.createAd(unitId), [unitId]);

useEffect(() => {
  rewardedAd.addEventListener('rewarded', (r: Reward) => setReward(r));
  if (!adLoaded) {
    rewardedAd
      .requestAd()
      .catch((e: Error) => setAdLoadError(e))
      .then(() => rewardedAd.presentAd());
  }
  return () => rewardedAd.removeAllListeners();
}, [rewardedAd]);
```

## License

MIT
