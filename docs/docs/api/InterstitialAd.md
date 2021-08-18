---
id: InterstitialAd
title: InterstitialAd
sidebar_label: InterstitialAd
---

Creates [Interstitial Ad](https://developers.google.com/admob/android/interstitial) and register event listeners to various events.

:::tip

If you are going to use Interstitial Ad inside _functional component_, consider using [`useInterstitialAd`](useInterstitialAd).

:::

## Useage Example

TODO

## Methods

:::info

Methods listed below except [`createAd()`](#createad) must be called from instance created by [`createAd()`](#createad) static method.

:::

### createAd()

```js
static createAd(unitId: string, requestOptions?: RequestOptions): InterstitialAd
```

Creates an ad instance.

**Parameters**

`unitId` : Interstitial Ad [unitId](https://support.google.com/admob/answer/7356431).

`requestOptions` (Optional) : [RequestOptions](RequestOptions) used to load the ad. 

**Returns**

`InterstitialAd` instance

### load()

```js
load(requestOptions?: RequestOptions): Promise<void>
```

Loads new Interstitial Ad.

Can not call this function if the ad is already loaded but not presented and dismissed. 

**Parameters**

`requestOptions` (Optional) : [RequestOptions](RequestOptions) used to load the ad. 

**Returns**

`Promise` that waits for ad load. When error is occured while loading ad, the Promise will reject with `Error` object.

### show()

```js
show(): Promise<void>
```

Shows loaded Interstitial Ad. 

Ad must be loaded before calling this function. 

**Returns**

`Promise` that waits for ad present. When error is occurred while presenting ad, the Promise will reject with `Error` object.

### addEventListener()

```js
addEventListener(event: string, handler: (event?: any) => any): void
```

Adds an event handler for an ad event.

**Parameters**

`event` : Event name. Supported events:

| Event Name        | Description                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| adLoaded          | Fires when the ad has finished loading.                                                                |
| adFailedToLoad    | Fires when the ad has failed to load. The argument to the event handler is `Error` object.             |
| adPresented       | Fires when the ad is presented to user.                                                                |
| adFailedToPresent | Fires when an error occurred while presenting ad. The argument to the event handler is `Error` object. |
| adDismissed       | Fires when the ad is dismissed.                                                                        |

`handler` : An event handler.

### removeAllListeners()

```js
removeAllListeners(): void
```

Removes all registered event handlers for this ad.

### setRequestOptions()

```js
setRequestOptions(requestOptions?: RequestOptions): void
```

Sets RequestOptions for this Ad instance.

**Parameters**

`requestOptions` : [RequestOptions](RequestOptions) used to load the ad.