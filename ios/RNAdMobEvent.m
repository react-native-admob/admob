#import "RNAdMobEvent.h"

@implementation RNAdMobEvent

+ (id)allocWithZone:(NSZone *)zone {
    static RNAdMobEvent *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [super allocWithZone:zone];
    });
    return sharedInstance;
}

+ (void)sendEvent:(NSString *)eventName type:(NSString *)type requestId:(NSNumber*) requestId data:(NSDictionary *)data {
    RNAdMobEvent* eventModule = [RNAdMobEvent allocWithZone: nil];
    if (!eventModule.hasListeners) {
        return;
    }
    if (data) {
        [eventModule sendEventWithName:eventName body:@{
            @"type": type,
            @"requestId": requestId,
            @"data": data
        }];
    } else {
        [eventModule sendEventWithName:eventName body:@{
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
    _hasListeners = YES;
}

- (void)stopObserving
{
    _hasListeners = NO;
}

@end
