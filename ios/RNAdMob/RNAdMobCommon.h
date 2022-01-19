#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
#import <React/RCTUtils.h>

@import GoogleMobileAds;

@interface RNAdMobCommon : NSObject

+ (GADAdSize)stringToAdSize:(NSString *)value;

+ (NSArray *)stringsToValues:(NSArray *)values;

+ (GAMRequest *)buildAdRequest:(NSDictionary *)requestOptions;

+ (GADServerSideVerificationOptions *)buildServerSideVerificationOptions:(NSDictionary *)requestOptions;

@end
