package com.rnadmob.admob;

import android.util.SparseArray;

import com.facebook.react.bridge.Promise;
import com.google.android.gms.ads.AdError;

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

    public void reject(int requestId, AdError adError) {
        Promise promise = promiseArray.get(requestId);
        if (promise != null) {
            promise.reject(String.valueOf(adError.getCode()), adError.getMessage());
            promiseArray.delete(requestId);
        }
    }

    public void reject(int requestId, String code, String message) {
        Promise promise = promiseArray.get(requestId);
        if (promise != null) {
            promise.reject(code, message);
            promiseArray.delete(requestId);
        }
    }
}
