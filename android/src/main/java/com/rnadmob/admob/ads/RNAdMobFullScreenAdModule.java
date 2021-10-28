package com.rnadmob.admob.ads;

import static com.rnadmob.admob.RNAdMobEventModule.AD_DISMISSED;
import static com.rnadmob.admob.RNAdMobEventModule.AD_FAILED_TO_LOAD;
import static com.rnadmob.admob.RNAdMobEventModule.AD_FAILED_TO_PRESENT;
import static com.rnadmob.admob.RNAdMobEventModule.AD_LOADED;
import static com.rnadmob.admob.RNAdMobEventModule.AD_PRESENTED;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdLoadCallback;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.admanager.AdManagerAdRequest;
import com.rnadmob.admob.RNAdMobAdHolder;
import com.rnadmob.admob.RNAdMobCommon;
import com.rnadmob.admob.RNAdMobEventModule;
import com.rnadmob.admob.RNAdMobPromiseHolder;

import java.util.Objects;

public abstract class RNAdMobFullScreenAdModule<T> extends ReactContextBaseJavaModule {

    RNAdMobAdHolder<T> adHolder = new RNAdMobAdHolder<>();
    RNAdMobPromiseHolder presentPromiseHolder = new RNAdMobPromiseHolder();

    public RNAdMobFullScreenAdModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "RNAdMob" + getAdType() + "Ad";
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        adHolder.clear();
        presentPromiseHolder.clear();
    }

    protected abstract String getAdType();

    protected abstract void load(String unitId, AdManagerAdRequest adRequest, AdLoadCallback<T> adLoadCallback, FullScreenContentCallback fullScreenContentCallback);

    protected abstract void show(T ad, int requestId);

    protected void sendEvent(String eventName, int requestId, @Nullable WritableMap data) {
        RNAdMobEventModule.sendEvent(eventName, getAdType(), requestId, data);
    }

    private AdLoadCallback<T> getAdLoadCallback(int requestId, ReadableMap options, Promise promise) {
        return new AdLoadCallback<T>() {
            @Override
            public void onAdLoaded(@NonNull T ad) {
                adHolder.add(requestId, ad);

                if (promise != null) promise.resolve(null);

                sendEvent(AD_LOADED, requestId, null);

                boolean haveToShow = false;
                if (options.hasKey("showOnLoaded")) {
                    haveToShow = options.getBoolean("showOnLoaded");
                } else if (getAdType().equals(RNAdMobAppOpenAdModule.AD_TYPE)) {
                    if (!RNAdMobAppOpenAdModule.appStarted && options.hasKey("showOnColdStart")) {
                        RNAdMobAppOpenAdModule.appStarted = true;
                        haveToShow = options.getBoolean("showOnColdStart");
                    }
                }

                if (haveToShow) {
                    presentAd(requestId, null);
                }
            }

            @Override
            public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                if (promise != null)
                    promise.reject(String.valueOf(loadAdError.getCode()), loadAdError.getMessage());

                WritableMap error = Arguments.createMap();
                error.putInt("code", loadAdError.getCode());
                error.putString("message", loadAdError.getMessage());
                sendEvent(AD_FAILED_TO_LOAD, requestId, error);

                if (getAdType().equals(RNAdMobAppOpenAdModule.AD_TYPE)) {
                    if (!RNAdMobAppOpenAdModule.appStarted) {
                        RNAdMobAppOpenAdModule.appStarted = true;
                    }
                }
            }
        };
    }

    private FullScreenContentCallback getFullScreenContentCallback(int requestId, String unitId, ReadableMap options) {
        return new FullScreenContentCallback() {
            @Override
            public void onAdDismissedFullScreenContent() {
                sendEvent(AD_DISMISSED, requestId, null);

                boolean haveToRequest = false;
                if (options.hasKey("loadOnDismissed")) {
                    haveToRequest = options.getBoolean("loadOnDismissed");
                } else if (getAdType().equals(RNAdMobAppOpenAdModule.AD_TYPE)) {
                    haveToRequest = true;
                }

                if (haveToRequest) {
                    requestAd(requestId, unitId, options, null);
                } else {
                    adHolder.remove(requestId);
                }
            }

            @Override
            public void onAdFailedToShowFullScreenContent(@NonNull AdError adError) {
                presentPromiseHolder.reject(requestId, adError);

                WritableMap error = Arguments.createMap();
                error.putInt("code", adError.getCode());
                error.putString("message", adError.getMessage());
                sendEvent(AD_FAILED_TO_PRESENT, requestId, error);

                adHolder.remove(requestId);
            }

            @Override
            public void onAdShowedFullScreenContent() {
                presentPromiseHolder.resolve(requestId);

                sendEvent(AD_PRESENTED, requestId, null);
            }
        };
    }

    @ReactMethod
    public void requestAd(int requestId, String unitId, ReadableMap options, final Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject("E_NULL_ACTIVITY", "Ad attempted to load but the current Activity was null.");
            return;
        }

        adHolder.remove(requestId);
        activity.runOnUiThread(() -> {
            AdManagerAdRequest adRequest = RNAdMobCommon.buildAdRequest(Objects.requireNonNull(options.getMap("requestOptions")));
            AdLoadCallback<T> adLoadCallback = getAdLoadCallback(requestId, options, promise);
            FullScreenContentCallback fullScreenContentCallback = getFullScreenContentCallback(requestId, unitId, options);
            load(unitId, adRequest, adLoadCallback, fullScreenContentCallback);
        });
    }

    @ReactMethod
    public void presentAd(int requestId, final Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            if (promise != null)
                promise.reject("E_NULL_ACTIVITY", "Ad attempted to load but the current Activity was null.");
            return;
        }

        activity.runOnUiThread(() -> {
            T ad = adHolder.get(requestId);
            if (ad != null) {
                presentPromiseHolder.add(requestId, promise);
                show(ad, requestId);
            } else {
                if (promise != null)
                    promise.reject("E_AD_NOT_READY", "Ad is not ready.");
            }
        });
    }

    @ReactMethod
    public void destroyAd(int requestId) {
        adHolder.remove(requestId);
        presentPromiseHolder.reject(requestId, "E_AD_DESTROYED", "Ad has been destroyed.");
    }
}
