package com.rnadmob.admob;

import android.location.Location;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.Display;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.views.view.ReactViewGroup;
import com.google.ads.mediation.admob.AdMobAdapter;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.admanager.AdManagerAdRequest;
import com.google.android.gms.ads.rewarded.ServerSideVerificationOptions;

import java.util.ArrayList;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RNAdMobCommon {
    static public AdSize getAdSizeForAdaptiveBanner(ReactViewGroup reactViewGroup) {
        try {
            Display display = Objects.requireNonNull(((ReactContext) reactViewGroup.getContext()).getCurrentActivity()).getWindowManager().getDefaultDisplay();

            DisplayMetrics outMetrics = new DisplayMetrics();
            display.getMetrics(outMetrics);
            int adWidth = (int) (outMetrics.widthPixels / outMetrics.density);

            return AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(reactViewGroup.getContext(), adWidth);
        } catch (Exception e) {
            return AdSize.BANNER;
        }
    }

    static public AdSize stringToAdSize(String value) {
        Pattern pattern = Pattern.compile("([0-9]+)x([0-9]+)");
        Matcher matcher = pattern.matcher(value);

        // If size is "valXval"
        if (matcher.find()) {
            int width = Integer.parseInt(matcher.group(1));
            int height = Integer.parseInt(matcher.group(2));
            return new AdSize(width, height);
        }

        switch (value.toUpperCase()) {
            case "BANNER":
                return AdSize.BANNER;
            case "FLUID":
                return AdSize.FLUID;
            case "WIDE_SKYSCRAPER":
                return AdSize.WIDE_SKYSCRAPER;
            case "LARGE_BANNER":
                return AdSize.LARGE_BANNER;
            case "MEDIUM_RECTANGLE":
                return AdSize.MEDIUM_RECTANGLE;
            case "FULL_BANNER":
                return AdSize.FULL_BANNER;
            case "LEADERBOARD":
                return AdSize.LEADERBOARD;
            default:
                return AdSize.INVALID;
        }
    }

    static public AdSize getAdSize(String preDefinedAdSize, ReactViewGroup reactViewGroup) {
        if ("ADAPTIVE_BANNER".equals(preDefinedAdSize)) {
            return RNAdMobCommon.getAdSizeForAdaptiveBanner(reactViewGroup);
        } else {
            return RNAdMobCommon.stringToAdSize(preDefinedAdSize);
        }
    }

    static public boolean getIsAdManager(String unitId) {
        if (unitId == null) return false;
        return unitId.startsWith("/");
    }

    static public AdManagerAdRequest buildAdRequest(ReadableMap requestOptions) {
        AdManagerAdRequest.Builder builder = new AdManagerAdRequest.Builder();
        Bundle extras = new Bundle();

        if (requestOptions.hasKey("requestNonPersonalizedAdsOnly") && requestOptions.getBoolean("requestNonPersonalizedAdsOnly")) {
            extras.putString("npa", "1");
        }

        if (requestOptions.hasKey("networkExtras")) {
            Map<String, Object> networkExtras = Objects.requireNonNull(requestOptions.getMap("networkExtras")).toHashMap();

            for (Map.Entry<String, Object> entry : networkExtras.entrySet()) {
                String key = entry.getKey();
                String value = (String) entry.getValue();
                extras.putString(key, value);
            }
        }

        builder.addNetworkExtrasBundle(AdMobAdapter.class, extras);

        if (requestOptions.hasKey("keywords")) {
            ArrayList<Object> keywords = Objects.requireNonNull(requestOptions.getArray("keywords"))
                    .toArrayList();

            for (Object keyword : keywords) {
                builder.addKeyword((String) keyword);
            }
        }

        if (requestOptions.hasKey("contentUrl")) {
            builder.setContentUrl(Objects.requireNonNull(requestOptions.getString("contentUrl")));
        }

        if (requestOptions.hasKey("location")) {
            ReadableArray locationArray = requestOptions.getArray("location");
            Location location = new Location("");
            location.setLatitude(Objects.requireNonNull(locationArray).getDouble(0));
            location.setLongitude(Objects.requireNonNull(locationArray).getDouble(1));

            builder.setLocation(location);
        }

        if (requestOptions.hasKey("targets")) {
            Map<String, Object> networkExtras = Objects.requireNonNull(requestOptions.getMap("targets")).toHashMap();

            for (Map.Entry<String, Object> entry : networkExtras.entrySet()) {
                String key = entry.getKey();
                String value = (String) entry.getValue();
                builder.addCustomTargeting(key, value);
            }
        }

        return builder.build();
    }

    public static ServerSideVerificationOptions buildServerSideVerificationOptions(ReadableMap requestOptions) {
        if (requestOptions.hasKey("serverSideVerificationOptions")) {
            ReadableMap serverSideVerificationOptions =
                    requestOptions.getMap("serverSideVerificationOptions");

            if (serverSideVerificationOptions != null) {
                ServerSideVerificationOptions.Builder options =
                        new ServerSideVerificationOptions.Builder();

                if (serverSideVerificationOptions.hasKey("userId")) {
                    options.setUserId(Objects.requireNonNull(serverSideVerificationOptions.getString("userId")));
                }

                if (serverSideVerificationOptions.hasKey("customData")) {
                    options.setCustomData(
                            Objects.requireNonNull(serverSideVerificationOptions.getString("customData")));
                }
                return options.build();
            }
        }
        return null;
    }
}
