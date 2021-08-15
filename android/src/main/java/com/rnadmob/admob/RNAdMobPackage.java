package com.rnadmob.admob;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

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
                new RNAdMobEventModule(reactContext)
        );
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Arrays.asList(new RNAdMobBannerViewManager());
    }
}
