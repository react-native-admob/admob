# React Native Admob

Admob for React Native with powerful hooks and components

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
const { adLoadError, adLoaded, presentAd } = useInterstitialAd(
  UNIT_ID_INTERSTITIAL,
  hookOptions
);

useEffect(() => {
  if (adLoadError) {
    console.error(adLoadError);
  }
}, [adLoadError]);

useEffect(() => {
  if (adLoaded) {
    presentAd();
  }
}, [adLoaded]);

// Rewarded Ad using Hook(Recommended)
const { reward } = useRewardedAd(UNIT_ID_REWARDED, hookOptions);

useEffect(() => {
  if (reward) {
    console.log('Reward earned: ');
    console.log(reward);
  }
}, [reward]);

// Rewarded Ad using class instance
const rewardedAd = useMemo(() => Rewarded.createAd(unitId), [unitId]);
const [adLoaded, setAdLoaded] = useState(false);
const [reward, setReward] = useState();

useEffect(() => {
  rewardedAd.addEventListener('rewarded', (r) => setReward(r));
  if (!adLoaded) {
    rewardedAd
      .requestAd()
      .catch((e: Error) => setAdLoadError(e))
      .then(() => {
        setAdLoaded(true);
        rewardedAd.presentAd();
      });
  }
  return () => rewardedAd.removeAllListeners();
}, [rewardedAd]);
```

## License

MIT
