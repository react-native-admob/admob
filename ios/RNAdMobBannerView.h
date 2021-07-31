@import React;
@import GoogleMobileAds;

@class RCTEventDispatcher;

@interface RNAdMobBannerView : UIView <GADBannerViewDelegate>

@property GADBannerView *bannerView;
@property (nonatomic, assign) BOOL requested;

@property (nonatomic, copy) NSString *unitId;
@property (nonatomic, copy) NSString *size;

@property (nonatomic, copy) RCTBubblingEventBlock onSizeChange;
@property (nonatomic, copy) RCTDirectEventBlock onAdLoaded;
@property (nonatomic, copy) RCTDirectEventBlock onAdFailedToLoad;
@property (nonatomic, copy) RCTDirectEventBlock onAdOpened;
@property (nonatomic, copy) RCTDirectEventBlock onAdClosed;

- (void)requestAd;

@end
