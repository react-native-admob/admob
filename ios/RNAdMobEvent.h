@import React;

static NSString * _Nonnull const kEventAdLoaded = @"adLoaded";
static NSString * _Nonnull const kEventAdFailedToLoad = @"adFailedToLoad";
static NSString * _Nonnull const kEventAdPresented = @"adPresented";
static NSString * _Nonnull const kEventAdFailedToPresent = @"adFailedToPresent";
static NSString * _Nonnull const kEventAdDismissed = @"adDismissed";
static NSString * _Nonnull const kEventRewarded = @"rewarded";

@interface RNAdMobEvent : RCTEventEmitter <RCTBridgeModule>

+ (void)sendEvent:(NSString *_Nonnull)eventName type:(NSString *_Nonnull)type requestId:(NSNumber*_Nonnull) requestId data:(NSDictionary *_Nullable)data;

@end
