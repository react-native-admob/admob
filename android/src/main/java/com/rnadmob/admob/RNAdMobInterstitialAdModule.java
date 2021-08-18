package com.rnadmob.admob;

import static com.rnadmob.admob.RNAdMobEventModule.AD_DISMISSED;
import static com.rnadmob.admob.RNAdMobEventModule.AD_FAILED_TO_PRESENT;
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
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.admanager.AdManagerAdRequest;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;

public class RNAdMobInterstitialAdModule extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "RNAdMobInterstitial";

    RNAdMobAdHolder<InterstitialAd> adHolder = new RNAdMobAdHolder<>();
    RNAdMobPromiseHolder presentPromiseHolder = new RNAdMobPromiseHolder();

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        adHolder.clear();
        presentPromiseHolder.clear();
    }

    public RNAdMobInterstitialAdModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private void sendEvent(String eventName, int requestId, @Nullable WritableMap data) {
        RNAdMobEventModule.sendEvent(eventName, "Interstitial", requestId, data);
    }

    private FullScreenContentCallback getFullScreenContentCallback(int requestId) {
        return new FullScreenContentCallback(){
            @Override
            public void onAdDismissedFullScreenContent() {
                sendEvent(AD_DISMISSED, requestId, null);
                adHolder.remove(requestId);
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
    public void requestAd(int requestId, String unitId, ReadableMap requestOptions, final Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject("E_NULL_ACTIVITY", "Interstitial ad attempted to load but the current Activity was null.");
            return;
        }

        adHolder.remove(requestId);
        activity.runOnUiThread(() -> {
            AdManagerAdRequest adRequest = RNAdMobCommon.buildAdRequest(requestOptions);
            InterstitialAd.load(getReactApplicationContext(), unitId, adRequest,
                    new InterstitialAdLoadCallback() {
                        @Override
                        public void onAdLoaded(@NonNull InterstitialAd ad) {
                            FullScreenContentCallback callback = getFullScreenContentCallback(requestId);
                            ad.setFullScreenContentCallback(callback);
                            adHolder.add(requestId, ad);

                            promise.resolve(null);
                        }

                        @Override
                        public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                            promise.reject(String.valueOf(loadAdError.getCode()), loadAdError.getMessage());
                        }
                    });
        });
    }

    @ReactMethod
    public void presentAd(int requestId, final Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject("E_NULL_ACTIVITY", "Interstitial ad attempted to load but the current Activity was null.");
            return;
        }

        activity.runOnUiThread(() -> {
            InterstitialAd ad = adHolder.get(requestId);
            if (ad != null) {
                presentPromiseHolder.add(requestId, promise);
                ad.show(activity);
            } else {
                promise.reject("E_AD_NOT_READY", "Ad is not ready.");
            }
        });
    }

}
