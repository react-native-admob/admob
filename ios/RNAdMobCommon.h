@import GoogleMobileAds;

@interface RNAdMobCommon : NSObject

+ (NSDictionary *)getCodeAndMessageFromAdError:(NSError *)error;

+ (GADAdSize)stringToAdSize:(NSString *)value;

@end
