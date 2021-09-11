---
id: usage
title: Usage
sidebar_label: Usage
---

## Initializing Mobile Ads SDK

Before you loading any ads, you must initialize Mobile Ads SDK by calling `AdMob.initialize()`.

```js
import AdMob from '@react-native-admob/admob';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await AdMob.initialize();

      setLoading(false);
    };

    init();
  }, []);

  return (/* Your App code */)
```

For detailed usage of `AdMob.initialize()` function, [head over to API section](api/initialize).

## Displaying Banner Ad

See [BannerAd](components/BannerAd).

## Displaying App Open Ad(beta)

### Using Hook

See [useAppOpenAd](api/useAppOpenAd).

### Using Class instance

See [AppOpenAd](api/AppOpenAd).

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

## Displaying Rewarded Interstitial Ad

### Using Hook

See [useRewardedInterstitialAd](api/useRewardedInterstitialAd).

### Using Class instance

See [RewardedInterstitialAd](api/RewardedInterstitialAd).

## Request Non Personalized Ads Only

You can set [RequestOptions](api/RequestOptions) for your ads. Using this, you can load non-personalized ads only.

```js
const requestOptions = {
  requestNonPersonalizedAdsOnly: true,
}

// Requesting npa only in hook
const rewardedAd = useRewardedAd(UNIT_ID_REWARDED, {
  requestOptions,
});

// Requesting npa only in class instance (for this request)
interstitialAd
        .requestAd(requestOptions)
        .catch((e: Error) => setAdLoadError(e))
        .then(() => setAdLoaded(true));

// Requesting npa only in class instance (for all requests in this ad instance)
rewardedInterstitialAd
        .setRequestOptions(requestOptions)

// Requesting npa only in BannerAd
<BannerAd
  size={BannerAdSize.BANNER}
  unitId={UNIT_ID_BANNER}
  reqeustOptions={requestOptions}
/>
```