---
id: setRequestConfiguration
title: setRequestConfiguration
sidebar_label: setRequestConfiguration
---

Use this function to configure Ad requests and initialize Mobile Ads SDK. You need to call this function before you load any Ads. Generally, you call this function when the root component of your app is mounted.

## Usage example

```js
import { AdManager } from '@react-native-admob/admob';

const config = {
  testDeviceIds: ["YOUR_TEST_DEVICE_ID"],
  maxAdContetRating: "MA",
  tagForChildDirectedTreatment: false,
  tagForUnderAgeConsent: false,
};

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await AdManager.setRequestConfiguration(config);

      setLoading(false);
    };

    init();
  }, []);

  return (/* Your App code */)
```

## Arguments

### `config`

Configuration object that collects targeting information to be applied globally.

| Type   |
| :----- |
| object |

Properties:

| Configurations               | Type                                      | Descrition |
| :--------------------------- | :---------------------------------------- | :--------- |
| testDeviceIds                | string[]                                  |            |
| maxAdContentRating           | [MaxAdContentRating](#maxadcontentrating) |            |
| tagForChildDirectedTreatment | boolean                                   |            |
| tagForUnderAgeConsent        | boolean                                   |            |

## Returns

The function returns `Promise<InitializationStatus[]>` which is Promise of each mediation adapter's initialization status.

| Type                                                     |
| :------------------------------------------------------- |
| Promise<[InitializationStatus](#requestconfiguration)[]> |

Properties of `InitializationStatus`:

| Name        | Type    | Description                   |
| :---------- | :------ | :---------------------------- |
| name        | string  | Name of the adapter.          |
| description | string  | Description of the status.    |
| isReady     | boolean | Whether the adapter is ready. |

## Type Definitions

### MaxAdContentRating

| Type   |
| :----- |
| string |

Avaliable values:

| Name | Description                                                                                                                                       |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| G    | "General audiences." Content suitable for all audiences, including families and children.                                                         |
| MA   | "Mature audiences." Content suitable only for mature audiences; includes topics such as alcohol, gambling, sexual content, and weapons.           |
| PG   | "Parental guidance." Content suitable for most audiences with parental guidance, including topics like non-realistic, cartoonish violence.        |
| T    | "Teen." Content suitable for teen and older audiences, including topics such as general health, social networks, scary imagery, and fight sports. |
