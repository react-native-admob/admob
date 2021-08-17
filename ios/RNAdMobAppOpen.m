#import "RNAdMobCommon.h"
#import "RNAdMobEvent.h"

@interface RNAdMobAppOpen : NSObject <RCTBridgeModule, GADFullScreenContentDelegate>

@property (strong, nonatomic) GADAppOpenAd *appOpenAd;
@property (weak, nonatomic) NSDate *loadTime;
@property (nonatomic, copy) RCTPromiseResolveBlock presentResolve;
@property (nonatomic, copy) RCTPromiseRejectBlock presentReject;

@end

@implementation RNAdMobAppOpen

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(requestAd:(NSNumber *_Nonnull)requestId
                  unitId: (NSString *_Nonnull)unitId
                  requestOptions: (NSDictionary *) requestOptions
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    _appOpenAd = nil;
    [GADAppOpenAd loadWithAdUnitID:unitId
                           request:[RNAdMobCommon buildAdRequest:requestOptions]
                       orientation:UIInterfaceOrientationPortrait
                 completionHandler:^(GADAppOpenAd *_Nullable ad, NSError *_Nullable error) {
        if (error) {
            NSDictionary *jsError = RCTJSErrorFromCodeMessageAndNSError(@"E_AD_LOAD_FAILED", error.localizedDescription, error);
            [self sendEvent:kEventAdFailedToLoad data:jsError];
            reject(@"E_AD_LOAD_FAILED", [error localizedDescription], error);
            return;
        }
        ad.fullScreenContentDelegate = self;
        
        self.appOpenAd = ad;
        self.loadTime = [NSDate date];
        
        [self sendEvent:kEventAdLoaded data:nil];
        resolve(nil);
    }];
}

RCT_EXPORT_METHOD(presentAd:(NSNumber *_Nonnull)requestId
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    _presentResolve = resolve;
    _presentReject = reject;
    if (_appOpenAd && [self wasLoadTimeLessThanNHoursAgo:4]) {
        [_appOpenAd presentFromRootViewController:[RNAdMobCommon topMostController]];
    } else {
        reject(@"E_AD_NOT_READY", @"Ad is not ready.", nil);
    }
}

- (BOOL)wasLoadTimeLessThanNHoursAgo:(int)n {
  NSDate *now = [NSDate date];
  NSTimeInterval timeIntervalBetweenNowAndLoadTime = [now timeIntervalSinceDate:self.loadTime];
  double secondsPerHour = 3600.0;
  double intervalInHours = timeIntervalBetweenNowAndLoadTime / secondsPerHour;
  return intervalInHours < n;
}

- (void)sendEvent:(NSString *)eventName data:(NSDictionary *)data
{
    [RNAdMobEvent sendEvent:eventName type:@"AppOpen" requestId:@0 data:data];
}

#pragma mark GADFullScreenContentDelegate

- (void)adDidPresentFullScreenContent:(GADAppOpenAd *)ad
{
    [self sendEvent:kEventAdPresented data:nil];
    
    _presentResolve(nil);
}

- (void)ad:(GADAppOpenAd *)ad didFailToPresentFullScreenContentWithError:(NSError *)error
{
    NSDictionary *jsError = RCTJSErrorFromCodeMessageAndNSError(@"E_AD_PRESENT_FAILED", error.localizedDescription, error);
    [self sendEvent:kEventAdFailedToPresent data:jsError];
    
    _presentReject(@"E_AD_PRESENT_FAILED", [error localizedDescription], error);
}

- (void)adDidDismissFullScreenContent:(GADAppOpenAd *)ad
{
    [self sendEvent:kEventAdDismissed data:nil];
}

@end
