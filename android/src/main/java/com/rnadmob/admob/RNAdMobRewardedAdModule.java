package com.rnadmob.admob;

import static com.rnadmob.admob.RNAdMobEventModule.AD_DISMISSED;
import static com.rnadmob.admob.RNAdMobEventModule.AD_FAILED_TO_PRESENT;
import static com.rnadmob.admob.RNAdMobEventModule.AD_PRESENTED;
import static com.rnadmob.admob.RNAdMobEventModule.REWARDED;

import android.app.Activity;
import android.util.SparseArray;

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
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;

public class RNAdMobRewardedAdModule extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "RNAdMobRewarded";

    SparseArray<RewardedAd> rewardedAdArray = new SparseArray<>();
    SparseArray<Promise> presentAdPromiseArray = new SparseArray<>();

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public RNAdMobRewardedAdModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private void sendEvent(String eventName, int requestId, @Nullable WritableMap data) {
        RNAdMobEventModule.sendEvent(eventName, "Rewarded", requestId, data);
    }

    private FullScreenContentCallback getFullScreenContentCallback(int requestId) {
        return new FullScreenContentCallback(){
            @Override
            public void onAdDismissedFullScreenContent() {
                sendEvent(AD_DISMISSED, requestId, null);
            }

            @Override
            public void onAdFailedToShowFullScreenContent(@NonNull AdError adError) {
                Promise promise = presentAdPromiseArray.get(requestId);
                if (promise != null) {
                    promise.reject(String.valueOf(adError.getCode()), adError.getMessage());
                }
                WritableMap error = Arguments.createMap();
                error.putInt("code", adError.getCode());
                error.putString("message", adError.getMessage());
                sendEvent(AD_FAILED_TO_PRESENT, requestId, error);
            }

            @Override
            public void onAdShowedFullScreenContent() {
                Promise promise = presentAdPromiseArray.get(requestId);
                if (promise != null) {
                    promise.resolve(null);
                }
                sendEvent(AD_PRESENTED, requestId, null);
                rewardedAdArray.put(requestId, null);
            }
        };
    }

    @ReactMethod
    public void requestAd(int requestId, String unitId, final Promise promise) {
        rewardedAdArray.put(requestId, null);
        Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject("E_NULL_ACTIVITY", "Rewarded ad attempted to load but the current Activity was null.");
            return;
        }
        activity.runOnUiThread(() -> {
            AdRequest.Builder adRequestBuilder = new AdRequest.Builder();
            AdRequest adRequest = adRequestBuilder.build();
            RewardedAd.load(getReactApplicationContext(), unitId, adRequest,
                    new RewardedAdLoadCallback() {
                        @Override
                        public void onAdLoaded(@NonNull RewardedAd rewardedAd) {
                            FullScreenContentCallback callback = getFullScreenContentCallback(requestId);
                            rewardedAd.setFullScreenContentCallback(callback);
                            rewardedAdArray.put(requestId, rewardedAd);
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
        presentAdPromiseArray.put(requestId, promise);
        Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject("E_NULL_ACTIVITY", "Interstitial ad attempted to load but the current Activity was null.");
            return;
        }
        activity.runOnUiThread(() -> {
            RewardedAd rewardedAd = rewardedAdArray.get(requestId);
            if (rewardedAd != null) {
                rewardedAd.show(activity, rewardItem -> {
                    WritableMap reward = Arguments.createMap();

                    reward.putInt("amount", rewardItem.getAmount());
                    reward.putString("type", rewardItem.getType());

                    sendEvent(REWARDED, requestId, reward);
                });
            } else {
                promise.reject("E_AD_NOT_READY", "Ad is not ready.");
            }
        });
    }
}
