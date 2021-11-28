package com.rnadmob.admob.ads.fullscreen;

import static com.rnadmob.admob.RNAdMobEventModule.AD_FAILED_TO_LOAD;

import android.os.Handler;

import androidx.annotation.NonNull;
import androidx.lifecycle.DefaultLifecycleObserver;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.ProcessLifecycleOwner;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.ads.AdLoadCallback;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.admanager.AdManagerAdRequest;
import com.google.android.gms.ads.appopen.AppOpenAd;

import java.util.Date;

public class RNAdMobAppOpenAdModule extends RNAdMobFullScreenAdModule<AppOpenAd> implements DefaultLifecycleObserver {

    public static final String AD_TYPE = "AppOpen";
    private static final int AD_EXPIRE_HOUR = 4;

    public static boolean appStarted = false;

    private Integer requestId = null;
    private String unitId = null;
    private ReadableMap options = null;

    private long loadTime = 0;

    public RNAdMobAppOpenAdModule(ReactApplicationContext reactContext) {
        super(reactContext);
        Handler mainHandler = new Handler(reactContext.getMainLooper());
        mainHandler.post(() -> ProcessLifecycleOwner.get().getLifecycle().addObserver(this));
    }

    @Override
    public void invalidate() {
        super.invalidate();
        appStarted = false;
    }

    @Override
    protected String getAdType() {
        return AD_TYPE;
    }

    @Override
    @ReactMethod
    public void requestAd(int requestId, String unitId, ReadableMap options, final Promise promise) {
        super.requestAd(requestId, unitId, options, promise);
        this.requestId = requestId;
        this.unitId = unitId;
        this.options = options;
    }

    @Override
    @ReactMethod
    protected void presentAd(int requestId, final Promise promise) {
        super.presentAd(requestId, promise);
    }

    @Override
    @ReactMethod
    protected void destroyAd(int requestId) {
        super.destroyAd(requestId);
        this.requestId = null;
        unitId = null;
        options = null;
    }

    @Override
    protected void load(String unitId, AdManagerAdRequest adRequest, AdLoadCallback<AppOpenAd> adLoadCallback, FullScreenContentCallback fullScreenContentCallback) {
        AppOpenAd.load(getReactApplicationContext(), unitId, adRequest, AppOpenAd.APP_OPEN_AD_ORIENTATION_PORTRAIT,
                new AppOpenAd.AppOpenAdLoadCallback() {
                    @Override
                    public void onAdLoaded(@NonNull AppOpenAd ad) {
                        ad.setFullScreenContentCallback(fullScreenContentCallback);
                        loadTime = (new Date()).getTime();
                        adLoadCallback.onAdLoaded(ad);
                    }

                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                        adLoadCallback.onAdFailedToLoad(loadAdError);
                    }
                });
    }

    @Override
    protected void show(AppOpenAd ad, int requestId) {
        if (isAdExpired()) {
            WritableMap error = createErrorObject(null, "Ad is expired.");
            sendError(AD_FAILED_TO_LOAD, requestId, null, error);

            requestAd(requestId, unitId, options, null);
            return;
        }
        ad.show(currentActivity);
    }

    private boolean isAdExpired() {
        long dateDifference = (new Date()).getTime() - this.loadTime;
        long numMilliSecondsPerHour = 3600000;
        return (dateDifference > (numMilliSecondsPerHour * (long) AD_EXPIRE_HOUR));
    }

    @Override
    public void onStart(@NonNull LifecycleOwner owner) {
        if (requestId == null || unitId == null || options == null) {
            return;
        }
        boolean showOnAppForeground = true;
        if (options.hasKey("showOnAppForeground")) {
            showOnAppForeground = options.getBoolean("showOnAppForeground");
        }
        if (showOnAppForeground) {
            if (adHolder.get(requestId) != null) {
                presentAd(requestId, null);
            } else {
                requestAd(requestId, unitId, options, null);
            }
        }
    }
}
