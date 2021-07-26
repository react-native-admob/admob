#import "RNAdMobUtils.h"

NSArray *__nullable RNAdMobProcessTestDevices(NSArray *__nullable testDevices, id _Nonnull simulatorId)
{
    if (testDevices == NULL) {
        return testDevices;
    }
    NSInteger index = [testDevices indexOfObject:@"SIMULATOR"];
    if (index == NSNotFound) {
        return testDevices;
    }
    NSMutableArray *values = [testDevices mutableCopy];
    [values removeObjectAtIndex:index];
    [values addObject:simulatorId];
    return values;
}

GADAdSize RNAdmobStringToAdSize(NSString *_Nonnull value)
{
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
    
    if ([value isEqualToString:@"banner"]) {
        return kGADAdSizeBanner;
    } else if ([value isEqualToString:@"largeBanner"]) {
        return kGADAdSizeLargeBanner;
    } else if ([value isEqualToString:@"mediumRectangle"]) {
        return kGADAdSizeMediumRectangle;
    } else if ([value isEqualToString:@"fullBanner"]) {
        return kGADAdSizeFullBanner;
    } else if ([value isEqualToString:@"leaderboard"]) {
        return kGADAdSizeLeaderboard;
    } else if ([value isEqualToString:@"adaptiveBanner"]) {
        UIView *view = [UIApplication sharedApplication].delegate.window.rootViewController.view;
        CGRect frame = view.frame;
        if (@available(iOS 11.0, *)) {
            frame = UIEdgeInsetsInsetRect(view.frame, view.safeAreaInsets);
        }
        return GADCurrentOrientationAnchoredAdaptiveBannerAdSizeWithWidth(frame.size.width);
    } else {
        return kGADAdSizeBanner;
    }
}
