package com.rnadmob.admob;

import static com.rnadmob.admob.RNAdMobEventModule.AD_DISMISSED;
import static com.rnadmob.admob.RNAdMobEventModule.AD_FAILED_TO_LOAD;
import static com.rnadmob.admob.RNAdMobEventModule.AD_FAILED_TO_PRESENT;
import static com.rnadmob.admob.RNAdMobEventModule.AD_LOADED;
import static com.rnadmob.admob.RNAdMobEventModule.AD_PRESENTED;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleObserver;
import androidx.lifecycle.OnLifecycleEvent;
import androidx.lifecycle.ProcessLifecycleOwner;

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

public class RNAdMobAppOpenAdModule extends ReactContextBaseJavaModule implements LifecycleObserver {

    public static final String REACT_CLASS = "RNAdMobAppOpen";

    private Promise presentPromise = null;
    private AppOpenAd appOpenAd = null;
    private volatile String unitId = null;
    private ReadableMap requestOptions = null;
    private boolean showOnAppForeground = true;
    private boolean showOnColdStart = false;
    private boolean appStarted = false;
    private long loadTime = 0;

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public RNAdMobAppOpenAdModule(ReactApplicationContext reactContext) {
        super(reactContext);
        ProcessLifecycleOwner.get().getLifecycle().addObserver(this);
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
                presentPromise = null;
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
                presentPromise = null;
            }
            sendEvent(AD_PRESENTED, null);
        }
    };

    @ReactMethod
    public void setUnitId(String unitId) {
        this.unitId = unitId;
        requestAd(null, null);
    }

    @ReactMethod
    public void setOptions(ReadableMap options) {
        requestOptions = options.getMap("requestOptions");
        showOnAppForeground = options.getBoolean("showOnAppForeground");
        showOnColdStart = options.getBoolean("showOnColdStart");
        requestAd(null, null);
    }

    @ReactMethod
    public void requestAd(int requestId, String unitId, ReadableMap requestOptions, final Promise promise) {
        requestAd(requestOptions, promise);
    }

    @ReactMethod
    public void presentAd(int requestId, final Promise promise) {
        presentPromise = promise;
        showAdIfAvailable();
    }

    private void requestAd(@Nullable ReadableMap requestOptions, @Nullable final Promise promise) {
        if (unitId == null || this.requestOptions == null) return;
        Activity activity = getCurrentActivity();
        if (activity == null) {
            if (promise != null) {
                promise.reject("E_NULL_ACTIVITY", "App Open Ad attempted to load but the current Activity was null.");
            }
            return;
        }
        requestOptions = requestOptions != null ? requestOptions : this.requestOptions;
        AdManagerAdRequest adRequest = RNAdMobCommon.buildAdRequest(requestOptions);
        activity.runOnUiThread(() -> {
            AppOpenAd.load(getReactApplicationContext(), unitId, adRequest, AppOpenAd.APP_OPEN_AD_ORIENTATION_PORTRAIT,
                    new AppOpenAd.AppOpenAdLoadCallback() {
                        @Override
                        public void onAdLoaded(@NonNull AppOpenAd ad) {
                            ad.setFullScreenContentCallback(fullScreenContentCallback);
                            appOpenAd = ad;
                            loadTime = (new Date()).getTime();
                            if (promise != null) {
                                promise.resolve(null);
                            }

                            sendEvent(AD_LOADED, null);

                            if (!appStarted) {
                                appStarted = true;
                                if (showOnColdStart) {
                                    showAdIfAvailable();
                                }
                            }
                        }

                        @Override
                        public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                            if (promise != null) {
                                promise.reject(String.valueOf(loadAdError.getCode()), loadAdError.getMessage());
                            }

                            WritableMap error = Arguments.createMap();
                            error.putInt("code", loadAdError.getCode());
                            error.putString("message", loadAdError.getMessage());
                            sendEvent(AD_FAILED_TO_LOAD, error);

                            if (!appStarted) {
                                appStarted = true;
                            }
                        }
                    });
        });
    }

    private void showAdIfAvailable() {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            if (presentPromise != null) {
                presentPromise.reject("E_NULL_ACTIVITY", "App Open Ad attempted to load but the current Activity was null.");
                presentPromise = null;
            }
            return;
        }
        activity.runOnUiThread(() -> {
            if (appOpenAd != null && wasLoadTimeLessThanNHoursAgo(4)) {
                appOpenAd.show(activity);
            } else {
                requestAd(null, null);
                if (presentPromise != null) {
                    presentPromise.reject("E_AD_NOT_READY", "Ad is not ready.");
                    presentPromise = null;
                }
            }
        });
    }

    private boolean wasLoadTimeLessThanNHoursAgo(long numHours) {
        long dateDifference = (new Date()).getTime() - this.loadTime;
        long numMilliSecondsPerHour = 3600000;
        return (dateDifference < (numMilliSecondsPerHour * numHours));
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_START)
    public void onMoveToForeground() {
        if (showOnAppForeground) {
            showAdIfAvailable();
        }
    }

}
