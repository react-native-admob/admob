@import React;
@import GoogleMobileAds;

@class RCTEventDispatcher;

@interface RNAdMobBannerView : UIView <GADBannerViewDelegate>

@property GADBannerView *bannerView;
@property (nonatomic, assign) BOOL requested;

@property (nonatomic, copy) NSString *unitId;
@property (nonatomic, copy) NSString *size;

@property (nonatomic, copy) RCTBubblingEventBlock onSizeChange;
@property (nonatomic, copy) RCTBubblingEventBlock onAdLoaded;
@property (nonatomic, copy) RCTBubblingEventBlock onAdFailedToLoad;
@property (nonatomic, copy) RCTBubblingEventBlock onAdOpened;
@property (nonatomic, copy) RCTBubblingEventBlock onAdClosed;

- (void)requestAd;

@end
