package com.rnadmob.admob;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.RequestConfiguration;
import com.google.android.gms.ads.initialization.AdapterStatus;
import com.google.android.gms.ads.initialization.InitializationStatus;

import java.util.ArrayList;
import java.util.Map;
import java.util.Objects;

public class RNAdMobModule extends ReactContextBaseJavaModule {

    public RNAdMobModule(ReactApplicationContext context) {
        super(context);
        MobileAds.initialize(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "RNAdMob";
    }

    @ReactMethod
    public void getInitializationStatus(Promise promise) {
        InitializationStatus status = MobileAds.getInitializationStatus();

        if (status == null) {
            promise.reject("E_MOBILE_ADS_NOT_INITIALIZED", "MobileAds SDK is not initialized yet.");
            return;
        }

        WritableArray array = Arguments.createArray();
        for (Map.Entry<String, AdapterStatus> entry : status.getAdapterStatusMap().entrySet()) {
            AdapterStatus adapterStatus = entry.getValue();

            WritableMap info = Arguments.createMap();
            info.putString("name", entry.getKey());
            info.putBoolean("state", adapterStatus.getInitializationState().equals(AdapterStatus.State.READY));
            info.putString("description", adapterStatus.getDescription());
            array.pushMap(info);
        }
        promise.resolve(array);
    }

    @ReactMethod
    public void setRequestConfiguration(ReadableMap config) {
        RequestConfiguration.Builder configuration = new RequestConfiguration.Builder();

        if (config.hasKey("maxAdContentRating")) {
            String maxAdContentRating = config.getString("maxAdContentRating");
            if (maxAdContentRating != null) {
                configuration.setMaxAdContentRating(maxAdContentRating);
            }
        }

        if (config.hasKey("tagForChildDirectedTreatment")) {
            boolean tagForChildDirectedTreatment = config.getBoolean("tagForChildDirectedTreatment");
            configuration.setTagForChildDirectedTreatment(tagForChildDirectedTreatment ? 1 : 0);
        }
        if (config.hasKey("tagForUnderAgeOfConsent")) {
            boolean tagForUnderAgeOfConsent = config.getBoolean("tagForUnderAgeOfConsent");
            configuration.setTagForUnderAgeOfConsent(tagForUnderAgeOfConsent ? 1 : 0);
        }
        if (config.hasKey("testDeviceIds")) {
            ArrayList<String> devices = new ArrayList<>();
            ArrayList<Object> propDevices = Objects.requireNonNull(config.getArray("testDeviceIds"))
                    .toArrayList();
            for (Object device : propDevices) {
                String id = (String) device;
                devices.add(id);
            }
            devices.add(AdRequest.DEVICE_ID_EMULATOR);
            configuration.setTestDeviceIds(devices);
        }

        MobileAds.setRequestConfiguration(configuration.build());
    }

    @ReactMethod
    public void isTestDevice(Promise promise) {
        AdRequest builder = new AdRequest.Builder().build();
        promise.resolve(builder.isTestDevice(getReactApplicationContext()));
    }
}
