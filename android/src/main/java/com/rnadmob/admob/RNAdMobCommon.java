package com.rnadmob.admob;

import android.util.DisplayMetrics;
import android.view.Display;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.views.view.ReactViewGroup;
import com.google.android.gms.ads.AdSize;

import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RNAdMobCommon {
    static AdSize getAdSizeForAdaptiveBanner(ReactViewGroup reactViewGroup) {
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

    static AdSize stringToAdSize(String value) {
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

    static AdSize getAdSize(String preDefinedAdSize, ReactViewGroup reactViewGroup) {
        if ("ADAPTIVE_BANNER".equals(preDefinedAdSize)) {
            return RNAdMobCommon.getAdSizeForAdaptiveBanner(reactViewGroup);
        } else {
            return RNAdMobCommon.stringToAdSize(preDefinedAdSize);
        }
    }
}
