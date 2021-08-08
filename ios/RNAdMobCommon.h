@import React;

@import GoogleMobileAds;

@interface RNAdMobCommon : NSObject

+ (NSDictionary *)getCodeAndMessageFromAdError:(NSError *)error;

+ (GADAdSize)stringToAdSize:(NSString *)value;

+ (NSArray *)stringsToValues:(NSArray *)values;

@end
