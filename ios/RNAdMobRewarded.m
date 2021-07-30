#import "RNAdMobRewarded.h"
#import "RNAdMobUtils.h"

static NSString *const kEventAdPresented = @"rewardedAdPresented";
static NSString *const kEventAdFailedToPresent = @"rewardedAdFailedToPresent";
static NSString *const kEventAdDismissed = @"rewardedAdDismissed";
static NSString *const kEventAdRewarded = @"rewardedAdRewarded";

@implementation RNAdMobRewarded
{
    GADRewardedAd *_rewardedAd;
    NSString *_unitId;
    RCTPromiseResolveBlock _presentAdResolve;
    RCTPromiseRejectBlock _presentAdReject;
    BOOL hasListeners;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
    return @[
        kEventAdPresented,
        kEventAdFailedToPresent,
        kEventAdDismissed,
        kEventAdRewarded
    ];
}

#pragma mark exported methods

RCT_EXPORT_METHOD(setUnitId:(NSString *)unitId)
{
    _unitId = unitId;
}

RCT_EXPORT_METHOD(requestAd:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    GADRequest *request = [GADRequest request];
    [GADRewardedAd loadWithAdUnitID:_unitId
                            request:request
                  completionHandler:^(GADRewardedAd *ad, NSError *error) {
        if (error) {
            reject(@"E_AD_LOAD_FAILED", [error localizedDescription], nil);
            return;
        }
        self->_rewardedAd = ad;
        self->_rewardedAd.fullScreenContentDelegate = self;
        
        resolve(nil);
    }];
}

RCT_EXPORT_METHOD(presentAd:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    _presentAdResolve = resolve;
    _presentAdReject = reject;
    if ([self canPresentAd]) {
        UIWindow *keyWindow = [[UIApplication sharedApplication] keyWindow];
        UIViewController *rootViewController = [keyWindow rootViewController];
        
        [_rewardedAd presentFromRootViewController:rootViewController
                          userDidEarnRewardHandler:^ {
            GADAdReward *reward = self->_rewardedAd.adReward;
            if (self->hasListeners) {
                [self sendEventWithName:kEventAdRewarded body:@{@"type": reward.type, @"amount": reward.amount}];
            }
        }];
    }
    else {
        reject(@"E_AD_NOT_READY", @"Ad is not ready.", nil);
    }
}

- (BOOL) canPresentAd
{
    if (_rewardedAd)
    {
        UIWindow *keyWindow = [[UIApplication sharedApplication] keyWindow];
        UIViewController *rootViewController = [keyWindow rootViewController];
        
        return [_rewardedAd canPresentFromRootViewController:rootViewController error:nil];
    }
    else {
        return NO;
    }
}

- (void)startObserving
{
    hasListeners = YES;
}

- (void)stopObserving
{
    hasListeners = NO;
}

#pragma mark GADFullScreenContentDelegate

- (void)adDidPresentFullScreenContent:(__unused GADRewardedAd *)ad
{
    if (hasListeners) {
        [self sendEventWithName:kEventAdPresented body:nil];
    }
    _presentAdResolve(nil);
}

- (void)ad:(__unused GADRewardedAd *)ad didFailToPresentFullScreenContentWithError:(NSError *)error
{
    if (hasListeners){
        NSDictionary *jsError = RCTJSErrorFromCodeMessageAndNSError(@"E_AD_PRESENT_FAILED", error.localizedDescription, error);
        [self sendEventWithName:kEventAdFailedToPresent body:jsError];
    }
    _presentAdReject(@"E_AD_PRESENT_FAILED", [error localizedDescription], nil);
}

- (void)adDidDismissFullScreenContent:(__unused GADRewardedAd *)ad
{
    if (hasListeners) {
        [self sendEventWithName:kEventAdDismissed body:nil];
    }
}

@end
