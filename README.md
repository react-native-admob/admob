<p align="center">
  <img alt="cover with mockup" src="./docs/static/img/logo_admob.png" width="192px">
  <h1 align="center">
    React Native AdMob
  </h1>
</p>
<p align="center">
  <a href="https://www.npmjs.org/package/@react-native-admob/admob">
    <img alt="npm version" src="https://img.shields.io/npm/v/@react-native-admob/admob.svg?style=for-the-badge" />
  </a>
  <a href="https://www.npmjs.org/package/@react-native-admob/admob">
    <img alt="weekly downloads" src="https://img.shields.io/npm/dw/@react-native-admob/admob.svg?style=for-the-badge" />
  </a>
  <a href="https://www.npmjs.org/package/@react-native-admob/admob">
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/@react-native-admob/admob.svg?style=for-the-badge" />
  </a>
  <a href="./LICENSE">
    <img alt="license" src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge" />
  </a>
  <br />
</p>

> Admob for React Native with powerful hooks and components

## 📦 Installation

See [Installation Guide](https://react-native-admob.github.io/admob/docs/installation)

## 📃 Documentation

Head over [Documentation Page](https://react-native-admob.github.io/admob/docs/usage)

## 🚀 Usage

### Initializing Mobile Ads SDK

```js
import AdMob from '@react-native-admob/admob';

AdMob.initialize();
```

### Displaying Banner Ad

```js
import { BannerAd, BannerAdSize } from '@react-native-admob/admob';

<BannerAd
  size={BannerAdSize.BANNER}
  unitId={UNIT_ID_BANNER}
  onAdFailedToLoad={(error) => console.error(error)}
  requestOptions={{
    requestNonPersonalizedAdsOnly: true,
  }}
/>;
```

### Displaying InterstitialAd

```js
import { useInterstitialAd } from '@react-native-admob/admob';

const { adLoadError, adLoaded, show } = useInterstitialAd(UNIT_ID_INTERSTITIAL);

useEffect(() => {
  if (adLoadError) {
    console.error(adLoadError);
  }
}, [adLoadError]);

useEffect(() => {
  if (adLoaded) {
    show();
  }
}, [adLoaded]);
```

### Displaying RewardedAd
```js
import { useRewardedAd } from '@react-native-admob/admob';

const { adLoadError, adLoaded, show, reward } = useRewardedAd(UNIT_ID_REWARDED);

useEffect(() => {
  if (adLoadError) {
    console.error(adLoadError);
  }
}, [adLoadError]);

useEffect(() => {
  if (adLoaded) {
    show();
  }
}, [adLoaded]);

useEffect(() => {
  if (reward) {
    console.log('Reward earned: ');
    console.log(reward);
  }
}, [reward]);
```

### Displaying App Open Ad
```js
import { useAppOpenAd } from '@react-native-admob/admob';
import RNBootSplash from 'react-native-bootsplash';

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [splashDismissed, setSplashDismissed] = useState(false);
  const { adDismissed, adLoadError } = useAppOpenAd(
    initialized ? UNIT_ID_APP_OPEN : null,
    {
      showOnColdStart: true,
    }
  );

  useEffect(() => {
    const initAdmob = async () => {
      await AdMob.initialize();
      setInitialized(true);
    };
    const load = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setLoaded(true);
    };

    initAdmob();
    load();
  }, []);

  useEffect(() => {
    if (initialized && loaded && (adDismissed || adLoadError)) {
      RNBootSplash.hide({ fade: true });
      setSplashDismissed(true);
    }
  }, [initialized, loaded, adDismissed, adLoadError]);

  return splashDismissed ? <Example /> : <View />;
}
```

For detailed usage, head over [Documentation](https://react-native-admob.github.io/admob/docs/usage).

## Change Log

See [Change Log](CHANGELOG.md)

## License

MIT
