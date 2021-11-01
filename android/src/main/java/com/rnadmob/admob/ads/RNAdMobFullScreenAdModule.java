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

import java.util.Locale;
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

    protected abstract void show(T ad, Activity activity, int requestId);

    protected void sendEvent(String eventName, int requestId, @Nullable WritableMap data) {
        RNAdMobEventModule.sendEvent(eventName, getAdType(), requestId, data);
    }

    protected Activity getCurrentActivity(Promise promise) {
        Activity activity = super.getCurrentActivity();
        if (activity == null && promise != null) {
            promise.reject("E_NULL_ACTIVITY", "Cannot process Ad because the current Activity is null.");
        }
        return activity;
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
                if (promise != null) {
                    String code = String.format(Locale.getDefault(), "E_AD_LOAD_FAILED(%d)", loadAdError.getCode());
                    promise.reject(code, loadAdError.getMessage());
                }

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

    protected void requestAd(int requestId, String unitId, ReadableMap options, final Promise promise) {
        Activity activity = getCurrentActivity(promise);
        if (activity == null) {
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

    protected void presentAd(int requestId, final Promise promise) {
        Activity activity = getCurrentActivity(promise);
        if (activity == null) {
            return;
        }

        activity.runOnUiThread(() -> {
            T ad = adHolder.get(requestId);
            if (ad != null) {
                presentPromiseHolder.add(requestId, promise);
                show(ad, activity, requestId);
            } else {
                if (promise != null) {
                    promise.reject("E_AD_NOT_READY", "Ad is not ready.");
                }
                WritableMap error = Arguments.createMap();
                error.putString("message", "Ad is not ready.");
                sendEvent(AD_FAILED_TO_PRESENT, requestId, error);
            }
        });
    }

    protected void destroyAd(int requestId) {
        adHolder.remove(requestId);
        presentPromiseHolder.reject(requestId, "E_AD_DESTROYED", "Ad has been destroyed.");
    }
}
