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
import com.google.android.gms.ads.appopen.AppOpenAd;

import java.util.Date;

public class RNAdMobAppOpenAdModule extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "RNAdMobAppOpen";

    private Promise presentPromise = null;
    private AppOpenAd appOpenAd = null;
    private long loadTime = 0;

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public RNAdMobAppOpenAdModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private void sendEvent(String eventName, @Nullable WritableMap data) {
        RNAdMobEventModule.sendEvent(eventName, "AppOpen", 0, data);
    }

    private final FullScreenContentCallback fullScreenContentCallback = new FullScreenContentCallback(){
        @Override
        public void onAdDismissedFullScreenContent() {
            sendEvent(AD_DISMISSED, null);
        }

        @Override
        public void onAdFailedToShowFullScreenContent(@NonNull AdError adError) {
            if (presentPromise != null) {
                presentPromise.reject(String.valueOf(adError.getCode()), adError.getMessage());
            }
            WritableMap error = Arguments.createMap();
            error.putInt("code", adError.getCode());
            error.putString("message", adError.getMessage());
            sendEvent(AD_FAILED_TO_PRESENT, error);
        }

        @Override
        public void onAdShowedFullScreenContent() {
            if (presentPromise != null) {
                presentPromise.resolve(null);
            }
            sendEvent(AD_PRESENTED, null);
        }
    };

    @ReactMethod
    public void requestAd(int requestId, String unitId, ReadableMap requestOptions, final Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject("E_NULL_ACTIVITY", "Interstitial ad attempted to load but the current Activity was null.");
            return;
        }
        activity.runOnUiThread(() -> {
            AdManagerAdRequest adRequest = RNAdMobCommon.buildAdRequest(requestOptions);
            AppOpenAd.load(getReactApplicationContext(), unitId, adRequest, AppOpenAd.APP_OPEN_AD_ORIENTATION_PORTRAIT,
                    new AppOpenAd.AppOpenAdLoadCallback() {
                        @Override
                        public void onAdLoaded(@NonNull AppOpenAd ad) {
                            ad.setFullScreenContentCallback(fullScreenContentCallback);
                            appOpenAd = ad;
                            loadTime = (new Date()).getTime();
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
        presentPromise = promise;
        Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject("E_NULL_ACTIVITY", "App Open Ad attempted to load but the current Activity was null.");
            return;
        }
        activity.runOnUiThread(() -> {
            if (appOpenAd != null && wasLoadTimeLessThanNHoursAgo(4)) {
                appOpenAd.show(activity);
            } else {
                promise.reject("E_AD_NOT_READY", "Ad is not ready.");
            }
        });
    }

    private boolean wasLoadTimeLessThanNHoursAgo(long numHours) {
        long dateDifference = (new Date()).getTime() - this.loadTime;
        long numMilliSecondsPerHour = 3600000;
        return (dateDifference < (numMilliSecondsPerHour * numHours));
    }

}
