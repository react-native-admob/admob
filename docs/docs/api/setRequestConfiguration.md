---
id: setRequestConfiguration
title: setRequestConfiguration
sidebar_label: setRequestConfiguration
---

Use this function to configure Ad requests globally.

## Usage example

```js
import AdMob from '@react-native-admob/admob';

const config = {
  testDeviceIds: ["YOUR_TEST_DEVICE_ID"],
  maxAdContentRating: "MA",
  tagForChildDirectedTreatment: false,
  tagForUnderAgeConsent: false,
};

export default function App() {
  useEffect(() => {
    AdMob.setRequestConfiguration(config);
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
