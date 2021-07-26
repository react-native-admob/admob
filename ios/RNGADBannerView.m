#import "RNGADBannerView.h"
#import "RNAdMobUtils.h"

@implementation RNGADBannerView

- (void)initBanner:(GADAdSize)adSize {
    if (_requested) {
        [_bannerView removeFromSuperview];
    }
    _bannerView = [[GADBannerView alloc] initWithAdSize:adSize];
    _bannerView.delegate = self;
    _bannerView.rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
}

- (void)setUnitId:(NSString *)unitId {
    _unitId = unitId;
    [self requestAd];
}

- (void)setAdSize:(NSString *)adSize {
    _adSize = adSize;
    [self requestAd];
}

- (void)requestAd
{
    if (_unitId == nil) {
        [self setRequested:NO];
        return;
    }
    
    [self initBanner:RNAdmobStringToAdSize(_adSize)];
    [self addSubview:_bannerView];
    _bannerView.adUnitID = _unitId;
    [self setRequested:YES];
    GADRequest *request = [GADRequest request];
    [_bannerView loadRequest:request];
    
    self.onSizeChange(@{
        @"width": @(_bannerView.bounds.size.width),
        @"height": @(_bannerView.bounds.size.height),
                      });
    
    NSLog(@"%f %f", _bannerView.bounds.size.width, _bannerView.bounds.size.height);
}

# pragma mark GADBannerViewDelegate

/// Tells the delegate an ad request loaded an ad.
- (void)bannerViewDidReceiveAd:(__unused GADBannerView *)bannerView
{
    if (self.onAdLoaded) {
        self.onAdLoaded(@{});
    }
}

/// Tells the delegate an ad request failed.
- (void)bannerView:(__unused GADBannerView *)bannerView
didFailToReceiveAdWithError:(NSError *)error
{
    if (self.onAdFailedToLoad) {
        self.onAdFailedToLoad(@{ @"error": @{ @"message": [error localizedDescription] } });
    }
}

/// Tells the delegate that a full screen view will be presented in response
/// to the user clicking on an ad.
- (void)bannerViewWillPresentScreen:(__unused GADBannerView *)bannerView
{
    if (self.onAdOpened) {
        self.onAdOpened(@{});
    }
}

/// Tells the delegate that the full screen view will be dismissed.
- (void)bannerViewWillDismissScreen:(__unused GADBannerView *)bannerView
{
    if (self.onAdClosed) {
        self.onAdClosed(@{});
    }
}

@end
