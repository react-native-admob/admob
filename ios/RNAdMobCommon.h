@import React;

@import GoogleMobileAds;

@interface RNAdMobCommon : NSObject

+ (NSDictionary *)getCodeAndMessageFromAdError:(NSError *)error;

+ (GADAdSize)stringToAdSize:(NSString *)value;

+ (NSArray *)stringsToValues:(NSArray *)values;

+ (GADRequest *)buildAdRequest:(NSDictionary *)requestOptions;

@end
