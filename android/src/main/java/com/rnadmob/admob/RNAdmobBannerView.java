package com.rnadmob.admob;

import static com.rnadmob.admob.RNAdMobBannerViewManager.EVENT_AD_CLOSED;
import static com.rnadmob.admob.RNAdMobBannerViewManager.EVENT_AD_FAILED_TO_LOAD;
import static com.rnadmob.admob.RNAdMobBannerViewManager.EVENT_AD_LOADED;
import static com.rnadmob.admob.RNAdMobBannerViewManager.EVENT_AD_OPENED;
import static com.rnadmob.admob.RNAdMobBannerViewManager.EVENT_SIZE_CHANGE;

import android.content.Context;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.LoadAdError;

import java.util.Objects;

import javax.annotation.Nonnull;

public class RNAdmobBannerView extends ReactViewGroup {

    private AdView adView;

    private AdSize size;
    private String unitId;

    public RNAdmobBannerView(Context context) {
        super(context);

        initAdView();
    }

    private void initAdView() {
        if (adView != null) {
            removeView(adView);
            adView.destroy();
        }
        adView = new AdView(getContext());
        adView.setAdListener(new AdListener() {
            @Override
            public void onAdLoaded() {
                int top;
                int left;
                int width;
                int height;

                if (size == AdSize.FLUID) {
                    top = 0;
                    left = 0;
                    width = getWidth();
                    height = getHeight();
                } else {
                    top = adView.getTop();
                    left = adView.getLeft();
                    width = Objects.requireNonNull(adView.getAdSize())
                            .getWidthInPixels(getContext());
                    height = adView.getAdSize().getHeightInPixels(getContext());
                }

                adView.measure(width, height);
                adView.layout(left, top, left + width, top + height);

                WritableMap payload = Arguments.createMap();

                if (size != AdSize.FLUID) {
                    payload.putInt("width", (int) PixelUtil.toDIPFromPixel(width) + 1);
                    payload.putInt("height", (int) PixelUtil.toDIPFromPixel(height) + 1);
                } else {
                    payload.putInt("width", (int) PixelUtil.toDIPFromPixel(width));
                    payload.putInt("height", (int) PixelUtil.toDIPFromPixel(height));
                }

                sendEvent(EVENT_AD_LOADED, payload);
            }

            @Override
            public void onAdFailedToLoad(@Nonnull LoadAdError adError) {
                WritableMap payload = Arguments.createMap();
                payload.putInt("code", adError.getCode());
                payload.putString("message", adError.getMessage());
                sendEvent(EVENT_AD_FAILED_TO_LOAD, payload);
            }

            @Override
            public void onAdOpened() {
                sendEvent(EVENT_AD_OPENED, null);
            }

            @Override
            public void onAdClosed() {
                sendEvent(EVENT_AD_CLOSED, null);
            }

        });
    }

    public void setUnitId(String unitId) {
        this.unitId = unitId;
        requestAd();
    }

    public void setSize(String size) {
        this.size = RNAdMobCommon.getAdSize(size, this);

        int width;
        int height;
        WritableMap payload = Arguments.createMap();

        if (size.equals("ADAPTIVE_BANNER")) {
            width = (int) PixelUtil.toDIPFromPixel(this.size.getWidthInPixels(getContext()));
            height = (int) PixelUtil.toDIPFromPixel(this.size.getHeightInPixels(getContext()));
        } else {
            width = this.size.getWidth();
            height = this.size.getHeight();
        }

        payload.putDouble("width", width);
        payload.putDouble("height", height);

        if (this.size != AdSize.FLUID) {
            sendEvent(EVENT_SIZE_CHANGE, payload);
        }

        requestAd();
    }

    public void requestAd() {
        if (size == null || unitId == null) {
            return;
        }

        initAdView();
        addView(adView);

        AdRequest request = new AdRequest.Builder().build();

        adView.setAdUnitId(unitId);
        adView.setAdSize(size);
        adView.loadAd(request);
    }

    private void sendEvent(String type, WritableMap payload) {
        ((ThemedReactContext) getContext())
                .getJSModule(RCTEventEmitter.class)
                .receiveEvent(getId(), type, payload);
    }
}
