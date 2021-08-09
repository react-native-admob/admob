---
id: installation
title: Installation
sidebar_label: Installation
---

If you are using `react-native >= 0.60` you just need to do a simple:

    npm install @react-native-admob/admob --save

or if you use yarn:

    yarn add @react-native-admob/admob

## Android Setup

Add your AdMob App ID to `AndroidManifest.xml`, as described in the [Google Mobile Ads SDK documentation](https://developers.google.com/admob/android/quick-start#configure_your_app).

## iOS Setup

Open your Podfile and add this line to your app's target:

```ruby
pod 'Google-Mobile-Ads-SDK', '~> 8.0.0'
```

Then from the command line run (inside the ios folder):

```bash
pod install
```

Finally, update your Info.plist as described in the [Google Mobile Ads SDK documentation](https://developers.google.com/admob/ios/quick-start#update_your_infoplist).

## Requesting IDFA on iOS 14

On iOS 14 onwards, you need to request IDFA access through App Tracking Transparency Dialog to show targeted ads to the user. For that you can use [react-native-tracking-transparency](https://github.com/mrousavy/react-native-tracking-transparency).
