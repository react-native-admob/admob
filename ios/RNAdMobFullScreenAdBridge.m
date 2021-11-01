#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNAdMobInterstitialAd, NSObject)

RCT_EXTERN_METHOD(requestAd:(nonnull NSNumber *)requestId unitId:(nonnull NSString *)unitId options:(nonnull NSDictionary *)options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(presentAd:(nonnull NSNumber *)requestId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(destroyAd:(nonnull NSNumber *)requestId)

@end

@interface RCT_EXTERN_MODULE(RNAdMobRewardedAd, NSObject)

RCT_EXTERN_METHOD(requestAd:(nonnull NSNumber *)requestId unitId:(nonnull NSString *)unitId options:(nonnull NSDictionary *)options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(presentAd:(nonnull NSNumber *)requestId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(destroyAd:(nonnull NSNumber *)requestId)

@end

@interface RCT_EXTERN_MODULE(RNAdMobRewardedInterstitialAd, NSObject)

RCT_EXTERN_METHOD(requestAd:(nonnull NSNumber *)requestId unitId:(nonnull NSString *)unitId options:(nonnull NSDictionary *)options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(presentAd:(nonnull NSNumber *)requestId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(destroyAd:(nonnull NSNumber *)requestId)

@end

@interface RCT_EXTERN_MODULE(RNAdMobAppOpenAd, NSObject)

RCT_EXTERN_METHOD(requestAd:(nonnull NSNumber *)requestId unitId:(nonnull NSString *)unitId options:(nonnull NSDictionary *)options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(presentAd:(nonnull NSNumber *)requestId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(destroyAd:(nonnull NSNumber *)requestId)

@end
