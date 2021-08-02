---
id: isTestDevice
title: isTestDevice
sidebar_label: isTestDevice
---

Use this function to check if the current device is registered as a test device to show test ads.

## Usage Example

```js
import { AdManager } from '@react-native-admob/admob';

AdManager.isTestDevice().then((result) => console.log(result));
```

## Returns

The function returns `Promise<boolean>` which is Promise of `boolean` weather current device is a test device.
