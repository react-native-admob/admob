package com.rnadmob.admob;

import static com.rnadmob.admob.RNAdMobEventModule.AD_FAILED_TO_PRESENT;

import android.util.SparseArray;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.ads.AdError;

import java.util.Locale;

public class RNAdMobPromiseHolder {
    SparseArray<Promise> promiseArray = new SparseArray<>();

    public void add(int requestId, Promise promise) {
        promiseArray.put(requestId, promise);
    }

    public void clear() {
        promiseArray.clear();
    }

    public void resolve(int requestId) {
        Promise promise = promiseArray.get(requestId);
        if (promise != null) {
            promise.resolve(null);
            promiseArray.delete(requestId);
        }
    }

    public void reject(int requestId, WritableMap error) {
        Promise promise = promiseArray.get(requestId);
        if (promise != null) {
            promise.reject(AD_FAILED_TO_PRESENT, "Error occurred while presenting ad.", error);
            promiseArray.delete(requestId);
        }
    }
}
