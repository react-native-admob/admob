package com.rnadmob.admob;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class RNAdMobEventModule extends ReactContextBaseJavaModule {
    public static final String AD_FAILED_TO_PRESENT = "adFailedToPresent";
    public static final String AD_PRESENTED = "adPresented";
    public static final String AD_DISMISSED = "adDismissed";
    public static final String AD_LOADED = "adLoaded";
    public static final String AD_FAILED_TO_LOAD = "adFailedToLoad";
    public static final String REWARDED = "rewarded";

    private static ReactContext mContext;

    @NonNull
    @Override
    public String getName() {
        return "RNAdMobEvent";
    }

    public RNAdMobEventModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    public static void sendEvent(String eventName, String type, int requestId, @Nullable WritableMap data) {
        WritableMap body = Arguments.createMap();
        body.putString("type", type);
        body.putInt("requestId", requestId);
        body.putMap("data", data);
        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, body);
    }
}
