package com.rnadmob.admob.ads.banner;

import static com.rnadmob.admob.ads.banner.RNAdMobBannerViewManager.EVENT_AD_CLOSED;
import static com.rnadmob.admob.ads.banner.RNAdMobBannerViewManager.EVENT_AD_FAILED_TO_LOAD;
import static com.rnadmob.admob.ads.banner.RNAdMobBannerViewManager.EVENT_AD_LOADED;
import static com.rnadmob.admob.ads.banner.RNAdMobBannerViewManager.EVENT_AD_OPENED;
import static com.rnadmob.admob.ads.banner.RNAdMobBannerViewManager.EVENT_APP_EVENT;
import static com.rnadmob.admob.ads.banner.RNAdMobBannerViewManager.EVENT_SIZE_CHANGE;

import android.content.Context;
import android.view.ViewGroup;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.admanager.AdManagerAdRequest;
import com.google.android.gms.ads.admanager.AdManagerAdView;
import com.google.android.gms.ads.admanager.AppEventListener;
import com.rnadmob.admob.RNAdMobCommon;

import java.util.Objects;

import javax.annotation.Nonnull;

public class RNAdMobBannerView extends ReactViewGroup implements AppEventListener {

    private AdManagerAdView adView;

    private AdSize size;
    private AdSize[] sizes;
    private String unitId;
    private AdManagerAdRequest request;

    public RNAdMobBannerView(Context context) {
        super(context);

        initAdView();
    }

    private void initAdView() {
        if (adView != null) {
            removeView(adView);
            adView.destroy();
        }
        adView = new AdManagerAdView(getContext());
        adView.setDescendantFocusability(ViewGroup.FOCUS_BLOCK_DESCENDANTS);
        adView.setAdListener(new AdListener() {
            @Override
            public void onAdLoaded() {
                AdSize adSize = Objects.requireNonNull(adView.getAdSize());
                int width = adSize.getWidthInPixels(getContext());
                int height = adSize.getHeightInPixels(getContext());
                int left = adView.getLeft();
                int top = adView.getTop();

                adView.measure(width, height);
                adView.layout(left, top, left + width, top + height);

                WritableMap payload = Arguments.createMap();

                payload.putDouble("width", adSize.getWidth());
                payload.putDouble("height", adSize.getHeight());

                sendEvent(EVENT_SIZE_CHANGE, payload);

                sendEvent(EVENT_AD_LOADED, null);
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
        if (RNAdMobCommon.getIsAdManager(unitId))
            adView.setAppEventListener(this);
        addView(adView);
    }

    public void setUnitId(String unitId) {
        this.unitId = unitId;
        requestAd();
    }

    public void setSize(String size) {
        this.size = RNAdMobCommon.getAdSize(size, this);
        requestAd();
    }

    public void setSizes(ReadableArray adSizeStrings) {
        AdSize[] adSizes = new AdSize[adSizeStrings.size()];

        for (int i = 0; i < adSizeStrings.size(); i++) {
            String adSizeString = adSizeStrings.getString(i);
            adSizes[i] = RNAdMobCommon.stringToAdSize(adSizeString);
        }
        this.sizes = adSizes;
        requestAd();
    }

    public void setRequestOptions(ReadableMap requestOptions) {
        request = RNAdMobCommon.buildAdRequest(requestOptions);
        requestAd();
    }

    public void requestAd() {
        if ((size == null && sizes == null) || unitId == null || request == null) {
            return;
        }

        initAdView();

        adView.setAdUnitId(unitId);
        if (size != null) {
            adView.setAdSizes(size);
        }
        if (sizes != null) {
            if ((RNAdMobCommon.getIsAdManager(unitId))) {
                adView.setAdSizes(sizes);
            } else {
                throw new Error("Trying to set sizes on non Ad Manager unit Id");
            }
        }
        adView.loadAd(request);
    }

    private void sendEvent(String type, WritableMap payload) {
        ((ThemedReactContext) getContext())
                .getJSModule(RCTEventEmitter.class)
                .receiveEvent(getId(), type, payload);
    }

    @Override
    public void onAppEvent(@Nonnull String name, @Nonnull String info) {
        WritableMap event = Arguments.createMap();
        event.putString("name", name);
        event.putString("info", info);
        sendEvent(EVENT_APP_EVENT, event);
    }
}
