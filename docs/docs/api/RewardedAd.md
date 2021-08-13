---
id: RewardedAd
title: RewardedAd
sidebar_label: RewardedAd
---

Creates Rewarded Ad and register event listeners to various events.

:::tip

If you are going to use Rewarded Ad inside _functional component_, consider using [`useRewardedAd`](useRewardedAd).

:::

## Useage Example

TODO

## Methods

:::info

Methods listed below except [`createAd()`](#createad) must be called from instance created by [`createAd()`](#createad) static method.

:::

### createAd()

```js
static createAd(unitId: string): RewardedAd
```

Create an ad instance.

**Parameters**

`unitId` : Rewarded Ad [unitId](https://support.google.com/admob/answer/7356431).

**Returns**

`RewardedAd` instance

### requestAd()

```js
requestAd(requestOptions?: RequestOptions): Promise<void>
```

Request new Rewarded Ad.

Can not call this function if the ad is already loaded but not presented and dismissed. 

**Parameters**

`requestOptions` (Optional) : [RequestOptions](RequestOptions) used to load the ad. 

**Returns**

`Promise` that waits for ad load. When error is occured while loading ad, the Promise will reject with `Error` object.

### presentAd()

```js
presentAd(): Promise<void>
```

Present loaded Interstitial Ad. 

Ad must be loaded before calling this function. 

**Returns**

`Promise` that waits for ad present. When error is occured while presenting ad, the Promise will reject with `Error` object.

### addEventListener()

```js
addEventListener(event: string, handler: (event?: any) => any): void
```

Add an event handler for an ad event.

**Parameters**

`event` : Event name. Supported events:

| Event Name        | Description                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| adPresented       | Fires when the ad is presented to user.                                                               |
| adFailedToPresent | Fires when an error occured while presenting ad. The argument to the event handler is `Error` object. |
| adDismissed       | Fires when the ad is dismissed.                                                                       |
| rewarded          | Fires when user earned reward. The argument to the event handler is Reward object.                    |

`handler` : An event handler.

### removeEventListener()

```js
removeEventListener(handler: (event?: any) => any): void
```

Remove an event handler.

**Parameters**

`handler` : An event handler to remove.

### removeAllListeners()

```js
removeAllListeners(): void
```

Remove all registered event handlers for this ad.

### setRequestOptions()

```js
setRequestOptions(requestOptions?: RequestOptions): void
```

Sets RequestOptions for this Ad instance.

**Parameters**

`requestOptions` : [RequestOptions](RequestOptions) used to load the ad.