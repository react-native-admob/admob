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
import com.google.android.gms.ads.OnUserEarnedRewardListener;
import com.google.android.gms.ads.rewarded.RewardItem;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;

public class RNAdMobRewardedAdModule extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "RNAdMobRewarded";

    public static final String EVENT_AD_FAILED_TO_PRESENT = "rewardedAdFailedToLoad";
    public static final String EVENT_AD_PRESENTED = "rewardedAdPresented";
    public static final String EVENT_AD_DISMISSED = "rewardedAdDismissed";
    public static final String EVENT_REWARDED = "rewardedAdRewarded";

    RewardedAd mRewardedAd;
    FullScreenContentCallback adCallback;
    String unitId;

    private Promise mPresentAdPromise;

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public RNAdMobRewardedAdModule(ReactApplicationContext reactContext) {
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
                mRewardedAd = null;
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
            public void run() {
                AdRequest.Builder adRequestBuilder = new AdRequest.Builder();
                AdRequest adRequest = adRequestBuilder.build();
                RewardedAd.load(getReactApplicationContext(), unitId, adRequest, new RewardedAdLoadCallback() {
                    @Override
                    public void onAdLoaded(@NonNull RewardedAd rewardedAd) {
                        mRewardedAd = rewardedAd;
                        mRewardedAd.setFullScreenContentCallback(adCallback);
                        promise.resolve(null);
                    }

                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                        mRewardedAd = null;
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
            public void run() {
                mPresentAdPromise = promise;
                Activity activity = getCurrentActivity();
                if (mRewardedAd != null && activity != null) {
                    mRewardedAd.show(activity, new OnUserEarnedRewardListener() {
                        @Override
                        public void onUserEarnedReward(@NonNull RewardItem rewardItem) {
                            WritableMap reward = Arguments.createMap();

                            reward.putInt("amount", rewardItem.getAmount());
                            reward.putString("type", rewardItem.getType());

                            sendEvent(EVENT_REWARDED, reward);
                        }
                    });
                } else {
                    promise.reject("E_AD_NOT_READY", "Ad is not ready.");
                }
            }
        });
    }
}
