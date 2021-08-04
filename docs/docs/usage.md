---
id: usage
title: Usage
sidebar_label: Usage
---

## Initializing Mobile Ads SDK

Before you loading any ads, you must initialize Mobile Ads SDK by calling `AdManager.initialize()`.

```js
import { AdManager } from '@react-native-admob/admob';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await AdManager.initialize();

      setLoading(false);
    };

    init();
  }, []);

  return (/* Your App code */)
```

For detailed usage of `AdManager.initialize()` function, [head over to API section](api/initialize).

## Displaying Banner Ad

See [BannerAd](banner).

## Displaying Interstitial Ad

### Using Hook

See [useInterstitialAd](api/useInterstitialAd).

### Using Class instance

See [InterstitialAd](api/InterstitialAd).

## Displaying Rewarded Ad

### Using Hook

See [useRewardedAd](api/useRewardedAd).

### Using Class instance

See [RewardedAd](api/RewardedAd).
