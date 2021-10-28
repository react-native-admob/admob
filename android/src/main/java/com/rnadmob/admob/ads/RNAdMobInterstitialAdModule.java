package com.rnadmob.admob.ads;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.google.android.gms.ads.AdLoadCallback;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.admanager.AdManagerAdRequest;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;

public class RNAdMobInterstitialAdModule extends RNAdMobFullScreenAdModule<InterstitialAd> {

  public static final String AD_TYPE = "Interstitial";

  public RNAdMobInterstitialAdModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getAdType() {
    return AD_TYPE;
  }

  @Override
  protected void load(String unitId, AdManagerAdRequest adRequest, AdLoadCallback<InterstitialAd> adLoadCallback, FullScreenContentCallback fullScreenContentCallback) {
    InterstitialAd.load(getReactApplicationContext(), unitId, adRequest,
      new InterstitialAdLoadCallback() {
        @Override
        public void onAdLoaded(@NonNull InterstitialAd ad) {
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
  protected void show(InterstitialAd ad, int requestId) {
    Activity activity = getCurrentActivity();
    if (activity == null) {
      return;
    }
    ad.show(activity);
  }

}
