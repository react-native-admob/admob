package com.rnadmob.admob.ads;

import static com.rnadmob.admob.RNAdMobEventModule.REWARDED;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.ads.AdLoadCallback;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.admanager.AdManagerAdRequest;
import com.google.android.gms.ads.rewardedinterstitial.RewardedInterstitialAd;
import com.google.android.gms.ads.rewardedinterstitial.RewardedInterstitialAdLoadCallback;

public class RNAdMobRewardedInterstitialAdModule extends RNAdMobFullScreenAdModule<RewardedInterstitialAd> {

    public static final String AD_TYPE = "RewardedInterstitial";

    public RNAdMobRewardedInterstitialAdModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getAdType() {
        return AD_TYPE;
    }

    @Override
    protected void load(String unitId, AdManagerAdRequest adRequest, AdLoadCallback<RewardedInterstitialAd> adLoadCallback, FullScreenContentCallback fullScreenContentCallback) {
        RewardedInterstitialAd.load(getReactApplicationContext(), unitId, adRequest,
                new RewardedInterstitialAdLoadCallback() {
                    @Override
                    public void onAdLoaded(@NonNull RewardedInterstitialAd ad) {
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
    protected void show(RewardedInterstitialAd ad, int requestId) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            return;
        }
        ad.show(activity, rewardItem -> {
            WritableMap reward = Arguments.createMap();
            reward.putInt("amount", rewardItem.getAmount());
            reward.putString("type", rewardItem.getType());
            sendEvent(REWARDED, requestId, reward);
        });
    }
}
