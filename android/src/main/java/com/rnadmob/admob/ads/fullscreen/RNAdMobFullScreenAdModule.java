package com.rnadmob.admob.ads.fullscreen;

import static com.rnadmob.admob.RNAdMobEventModule.AD_DISMISSED;
import static com.rnadmob.admob.RNAdMobEventModule.AD_FAILED_TO_LOAD;
import static com.rnadmob.admob.RNAdMobEventModule.AD_FAILED_TO_PRESENT;
import static com.rnadmob.admob.RNAdMobEventModule.AD_LOADED;
import static com.rnadmob.admob.RNAdMobEventModule.AD_PRESENTED;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdLoadCallback;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.admanager.AdManagerAdRequest;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.ServerSideVerificationOptions;
import com.google.android.gms.ads.rewardedinterstitial.RewardedInterstitialAd;
import com.rnadmob.admob.ActivityAwareJavaModule;
import com.rnadmob.admob.RNAdMobAdHolder;
import com.rnadmob.admob.RNAdMobCommon;
import com.rnadmob.admob.RNAdMobEventModule;
import com.rnadmob.admob.RNAdMobPromiseHolder;

import java.util.Objects;

public abstract class RNAdMobFullScreenAdModule<T> extends ActivityAwareJavaModule {

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

    protected void sendError(String eventName, int requestId, @Nullable Promise promise, WritableMap error) {
        if (promise != null) {
            String message;
            if (eventName.equals(AD_FAILED_TO_LOAD)) {
                message = "Error occurred while loading ad.";
            } else {
                message = "Error occurred while showing ad.";
            }
            promise.reject(eventName, message, error.copy());
        } else if (eventName.equals(AD_FAILED_TO_PRESENT)) {
            presentPromiseHolder.reject(requestId, error.copy());
        }
        sendEvent(eventName, requestId, error.copy());
    }

    protected WritableMap createErrorObject(@Nullable Integer code, String message) {
        WritableMap error = Arguments.createMap();
        if (code == null)
            error.putNull("code");
        else
            error.putInt("code", code);
        error.putString("message", message);
        return error;
    }

    protected WritableMap createErrorObject(AdError adError) {
        return createErrorObject(adError.getCode(), adError.getMessage());
    }

    private AdLoadCallback<T> getAdLoadCallback(int requestId, ReadableMap options, Promise promise) {
        return new AdLoadCallback<T>() {
            @Override
            public void onAdLoaded(@NonNull T ad) {
                adHolder.add(requestId, ad);

                ReadableMap requestOptions = Objects.requireNonNull(options.getMap("requestOptions"));
                ServerSideVerificationOptions ssv = RNAdMobCommon.buildServerSideVerificationOptions(requestOptions);

                if (ssv != null) {
                    if (ad instanceof RewardedAd) {
                        ((RewardedAd) ad).setServerSideVerificationOptions(ssv);
                    } else if (ad instanceof RewardedInterstitialAd) {
                        ((RewardedInterstitialAd) ad).setServerSideVerificationOptions(ssv);
                    }
                }

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
                WritableMap error = createErrorObject(loadAdError);
                sendError(AD_FAILED_TO_LOAD, requestId, promise, error);

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
                }

                if (haveToRequest) {
                    requestAd(requestId, unitId, options, null);
                } else {
                    adHolder.remove(requestId);
                }
            }

            @Override
            public void onAdFailedToShowFullScreenContent(@NonNull AdError adError) {
                WritableMap error = createErrorObject(adError);
                sendError(AD_FAILED_TO_PRESENT, requestId, null, error);

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
        if (currentActivity == null) {
            WritableMap error = createErrorObject(null, "Current activity is null.");
            sendError(AD_FAILED_TO_LOAD, requestId, promise, error);
            return;
        }

        adHolder.remove(requestId);
        currentActivity.runOnUiThread(() -> {
            AdManagerAdRequest adRequest = RNAdMobCommon.buildAdRequest(Objects.requireNonNull(options.getMap("requestOptions")));
            AdLoadCallback<T> adLoadCallback = getAdLoadCallback(requestId, options, promise);
            FullScreenContentCallback fullScreenContentCallback = getFullScreenContentCallback(requestId, unitId, options);
            load(unitId, adRequest, adLoadCallback, fullScreenContentCallback);
        });
    }

    protected void presentAd(int requestId, final Promise promise) {
        if (currentActivity == null) {
            WritableMap error = createErrorObject(null, "Current activity is null.");
            sendError(AD_FAILED_TO_PRESENT, requestId, promise, error);
            return;
        }

        currentActivity.runOnUiThread(() -> {
            T ad = adHolder.get(requestId);
            if (ad != null) {
                presentPromiseHolder.add(requestId, promise);
                show(ad, requestId);
            } else {
                WritableMap error = createErrorObject(null, "Ad is not loaded.");
                sendError(AD_FAILED_TO_PRESENT, requestId, promise, error);
            }
        });
    }

    protected void destroyAd(int requestId) {
        adHolder.remove(requestId);

        WritableMap error = createErrorObject(null, "Ad has been destroyed.");
        presentPromiseHolder.reject(requestId, error);
    }
}
