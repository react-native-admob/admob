package com.rnadmob.admob;

import android.app.Activity;
import android.app.Application;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public abstract class ActivityAwareJavaModule extends ReactContextBaseJavaModule implements Application.ActivityLifecycleCallbacks, LifecycleEventListener {

    @Nullable
    private Application application;

    @Nullable
    protected Activity currentActivity;

    public ActivityAwareJavaModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addLifecycleEventListener(this);
    }

    @Override
    public void onActivityCreated(Activity activity, Bundle savedInstanceState) {}

    @Override
    public void onActivityStarted(@NonNull Activity activity) {
        currentActivity = activity;
    }

    @Override
    public void onActivityResumed(@NonNull Activity activity) {
        currentActivity = activity;
    }

    @Override
    public void onActivityStopped(Activity activity) {}

    @Override
    public void onActivityPaused(Activity activity) {}

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle bundle) {}

    @Override
    public void onActivityDestroyed(@NonNull Activity activity) {
        if (activity.equals(currentActivity)) {
            currentActivity = null;
        }
    }

    @Override
    public void onHostResume() {
        if (application == null) {
            currentActivity = getCurrentActivity();
            if (currentActivity != null) {
                application = currentActivity.getApplication();
                application.registerActivityLifecycleCallbacks(this);
            }
        }
    }

    @Override
    public void onHostPause() {}

    @Override
    public void onHostDestroy() {
        if (application != null) {
            application.unregisterActivityLifecycleCallbacks(this);
            application = null;
        }
    }
}
