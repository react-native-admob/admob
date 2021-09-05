# Change Log

## 1.0.9

Bug Fixes

- BannerAd(android): Fix setAdSize related issue

## 1.0.8

Bug Fixes

- AppOpenAd(android): Fix Main Thread related issue
- AppOpenAd(iOS): Fix ad is not loaded in some cases

## 1.0.7

Bug Fixes

- AppOpenAd(android): Fix Ad is opened when other activity is opened

## 1.0.6

Features

- FullScreenAd: Added `adLoaded`, `adFailedToLoad` events

## 1.0.5

Bug Fixes

- iOS: Fix build error when hermes is enabled

## 1.0.3

BREAKING CHANGES

- FullScreenAd: `removeEventListener()` is removed. Use `remove()` function returned from `addEventListener()`

Bug Fixes

- AppOpenAd: Fix hook states are not updated
- AppOpenAd: Fix frequency cap reached not handled
- BannerAd: Fix Banner Ad events not called
- iOS: Added simulator device ids to test device ids

## 1.0.1

Features

- AppOpenAd: Added AppOpenAd(beta)

Bug Fixes

- iOS, AdMob: Fix `isTestDevice()` not working
- iOS, FullScreenAd: Fix ad not showed when another view controller is opened
- BannerAd: Fix `onSizeChange` is not called

## 1.0.0

BREAKING CHANGES

- Method `requestAd` is renamed to `load`
- Method `presentAd` is renamed to `show`
- `AdManager` module is renamed to default export `AdMob`