# React Native Admob

[![npm](https://img.shields.io/npm/v/@react-native-admob/admob.svg)](https://www.npmjs.com/package/@react-native-admob/admob)

⚠️ Please note, this package is under active development, which means it may be not stable to apply on production. Please use this package on your own risk. New issues and PRs are always welcome.

> Admob for React Native with powerful hooks and components

## Installation

See [Installation Guide](https://react-native-admob.github.io/admob/docs/installation)

## Documentation

Head over [Documentation Page](https://react-native-admob.github.io/admob/docs/usage)

## Usage

### Initializing Mobile Ads SDK

```js
import { AdManager } from '@react-native-admob/admob';

AdManager.initialize();
```

### Displaying Banner Ad

```js
import { BannerAd, BannerAdSize } from '@react-native-admob/admob';

<BannerAd
  size={BannerAdSize.BANNER}
  unitId={UNIT_ID_BANNER}
  onAdFailedToLoad={(error) => console.error(error)}
  ref={bannerRef}
/>;
```

### Displaying InterstitialAd

```js
import { useInterstitialAd } from '@react-native-admob/admob';

const { adLoadError, adLoaded, presentAd } = useInterstitialAd(UNIT_ID_INTERSTITIAL);

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
```

### Displaying RewardedAd
```js
import { useRewardedAd } from '@react-native-admob/admob';

const { adLoadError, adLoaded, presentAd, reward } = useRewardedAd(UNIT_ID_REWARDED);

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

useEffect(() => {
  if (reward) {
    console.log('Reward earned: ');
    console.log(reward);
  }
}, [reward]);
```

For detailed usage, head over [Documentation](https://react-native-admob.github.io/admob/docs/usage).

## License

MIT
