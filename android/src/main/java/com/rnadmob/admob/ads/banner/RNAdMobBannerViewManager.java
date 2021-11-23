package com.rnadmob.admob.ads.banner;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nonnull;

public class RNAdMobBannerViewManager extends SimpleViewManager<RNAdMobBannerView> {
    public static final String REACT_CLASS = "RNAdMobBannerView";
    public static final String EVENT_AD_LOADED = "onAdLoaded";
    public static final String EVENT_AD_FAILED_TO_LOAD = "onAdFailedToLoad";
    public static final String EVENT_AD_OPENED = "onAdOpened";
    public static final String EVENT_AD_CLOSED = "onAdClosed";
    public static final String EVENT_SIZE_CHANGE = "onSizeChange";
    public static final String EVENT_APP_EVENT = "onAppEvent";

    private static final String COMMAND_REQUEST_AD = "requestAd";

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Nonnull
    @Override
    public RNAdMobBannerView createViewInstance(@Nonnull ThemedReactContext themedReactContext) {
        return new RNAdMobBannerView(themedReactContext);
    }

    @Override
    @Nullable
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
        String[] events = {
                EVENT_SIZE_CHANGE,
                EVENT_AD_LOADED,
                EVENT_AD_FAILED_TO_LOAD,
                EVENT_AD_OPENED,
                EVENT_AD_CLOSED
        };
        for (String event : events) {
            builder.put(event, MapBuilder.of("registrationName", event));
        }
        return builder.build();
    }

    @ReactProp(name = "unitId")
    public void setUnitId(RNAdMobBannerView view, String unitId) {
        view.setUnitId(unitId);
    }

    @ReactProp(name = "size")
    public void setSize(RNAdMobBannerView view, String size) {
        view.setSize(size);
    }

    @ReactProp(name = "sizes")
    public void setSizes(RNAdMobBannerView view, ReadableArray adSizeStrings) {
        view.setSizes(adSizeStrings);
    }

    @ReactProp(name = "requestOptions")
    public void setRequestOptions(RNAdMobBannerView view, ReadableMap requestOptions) {
        view.setRequestOptions(requestOptions);
    }

    @Override
    public void receiveCommand(@Nonnull RNAdMobBannerView bannerView, String commandId, @Nullable ReadableArray args) {
        if (commandId.equals(COMMAND_REQUEST_AD)) {
            bannerView.requestAd();
        }
    }
}
