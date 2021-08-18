package com.rnadmob.admob;

import android.util.SparseArray;

public class RNAdMobAdHolder<T> {
    SparseArray<T> adArray = new SparseArray<>();

    public void add(int requestId, T ad) {
        adArray.put(requestId, ad);
    }

    public T get(int requestId) {
        return adArray.get(requestId);
    }

    public void remove(int requestId) {
        adArray.delete(requestId);
    }

    public void clear() {
        adArray.clear();
    }
}
