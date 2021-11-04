#import "RNAdMobCommon.h"

@implementation RNAdMobCommon

+ (NSDictionary *)getCodeAndMessageFromAdError:(NSError *)error {
    NSString *code = @"unknown";
    NSString *message = @"An unknown error occurred.";

    if (error.code == GADErrorInvalidRequest) {
        code = @"invalid-request";
        message = @"The ad request was invalid; for instance, the ad unit ID was incorrect.";
    } else if (error.code == GADErrorNoFill) {
        code = @"no-fill";
        message = @"The ad request was successful, but no ad was returned due to lack of ad inventory.";
    } else if (error.code == GADErrorNetworkError) {
        code = @"network-error";
        message = @"The ad request was unsuccessful due to network connectivity.";
    } else if (error.code == GADErrorInternalError) {
        code = @"internal-error";
        message = @"Something happened internally; for instance, an invalid response was received from the ad server.";
    }

    return @{
            @"code": code,
            @"message": message,
    };
}

+ (GADAdSize)stringToAdSize:(NSString *)value {
    NSError *error = nil;
    NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:@"([0-9]+)x([0-9]+)" options:0 error:&error];
    NSArray *matches = [regex matchesInString:value options:0 range:NSMakeRange(0, [value length])];

    for (NSTextCheckingResult *match in matches) {
        NSString *matchText = [value substringWithRange:[match range]];
        if (matchText) {
            NSArray *values = [matchText componentsSeparatedByString:@"x"];
            CGFloat width = (CGFloat) [values[0] intValue];
            CGFloat height = (CGFloat) [values[1] intValue];
            return GADAdSizeFromCGSize(CGSizeMake(width, height));
        }
    }

    value = [value uppercaseString];

    if ([value isEqualToString:@"BANNER"]) {
        return kGADAdSizeBanner;
    } else if ([value isEqualToString:@"FLUID"]) {
        return kGADAdSizeFluid;
    } else if ([value isEqualToString:@"WIDE_SKYSCRAPER"]) {
        return kGADAdSizeSkyscraper;
    } else if ([value isEqualToString:@"LARGE_BANNER"]) {
        return kGADAdSizeLargeBanner;
    } else if ([value isEqualToString:@"MEDIUM_RECTANGLE"]) {
        return kGADAdSizeMediumRectangle;
    } else if ([value isEqualToString:@"FULL_BANNER"]) {
        return kGADAdSizeFullBanner;
    } else if ([value isEqualToString:@"LEADERBOARD"]) {
        return kGADAdSizeLeaderboard;
    } else if ([value isEqualToString:@"ADAPTIVE_BANNER"]) {
        CGFloat viewWidth = [[UIScreen mainScreen]bounds].size.width;
        return GADCurrentOrientationAnchoredAdaptiveBannerAdSizeWithWidth(viewWidth);
    } else {
        return kGADAdSizeInvalid;
    }
}

+ (NSArray *)stringsToValues:(NSArray *)strings {
    __block NSMutableArray *adSizes = [[NSMutableArray alloc] initWithCapacity:strings.count];
    [strings enumerateObjectsUsingBlock:^(id jsonValue, NSUInteger idx, __unused BOOL *stop) {
        GADAdSize adSize = [RNAdMobCommon stringToAdSize:jsonValue];
        if (GADAdSizeEqualToSize(adSize, kGADAdSizeInvalid)) {
            RCTLogWarn(@"Invalid adSize %@", jsonValue);
        } else {
            [adSizes addObject:NSValueFromGADAdSize(adSize)];
        }
    }];
    return adSizes;
}

+ (GAMRequest *)buildAdRequest:(NSDictionary *)requestOptions {
    GAMRequest *request = [GAMRequest request];
    NSMutableDictionary *extras = [@{} mutableCopy];
    NSMutableDictionary *targets = [@{} mutableCopy];

    if (requestOptions[@"requestNonPersonalizedAdsOnly"] && [requestOptions[@"requestNonPersonalizedAdsOnly"] boolValue]) {
        extras[@"npa"] = @"1";
    }

    if (requestOptions[@"networkExtras"]) {
        for (NSString *key in requestOptions[@"networkExtras"]) {
            NSString *value = requestOptions[@"networkExtras"][key];
            extras[key] = value;
        }
    }

    GADExtras *networkExtras = [[GADExtras alloc] init];
    networkExtras.additionalParameters = extras;
    [request registerAdNetworkExtras:networkExtras];

    if (requestOptions[@"keywords"]) {
        request.keywords = requestOptions[@"keywords"];
    }

    if (requestOptions[@"location"]) {
        NSArray<NSNumber *> *latLong = requestOptions[@"location"];
        [request setLocationWithLatitude:[latLong[0] doubleValue] longitude:[latLong[1] doubleValue] accuracy:[requestOptions[@"locationAccuracy"] doubleValue]];
    }

    if (requestOptions[@"contentUrl"]) {
        request.contentURL = requestOptions[@"contentUrl"];
    }
    
    if (requestOptions[@"targets"]) {
        for (NSString *key in requestOptions[@"targets"]) {
            NSString *value = requestOptions[@"targets"][key];
            targets[key] = value;
        }
    }
    
    request.customTargeting = targets;
    
    return request;
}

@end
