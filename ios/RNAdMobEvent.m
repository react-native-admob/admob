#import "RNAdMobEvent.h"

@implementation RNAdMobEvent
{
    BOOL hasListeners;
}

+ (id)allocWithZone:(NSZone *)zone {
    static RNAdMobEvent *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [super allocWithZone:zone];
    });
    return sharedInstance;
}

+ (void)sendEvent:(NSString *)eventName type:(NSString *)type requestId:(NSNumber*) requestId data:(NSDictionary *)data {
    if (data) {
        [[RNAdMobEvent allocWithZone: nil] sendEventWithName:eventName body:@{
            @"type": type,
            @"requestId": requestId,
            @"data": data
        }];
    } else {
        [[RNAdMobEvent allocWithZone: nil] sendEventWithName:eventName body:@{
            @"type": type,
            @"requestId": requestId
        }];
    }
    
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
    return @[
        kEventAdPresented,
        kEventAdFailedToPresent,
        kEventAdDismissed,
        kEventRewarded,
        kEventAdLoaded,
        kEventAdFailedToLoad
    ];
}

- (void)startObserving
{
    hasListeners = YES;
}

- (void)stopObserving
{
    hasListeners = NO;
}

@end
