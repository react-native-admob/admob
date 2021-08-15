---
id: useAppOpenAd
title: useAppOpenAd
sidebar_label: useAppOpenAd
---

Use this hook to use [App Open Ad](https://developers.google.com/admob/android/app-open-ads) with its various states.

## Usage example

Example below uses external library [react-native-bootsplash](https://github.com/zoontek/react-native-bootsplash). This is not necessary, but we recommend you to use this library with App Open Ad.

```js
import { useAppOpenAd } from '@react-native-admob/admob';
import RNBootSplash from 'react-native-bootsplash';

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { adDismissed } = useAppOpenAd(initialized ? UNIT_ID_APP_OPEN : null, {
    showOnColdStart: true,
  });

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
    if (initialized && loaded && adDismissed) {
      RNBootSplash.hide({ fade: true });
    }
  }, [initialized, loaded, adDismissed]);

  return initialized && loaded && adDismissed ? <Example /> : <View />;
}
```

## Arguments

### `unitId`

Your App Open Ad's [ad Unit ID](https://support.google.com/admob/answer/7356431)

You can set the value to `null` to create Ad conditionally. If the value is `null`, ad is not created. Using this, you can create ad after the SDK is initialized.

| Type           |
| :------------- |
| string \| null |

### `options`

Options for your App Open Ad. Available values are listed below:

| Type   |
| :----- |
| object |

Properties:

| Name                | Type                             | Default | Description                                                                                                |
| :------------------ | :------------------------------- | :------ | :--------------------------------------------------------------------------------------------------------- |
| showOnColdStart     | boolean                          | `false` | Whether to show ad on app [coldstart](https://developers.google.com/admob/android/app-open-ads#coldstart). |
| showOnAppForeground | boolean                          | `true`  | Whether to show ad on app becomes foreground.                                                              |
| requestOptions      | [RequestOptions](RequestOptions) | {}      | Optional RequestOptions used to load the ad.                                                               |

## Returns

| Type   |
| :----- |
| object |

Properties:

| Name           | Type     | Description                                                                                   |
| :------------- | :------- | :-------------------------------------------------------------------------------------------- |
| adLoaded       | boolean  | Whether your ad is loaded and ready to present.                                               |
| adPresented    | boolean  | Whether your ad is presented to user. Value is remained `true` until new ad is **loaded**.    |
| adDismissed    | boolean  | Whether your ad is dismissed. Value is remained `true` until new ad is **presented**.         |
| adShowing      | boolean  | Whether your ad is showing. The value is equal with `adPresented && !adDismissed`.            |
| adLoadError    | Error    | Error during ad load.                                                                         |
| adPresentError | Error    | Error during ad present.                                                                      |
| load           | Function | Loads new ad. Can not call this function if the ad is loaded but not presented and dismissed. |
| show           | Function | Shows loaded ad. Ad must be loaded prior to this call.                                        |

:::tip

Note that `adPresented` value remains `true` after the ad is dismissed. The value changes to `false` when ad is initialized via `load()`. Also, `adDismissed` value remains `true` until new ad is presented even if after a new ad is loaded. To determine whether the ad is showing, use `adShowing` value.

:::
