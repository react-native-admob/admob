#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import <React/RCTLog.h>

@import GoogleMobileAds;

@class RCTEventDispatcher;

@interface RNAdMobBannerView : UIView <GADBannerViewDelegate, GADAppEventDelegate, GADAdSizeDelegate>

@property GAMBannerView *bannerView;

@property (nonatomic, copy) NSString *unitId;
@property (nonatomic, copy) NSString *size;
@property (nonatomic, copy) NSArray *sizes;
@property (nonatomic, copy) NSDictionary *requestOptions;

@property (nonatomic, copy) RCTDirectEventBlock onSizeChange;
@property (nonatomic, copy) RCTDirectEventBlock onAdLoaded;
@property (nonatomic, copy) RCTDirectEventBlock onAdFailedToLoad;
@property (nonatomic, copy) RCTDirectEventBlock onAdOpened;
@property (nonatomic, copy) RCTDirectEventBlock onAdClosed;

@property (nonatomic, copy) RCTDirectEventBlock onAppEvent;

- (void)requestAd;

@end
