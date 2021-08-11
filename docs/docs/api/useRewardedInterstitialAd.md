---
id: useRewardedInterstitialAd
title: useRewardedInterstitialAd
sidebar_label: useRewardedInterstitialAd
---

Use this hook to use Rewarded Interstitial Ad with its various states.

## Usage example

```js
import { useRewardedInterstitialAd } from '@react-native-admob/admob';

const hookOptions = {
  requestOnDismissed: true,
};

export default function App() {
  const {
    adLoadError,
    adLoaded,
    reward,
    presentAd
  } = useRewardedInterstitialAd(UNIT_ID_REWARDED, hookOptions);

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
      console.log(`Reward Earned: ${reward.type}`);
    }
  }, [reward]);

  return (/* Your App code */)
```

## Arguments

### `unitId`

Your Rewarded Interstitial Ad's [ad Unit ID](https://support.google.com/admob/answer/7356431)

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

| Name           | Type        | Description                                                                                     |
| :------------- | :---------- | :---------------------------------------------------------------------------------------------- |
| adLoaded       | boolean     | Whether your ad is loaded and ready to present.                                                 |
| adPresented    | boolean     | Whether your ad is presented to user.                                                           |
| adDismissed    | boolean     | Whether your ad is dismissed.                                                                   |
| adShowing      | boolean     | Whether your ad is showing. The value is equal with `adPresented && !adDismissed`.              |
| adLoadError    | Error       | Error during ad load.                                                                           |
| adPresentError | Error       | Error during ad present.                                                                        |
| reward         | [Reward](#) | Reward earned by user. The value is `undefined` until user earns reward.                        |
| requestAd      | Function    | Request new ad. Can not call this function if the ad is loaded but not presented and dismissed. |
| presentAd      | Function    | Present loaded ad. Ad must be loaded prior to this call.                                        |

:::tip

Note that `adPresented` value remains `true` after the ad is dismissed. The value changes to `false` when ad is initialized via `requestAd`. To determine whether the ad is showing, use `adShowing` value.

:::