@import React;
@import GoogleMobileAds;

@interface RNAdMobAppOpen : NSObject <RCTBridgeModule, GADFullScreenContentDelegate>

@property (strong, nonatomic) GADAppOpenAd *appOpenAd;
@property (weak, nonatomic) NSDate *loadTime;
@property (nonatomic, copy) RCTPromiseResolveBlock presentResolve;
@property (nonatomic, copy) RCTPromiseRejectBlock presentReject;

@end
