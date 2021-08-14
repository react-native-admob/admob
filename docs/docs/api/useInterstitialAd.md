---
id: useInterstitialAd
title: useInterstitialAd
sidebar_label: useInterstitialAd
---

Use this hook to use Interstitial Ad with its various states.

## Usage example

```js
import { useInterstitialAd } from '@react-native-admob/admob';

const hookOptions = {
  loadOnDismissed: true,
  requestOptions: {
    requestNonPersonalizedAdsOnly: true,
  },
};

export default function App() {
  const {
    adLoadError,
    adLoaded,
    adDismissed,
    show
  } = useInterstitialAd(UNIT_ID_INTERSTITIAL, hookOptions);

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
    if (adDismissed) {
      console.log('Interstitial Ad is dismissed. Preloading next ad...');
    }
  }, [adDismissed]);

  return (/* Your App code */)
```

## Arguments

### `unitId`

Your Interstitial Ad's [ad Unit ID](https://support.google.com/admob/answer/7356431)

| Type   |
| :----- |
| string |

### `options`

Options for your hook. Available values are listed below:

| Type   |
| :----- |
| object |

Properties:

| Name            | Type                             | Default | Description                                                |
| :-------------- | :------------------------------- | :------ | :--------------------------------------------------------- |
| loadOnMounted   | boolean                          | `true`  | Whether your ad to load automatically on mounted.          |
| showOnLoaded    | boolean                          | `false` | Whether your ad to show automatically on loaded.           |
| loadOnDismissed | boolean                          | `false` | Whether your ad to load new ad automatically on dismissed. |
| requestOptions  | [RequestOptions](RequestOptions) | {}      | Optional RequestOptions used to load the ad.               |

## Returns

| Type   |
| :----- |
| object |

Properties:

| Name           | Type     | Description                                                                                   |
| :------------- | :------- | :-------------------------------------------------------------------------------------------- |
| adLoaded       | boolean  | Whether your ad is loaded and ready to present.                                               |
| adPresented    | boolean  | Whether your ad is presented to user.                                                         |
| adDismissed    | boolean  | Whether your ad is dismissed.                                                                 |
| adShowing      | boolean  | Whether your ad is showing. The value is equal with `adPresented && !adDismissed`.            |
| adLoadError    | Error    | Error during ad load.                                                                         |
| adPresentError | Error    | Error during ad present.                                                                      |
| load           | Function | Loads new ad. Can not call this function if the ad is loaded but not presented and dismissed. |
| show           | Function | Shows loaded ad. Ad must be loaded prior to this call.                                        |

:::tip

Note that `adPresented` value remains `true` after the ad is dismissed. The value changes to `false` when ad is initialized via `load()`. To determine whether the ad is showing, use `adShowing` value.

:::