package com.rnadmob.admob.ads.fullscreen;

import static com.rnadmob.admob.RNAdMobEventModule.REWARDED;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.ads.AdLoadCallback;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.admanager.AdManagerAdRequest;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;

public class RNAdMobRewardedAdModule extends RNAdMobFullScreenAdModule<RewardedAd> {

    public static final String AD_TYPE = "Rewarded";

    public RNAdMobRewardedAdModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    protected String getAdType() {
        return AD_TYPE;
    }

    @Override
    @ReactMethod
    public void requestAd(int requestId, String unitId, ReadableMap options, final Promise promise) {
        super.requestAd(requestId, unitId, options, promise);
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
    }

    @Override
    protected void load(String unitId, AdManagerAdRequest adRequest, AdLoadCallback<RewardedAd> adLoadCallback, FullScreenContentCallback fullScreenContentCallback) {
        RewardedAd.load(getReactApplicationContext(), unitId, adRequest,
                new RewardedAdLoadCallback() {
                    @Override
                    public void onAdLoaded(@NonNull RewardedAd ad) {
                        ad.setFullScreenContentCallback(fullScreenContentCallback);
                        adLoadCallback.onAdLoaded(ad);
                    }

                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                        adLoadCallback.onAdFailedToLoad(loadAdError);
                    }
                });
    }

    @Override
    protected void show(RewardedAd ad, int requestId) {
        ad.show(currentActivity, rewardItem -> {
            WritableMap reward = Arguments.createMap();
            reward.putInt("amount", rewardItem.getAmount());
            reward.putString("type", rewardItem.getType());
            sendEvent(REWARDED, requestId, reward);
        });
    }
}
