#import "RNAdMobEvent.h"
#import "RNAdMobCommon.h"

@interface RNAdMobRewardedInterstitial : NSObject <RCTBridgeModule, GADFullScreenContentDelegate>
@end

static __strong NSMutableDictionary *requestIdMap;
static __strong NSMutableDictionary *adMap;
static __strong NSMutableDictionary *presentAdResolveMap;
static __strong NSMutableDictionary *presentAdRejectMap;

@implementation RNAdMobRewardedInterstitial

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (BOOL) requiresMainQueueSetup
{
    return true;
}

- (id)init {
    self = [super init];
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        requestIdMap = [[NSMutableDictionary alloc] init];
        adMap = [[NSMutableDictionary alloc] init];
        presentAdResolveMap = [[NSMutableDictionary alloc] init];
        presentAdRejectMap = [[NSMutableDictionary alloc] init];
    });
    return self;
}


- (void)dealloc {
    [self invalidate];
}

- (void)invalidate {
    [requestIdMap removeAllObjects];
    [adMap removeAllObjects];
    [presentAdResolveMap removeAllObjects];
    [presentAdRejectMap removeAllObjects];
}

RCT_EXPORT_MODULE();

#pragma mark exported methods

RCT_EXPORT_METHOD(requestAd:(NSNumber *_Nonnull)requestId
                  unitId:(NSString *_Nonnull)unitId
                  requestOptions:(NSDictionary *)requestOptions
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [adMap removeObjectForKey:requestId];

    GAMRequest *request = [RNAdMobCommon buildAdRequest:requestOptions];
    [GADRewardedInterstitialAd loadWithAdUnitID:unitId
                                        request:request
                              completionHandler:^(GADRewardedInterstitialAd *ad, NSError *error) {
        if (error) {
            reject(@"E_AD_LOAD_FAILED", [error localizedDescription], error);
            return;
        }
        
        ad.fullScreenContentDelegate = self;
        
        requestIdMap[ad.responseInfo.responseIdentifier] = requestId;
        adMap[requestId] = ad;
        
        resolve(nil);
    }];
}

RCT_EXPORT_METHOD(presentAd:(NSNumber *_Nonnull)requestId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    GADRewardedInterstitialAd *ad = adMap[requestId];
    if (ad) {
        presentAdResolveMap[requestId] = resolve;
        presentAdRejectMap[requestId] = reject;

        [ad presentFromRootViewController:RCTPresentedViewController()
                 userDidEarnRewardHandler:^ {
            GADAdReward *reward = ad.adReward;
            [self sendEvent:kEventRewarded requestId:requestId data:@{@"type": reward.type, @"amount": reward.amount}];
        }];
    }
    else {
        reject(@"E_AD_NOT_READY", @"Ad is not ready.", nil);
    }
}

- (void)sendEvent:(NSString *)eventName requestId:(NSNumber *)requestId data:(NSDictionary *)data
{
    [RNAdMobEvent sendEvent:eventName type:@"RewardedInterstitial" requestId:requestId data:data];
}

- (void)removeAdMap:(NSNumber *)requestId requestIdMapKey:(NSString *)requestIdMapKey
{
    [requestIdMap removeObjectForKey:requestIdMapKey];
    [adMap removeObjectForKey:requestId];
}

- (void)removePresentPromiseMaps:(NSNumber *)requestId
{
    [presentAdResolveMap removeObjectForKey:requestId];
    [presentAdRejectMap removeObjectForKey:requestId];
}

#pragma mark GADFullScreenContentDelegate

- (void)adDidPresentFullScreenContent:(GADRewardedInterstitialAd *)ad
{
    NSNumber *requestId = requestIdMap[ad.responseInfo.responseIdentifier];
    if (requestId == nil) {
        return;
    }

    [self sendEvent:kEventAdPresented requestId:requestId data:nil];
    
    RCTPromiseResolveBlock resolve = presentAdResolveMap[requestId];
    if (resolve != nil) {
        resolve(nil);
        [self removePresentPromiseMaps:requestId];
    }
}

- (void)ad:(GADRewardedInterstitialAd *)ad didFailToPresentFullScreenContentWithError:(NSError *)error
{
    NSNumber *requestId = requestIdMap[ad.responseInfo.responseIdentifier];
    if (requestId == nil) {
        return;
    }

    NSDictionary *jsError = RCTJSErrorFromCodeMessageAndNSError(@"E_AD_PRESENT_FAILED", error.localizedDescription, error);
    [self sendEvent:kEventAdFailedToPresent requestId:requestId data:jsError];
    
    RCTPromiseRejectBlock reject = presentAdRejectMap[requestId];
    if (reject != nil) {
        reject(@"E_AD_PRESENT_FAILED", [error localizedDescription], error);
        [self removePresentPromiseMaps:requestId];
    }

    [self removeAdMap:requestId requestIdMapKey:ad.responseInfo.responseIdentifier];
}

- (void)adDidDismissFullScreenContent:(GADRewardedInterstitialAd *)ad
{
    NSNumber *requestId = requestIdMap[ad.responseInfo.responseIdentifier];
    if (requestId == nil) {
        return;
    }

    [self sendEvent:kEventAdDismissed requestId:requestId data:nil];
    
    [self removeAdMap:requestId requestIdMapKey:ad.responseInfo.responseIdentifier];
}

@end
