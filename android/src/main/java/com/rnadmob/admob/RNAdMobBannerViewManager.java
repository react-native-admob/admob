package com.rnadmob.admob;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nonnull;

public class RNAdMobBannerViewManager extends SimpleViewManager<RNAdmobBannerView> {
    public static final String REACT_CLASS = "RNAdMobBannerView";
    public static final String EVENT_AD_LOADED = "onAdLoaded";
    public static final String EVENT_AD_FAILED_TO_LOAD = "onAdFailedToLoad";
    public static final String EVENT_AD_OPENED = "onAdOpened";
    public static final String EVENT_AD_CLOSED = "onAdClosed";
    public static final String EVENT_SIZE_CHANGE = "onSizeChange";
    public static final String EVENT_APP_EVENT = "onAppEvent";

    private static final int COMMAND_REQUEST_AD = 1;

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Nonnull
    @Override
    public RNAdmobBannerView createViewInstance(@Nonnull ThemedReactContext themedReactContext) {
        return new RNAdmobBannerView(themedReactContext);
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
    public void setUnitId(RNAdmobBannerView view, String unitId) {
        view.setUnitId(unitId);
    }

    @ReactProp(name = "size")
    public void setSize(RNAdmobBannerView view, String size) {
        view.setSize(size);
    }

    @ReactProp(name = "sizes")
    public void setSizes(RNAdmobBannerView view, ReadableArray adSizeStrings) {
        view.setSizes(adSizeStrings);
    }

    @ReactProp(name = "requestOptions")
    public void setRequestOptions(RNAdmobBannerView view, ReadableMap requestOptions) {
        view.setRequestOptions(requestOptions);
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of("requestAd", COMMAND_REQUEST_AD);
    }


    @Override
    public void receiveCommand(@Nonnull RNAdmobBannerView bannerView, int commandId, @Nullable ReadableArray args) {
        if (COMMAND_REQUEST_AD == commandId) {
            bannerView.requestAd();
        }
    }
}