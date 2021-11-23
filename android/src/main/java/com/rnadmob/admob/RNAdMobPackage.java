package com.rnadmob.admob;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.rnadmob.admob.ads.fullscreen.RNAdMobAppOpenAdModule;
import com.rnadmob.admob.ads.banner.RNAdMobBannerViewManager;
import com.rnadmob.admob.ads.fullscreen.RNAdMobInterstitialAdModule;
import com.rnadmob.admob.ads.fullscreen.RNAdMobRewardedAdModule;
import com.rnadmob.admob.ads.fullscreen.RNAdMobRewardedInterstitialAdModule;

import java.util.Arrays;
import java.util.List;

public class RNAdMobPackage implements ReactPackage {
    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        return Arrays.asList(
                new RNAdMobModule(reactContext),
                new RNAdMobInterstitialAdModule(reactContext),
                new RNAdMobRewardedAdModule(reactContext),
                new RNAdMobRewardedInterstitialAdModule(reactContext),
                new RNAdMobAppOpenAdModule(reactContext),
                new RNAdMobEventModule(reactContext)
        );
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Arrays.asList(new RNAdMobBannerViewManager());
    }
}
