package com.rnadmob.admob.ads;

import android.app.Activity;
import android.os.Handler;

import androidx.annotation.NonNull;
import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleObserver;
import androidx.lifecycle.OnLifecycleEvent;
import androidx.lifecycle.ProcessLifecycleOwner;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.google.android.gms.ads.AdLoadCallback;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.admanager.AdManagerAdRequest;
import com.google.android.gms.ads.appopen.AppOpenAd;

import java.util.Date;

public class RNAdMobAppOpenAdModule extends RNAdMobFullScreenAdModule<AppOpenAd> implements LifecycleObserver {

    public static final String AD_TYPE = "AppOpen";
    private static final int AD_EXPIRE_HOUR = 4;

    public static boolean appStarted = false;

    private boolean showOnAppForeground = true;
    private long loadTime = 0;

    public RNAdMobAppOpenAdModule(ReactApplicationContext reactContext) {
        super(reactContext);
        Handler mainHandler = new Handler(reactContext.getMainLooper());
        mainHandler.post(() -> ProcessLifecycleOwner.get().getLifecycle().addObserver(this));
    }

    @Override
    public String getAdType() {
        return AD_TYPE;
    }

    @Override
    public void requestAd(int requestId, String unitId, ReadableMap options, final Promise promise) {
        super.requestAd(requestId, unitId, options, promise);
        showOnAppForeground = options.getBoolean("showOnAppForeground");
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
        Activity activity = getCurrentActivity();
        if (activity == null) {
            presentPromiseHolder.reject(requestId, "E_NULL_ACTIVITY", "Ad attempted to load but the current Activity was null.");
            return;
        }
        if (isAdExpired()) {
            presentPromiseHolder.reject(requestId, "E_AD_NOT_READY", "Ad is not ready.");
            return;
        }
        ad.show(activity);
    }

    private boolean isAdExpired() {
        long dateDifference = (new Date()).getTime() - this.loadTime;
        long numMilliSecondsPerHour = 3600000;
        return (dateDifference > (numMilliSecondsPerHour * (long) AD_EXPIRE_HOUR));
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_START)
    public void onMoveToForeground() {
        if (showOnAppForeground) {
            presentAd(0, null);
        }
    }

}
