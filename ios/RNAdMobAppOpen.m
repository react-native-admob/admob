#import "RNAdMobCommon.h"
#import "RNAdMobEvent.h"

@interface RNAdMobAppOpen : NSObject <RCTBridgeModule, GADFullScreenContentDelegate>

@property (strong, nonatomic) GADAppOpenAd *appOpenAd;
@property (weak, nonatomic) NSString *unitId;
@property (weak, nonatomic) NSDictionary *requestOptions;
@property (nonatomic) BOOL showOnAppForeground;
@property (nonatomic) BOOL showOnColdStart;
@property (nonatomic) BOOL appStarted;
@property (weak, nonatomic) NSDate *loadTime;
@property (weak, nonatomic) RCTPromiseResolveBlock presentResolve;
@property (weak, nonatomic) RCTPromiseRejectBlock presentReject;

@end

@implementation RNAdMobAppOpen

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
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(onMoveToForeground)
                                                     name:UIApplicationDidBecomeActiveNotification object:nil];
    });
    return self;
}


- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIApplicationDidBecomeActiveNotification
                                                  object:nil];
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(setUnitId:(NSString *_Nonnull)unitId) {
    _unitId = unitId;
    NSLog(@"hihi1");
    [self requestAd:nil resolver:nil rejecter:nil];
}

RCT_EXPORT_METHOD(setOptions:(NSDictionary *_Nonnull)options) {
    _requestOptions = [options valueForKey:@"requestOptions"];
    _showOnColdStart = [options valueForKey:@"showOnColdStart"];
    _showOnAppForeground = [options valueForKey:@"showOnAppForeground"];
    NSLog(@"hihi2");
    [self requestAd:nil resolver:nil rejecter:nil];
}

RCT_EXPORT_METHOD(requestAd:(NSNumber *_Nonnull)requestId
                  unitId: (NSString *_Nonnull)unitId
                  requestOptions: (NSDictionary *) requestOptions
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    NSLog(@"hihi3");
    [self requestAd:requestOptions resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(presentAd:(NSNumber *_Nonnull)requestId
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    _presentResolve = resolve;
    _presentReject = reject;
    [self showAdIfAvailable];
}

- (void)requestAd:(NSDictionary *) requestOptions
         resolver:(RCTPromiseResolveBlock)resolve
         rejecter:(RCTPromiseRejectBlock)reject
{
    if (_unitId == nil || _requestOptions == nil) return;
    NSLog(@"hihi");
    _appOpenAd = nil;
    requestOptions = requestOptions ? requestOptions : _requestOptions;
    [GADAppOpenAd loadWithAdUnitID:_unitId
                           request:[RNAdMobCommon buildAdRequest:requestOptions]
                       orientation:UIInterfaceOrientationPortrait
                 completionHandler:^(GADAppOpenAd *_Nullable ad, NSError *_Nullable error) {
        if (error) {
            NSDictionary *jsError = RCTJSErrorFromCodeMessageAndNSError(@"E_AD_LOAD_FAILED", error.localizedDescription, error);
            [self sendEvent:kEventAdFailedToLoad data:jsError];
            if (reject) {
                reject(@"E_AD_LOAD_FAILED", [error localizedDescription], error);
            }
            
            if (!self.appStarted) {
                self.appStarted = YES;
            }
            return;
        }
        ad.fullScreenContentDelegate = self;
        
        self.appOpenAd = ad;
        self.loadTime = [NSDate date];
        
        [self sendEvent:kEventAdLoaded data:nil];
        if (resolve) {
            resolve(nil);
        }
        
        if (!self.appStarted) {
            self.appStarted = YES;
            if (self.showOnColdStart) {
                [self showAdIfAvailable];
            }
        }
    }];
}

- (void)showAdIfAvailable
{
    if (_appOpenAd && [self wasLoadTimeLessThanNHoursAgo:4]) {
        [_appOpenAd presentFromRootViewController:RCTPresentedViewController()];
    } else {        [self requestAd:nil resolver:nil rejecter:nil];
        if (_presentReject) {
            _presentReject(@"E_AD_NOT_READY", @"Ad is not ready.", nil);
            _presentResolve = nil;
            _presentReject = nil;
        }
    }
}

- (BOOL)wasLoadTimeLessThanNHoursAgo:(int)n {
    NSDate *now = [NSDate date];
    NSTimeInterval timeIntervalBetweenNowAndLoadTime = [now timeIntervalSinceDate:self.loadTime];
    double secondsPerHour = 3600.0;
    double intervalInHours = timeIntervalBetweenNowAndLoadTime / secondsPerHour;
    return intervalInHours < n;
}

- (void)sendEvent:(NSString *)eventName data:(NSDictionary *)data
{
    [RNAdMobEvent sendEvent:eventName type:@"AppOpen" requestId:@0 data:data];
}

- (void)onMoveToForeground
{
    [self showAdIfAvailable];
}

#pragma mark GADFullScreenContentDelegate

- (void)adDidPresentFullScreenContent:(GADAppOpenAd *)ad
{
    [self sendEvent:kEventAdPresented data:nil];
    
    if (_presentResolve) {
        _presentResolve(nil);
        _presentResolve = nil;
        _presentReject = nil;
    }
}

- (void)ad:(GADAppOpenAd *)ad didFailToPresentFullScreenContentWithError:(NSError *)error
{
    NSDictionary *jsError = RCTJSErrorFromCodeMessageAndNSError(@"E_AD_PRESENT_FAILED", error.localizedDescription, error);
    [self sendEvent:kEventAdFailedToPresent data:jsError];
    
    if (_presentReject) {
        _presentReject(@"E_AD_PRESENT_FAILED", [error localizedDescription], error);
        _presentResolve = nil;
        _presentReject = nil;
    }
}

- (void)adDidDismissFullScreenContent:(GADAppOpenAd *)ad
{
    [self sendEvent:kEventAdDismissed data:nil];
}

@end
