package com.rnadmob.admob;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;

public class RNAdMobInterstitialAdModule extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "RNAdMobInterstitial";

    public static final String EVENT_AD_FAILED_TO_PRESENT = "interstitialAdFailedToLoad";
    public static final String EVENT_AD_PRESENTED = "interstitialAdPresented";
    public static final String EVENT_AD_DISMISSED = "interstitialAdDismissed";

    InterstitialAd mInterstitialAd;
    FullScreenContentCallback adCallback;
    String unitId;

    private Promise mPresentAdPromise;

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public RNAdMobInterstitialAdModule(ReactApplicationContext reactContext) {
        super(reactContext);
        adCallback = new FullScreenContentCallback(){
            @Override
            public void onAdDismissedFullScreenContent() {
                sendEvent(EVENT_AD_DISMISSED, null);
            }

            @Override
            public void onAdFailedToShowFullScreenContent(@NonNull AdError adError) {
                if (mPresentAdPromise != null) {
                    mPresentAdPromise.reject(String.valueOf(adError.getCode()), adError.getMessage());
                }
                WritableMap error = Arguments.createMap();
                error.putInt("code", adError.getCode());
                error.putString("message", adError.getMessage());
                sendEvent(EVENT_AD_FAILED_TO_PRESENT, error);
            }

            @Override
            public void onAdShowedFullScreenContent() {
                mInterstitialAd = null;
                mPresentAdPromise.resolve(null);
                sendEvent(EVENT_AD_PRESENTED, null);
            }
        };
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    @ReactMethod
    public void setUnitId(String unitId) {
        this.unitId = unitId;
    }

    @ReactMethod
    public void requestAd(final Promise promise) {
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run () {
                AdRequest.Builder adRequestBuilder = new AdRequest.Builder();
                AdRequest adRequest = adRequestBuilder.build();
                InterstitialAd.load(getReactApplicationContext(), unitId, adRequest,
                        new InterstitialAdLoadCallback() {
                            @Override
                            public void onAdLoaded(@NonNull InterstitialAd interstitialAd) {
                                mInterstitialAd = interstitialAd;
                                mInterstitialAd.setFullScreenContentCallback(adCallback);
                                promise.resolve(null);
                            }

                            @Override
                            public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                                mInterstitialAd = null;
                                promise.reject(String.valueOf(loadAdError.getCode()), loadAdError.getMessage());
                            }
                        });
            }
        });
    }

    @ReactMethod
    public void presentAd(final Promise promise) {
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run () {
                mPresentAdPromise = promise;
                Activity activity = getCurrentActivity();
                if (mInterstitialAd != null && activity != null) {
                    mInterstitialAd.show(activity);
                } else {
                    promise.reject("E_AD_NOT_READY", "Ad is not ready.");
                }
            }
        });
    }

}
