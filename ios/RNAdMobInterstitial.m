#import "RNAdMobInterstitial.h"
#import "RNAdMobUtils.h"

static NSString *const kEventAdPresented = @"interstitialAdPresented";
static NSString *const kEventAdFailedToPresent = @"interstitialAdFailedToPresent";
static NSString *const kEventAdDismissed = @"interstitialAdDismissed";

@implementation RNAdMobInterstitial
{
    GADInterstitialAd  *_interstitial;
    NSString *_adUnitID;
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
        kEventAdDismissed
    ];
}

#pragma mark exported methods

RCT_EXPORT_METHOD(setAdUnitID:(NSString *)adUnitID)
{
    _adUnitID = adUnitID;
}

RCT_EXPORT_METHOD(requestAd:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    if (![self canPresentAd]) {
        GADRequest *request = [GADRequest request];
        [GADInterstitialAd loadWithAdUnitID:_adUnitID
                                    request:request
                          completionHandler:^(GADInterstitialAd *ad, NSError *error) {
            if (error) {
                reject(@"E_AD_LOAD_FAILED", [error localizedDescription], nil);
                return;
            }
            self->_interstitial = ad;
            self->_interstitial.fullScreenContentDelegate = self;
            
            resolve(nil);
        }];
    } else {
        reject(@"E_AD_ALREADY_LOADED", @"Ad is already loaded.", nil);
    }
}

RCT_EXPORT_METHOD(presentAd:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    _presentAdResolve = resolve;
    _presentAdReject = reject;
    if ([self canPresentAd]) {
        [_interstitial presentFromRootViewController:[UIApplication sharedApplication].delegate.window.rootViewController];
    }
    else {
        reject(@"E_AD_NOT_READY", @"Ad is not ready.", nil);
    }
}

- (BOOL) canPresentAd
{
    if (_interstitial)
    {
        return [_interstitial canPresentFromRootViewController:[UIApplication sharedApplication].delegate.window.rootViewController error:nil];
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

- (void)adDidPresentFullScreenContent:(__unused GADInterstitialAd *)ad
{
    if (hasListeners) {
        [self sendEventWithName:kEventAdPresented body:nil];
    }
    _presentAdResolve(nil);
}

- (void)ad:(__unused GADInterstitialAd *)ad didFailToPresentFullScreenContentWithError:(NSError *)error
{
    if (hasListeners){
        NSDictionary *jsError = RCTJSErrorFromCodeMessageAndNSError(@"E_AD_PRESENT_FAILED", error.localizedDescription, error);
        [self sendEventWithName:kEventAdFailedToPresent body:jsError];
    }
    _presentAdReject(@"E_AD_PRESENT_FAILED", [error localizedDescription], nil);
}

- (void)adDidDismissFullScreenContent:(__unused GADInterstitialAd *)ad
{
    if (hasListeners) {
        [self sendEventWithName:kEventAdDismissed body:nil];
    }
}

@end


