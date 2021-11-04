# Change Log

## 1.2.0

BREAKING CHANGES

- `AdMob.initialize()` is no more needed and deprecated.
- Added `AppOpenAdProver`. App must wrapped with `AppOpenAdProvider` to use `useAppOpenAd` hook.
- Removed `size` prop from `GAMBannerAd`. Use `sizes` prop instead.

Bug Fixes

- Fix AppOpenAd showed even if after disabled.
- Fix AppOpenAd showed when `showOnColdStart` is `false`.

Features

- Add ability to conditionally load ad using hooks.
- Improve documents and example app.

Refactor

- Refactored Full Screen Ad related codes/


## 1.1.2

Bug Fixes

- Fix loadOnDismissed not working properly in iOS
## 1.1.0

BREAKING CHANGES

- `AdHookOptions` is now renamed to `FullScreenAdOptions`
- `createAd()`'s second parameter is changed to `FullScreenAdOptions` (was `RequestOptions`).
- Added `GAMBannerAd` component to distinguish it from AdMob ads. To display Google Ad Manager banner ads, now you must use `GAMBannerAd` component.
- iOS: Added global variable `RNAdMobAsStaticFramework` to podspec. Now you don't need to manually include Google-Mobile-Ads-SDK pod, but if you are using `use-frameworks!` to use static frameworks, you have to add `$RNFirebaseAsStaticFramework = true` to your podfile.

Features

- Added `TestIds`

Bug Fixes

- `GAMBannerAd`'s size prop is changed to nullable property.

Peformance Improvements

- Peformance of Full Screen Ads Hooks is improved.

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