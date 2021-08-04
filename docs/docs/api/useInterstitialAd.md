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
  requestOnDismissed: true,
};

export default function App() {
  const {
    adLoadError,
    adLoaded,
    adDismissed,
    presentAd
  } = useInterstitialAd(UNIT_ID_INTERSTITIAL, hookOptions);

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

| Name               | Type    | Default | Description                                                   |
| :----------------- | :------ | :------ | :------------------------------------------------------------ |
| requestOnMounted   | boolean | `true`  | Whether your ad to request automatically on mounted.          |
| presentOnLoaded    | boolean | `false` | Whether your ad to present automatically on loaded.           |
| requestOnDismissed | boolean | `false` | Whether your ad to request new ad automatically on dismissed. |

## Returns

| Type   |
| :----- |
| object |

Properties:

| Name           | Type     | Description                                                                                     |
| :------------- | :------- | :---------------------------------------------------------------------------------------------- |
| adLoaded       | boolean  | Whether your ad is loaded and ready to present.                                                 |
| adPresented    | boolean  | Whether your ad is presented to user.                                                           |
| adDismissed    | boolean  | Whether your ad is dismissed.                                                                   |
| adShowing      | boolean  | Whether your ad is showing. The value is equal with `adPresented && !adDismissed`.              |
| adLoadError    | boolean  | Error during ad load.                                                                           |
| adPresentError | boolean  | Error during ad present.                                                                        |
| requestAd      | Function | Request new ad. Can not call this function if the ad is loaded but not presented and dismissed. |
| presentAd      | Function | Present loaded ad. Ad must be loaded prior to this call.                                        |

:::tip

Note that `adPresented` value remains `true` after the ad is dismissed. The value changes to `false` when ad is initialized via `requestAd`. To determine whether the ad is showing, use `adShowing` value.

:::