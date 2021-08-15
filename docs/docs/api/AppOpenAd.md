---
id: AppOpenAd
title: AppOpenAd
sidebar_label: AppOpenAd
---

Creates [App Open Ad](https://developers.google.com/admob/android/app-open-ads) and register event listeners to various events.

:::tip

If you are going to use App Open Ad inside _functional component_, consider using [`useAppOpenAd`](useAppOpenAd).

:::

## Useage Example

TODO

## Methods

### createAd()

```js
static createAd(unitId: string, showOnColdStart?: boolean, requestOptions?: RequestOptions): AppOpenAd
```

Creates an ad instance. You can create AppOpenAd only once in your app. Ad is loaded automatically after created and dismissed.

**Parameters**

`unitId` : App Open Ad [unitId](https://support.google.com/admob/answer/7356431).

`showOnColdStart` : Whether to show ad on app [coldstart](https://developers.google.com/admob/android/app-open-ads#coldstart). Defaults to `false`.

`showOnAppForeground` : Whether to show ad on app becomes foreground. Defaults to `true`.

`requestOptions` (Optional) : [RequestOptions](RequestOptions) used to load the ad.

### load()

```js
static load(requestOptions?: RequestOptions): Promise<void>
```

Loads new App Open Ad.

Generally you don't need to call this function because ad is loaded automatically on ad created and ad dismissed.

**Parameters**

`requestOptions` (Optional) : [RequestOptions](RequestOptions) used to load the ad. 

**Returns**

`Promise` that waits for ad load. When error is occured while loading ad, the Promise will reject with `Error` object.

### show()

```js
static show(): Promise<void>
```

Shows loaded App Open Ad.

Ad must be loaded before calling this function.

You don't need to call this function if you set `showOnAppForeground` option to true.

**Returns**

`Promise` that waits for ad present. When error is occured while presenting ad, the Promise will reject with `Error` object.

### addEventListener()

```js
static addEventListener(event: string, handler: (event?: any) => any): void
```

Adds an event handler for an ad event.

**Parameters**

`event` : Event name. Supported events:

| Event Name        | Description                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| adPresented       | Fires when the ad is presented to user.                                                               |
| adFailedToPresent | Fires when an error occured while presenting ad. The argument to the event handler is `Error` object. |
| adDismissed       | Fires when the ad is dismissed.                                                                       |

`handler` : An event handler.

### removeEventListener()

```js
static removeEventListener(handler: (event?: any) => any): void
```

Removes an event handler.

**Parameters**

`handler` : An event handler to remove.

### removeAllListeners()

```js
static removeAllListeners(): void
```

Removes all registered event handlers for this ad.

### setRequestOptions()

```js
static setRequestOptions(requestOptions?: RequestOptions): void
```

Sets RequestOptions for this Ad instance.

**Parameters**

`requestOptions` : [RequestOptions](RequestOptions) used to load the ad.