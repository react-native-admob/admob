#import "RNAdMobBannerView.h"
#import "RNAdMobCommon.h"

@implementation RNAdMobBannerView

- (void)initBanner:(GADAdSize)adSize {
    if (_requested) {
        [_bannerView removeFromSuperview];
    }
    _bannerView = [[GADBannerView alloc] initWithAdSize:adSize];
    _bannerView.delegate = self;
    _bannerView.rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
}

- (void)setUnitId:(NSString *)unitId {
    NSLog(@"%@", unitId);
    _unitId = unitId;
    [self requestAd];
}

- (void)setSize:(NSString *)size {
    _size = size;
    [self requestAd];
}

- (void)requestAd
{
    if (_unitId == nil || _size == nil) {
        [self setRequested:NO];
        return;
    }
    
    [self initBanner:[RNAdMobCommon stringToAdSize:_size]];
    [self addSubview:_bannerView];
    _bannerView.adUnitID = _unitId;
    [self setRequested:YES];
    GADRequest *request = [GADRequest request];
    [_bannerView loadRequest:request];
}

# pragma mark GADBannerViewDelegate

/// Tells the delegate an ad request loaded an ad.
- (void)bannerViewDidReceiveAd:(__unused GADBannerView *)bannerView
{
    if (_onAdLoaded) {
        _onAdLoaded(@{});
    }
    
    _onSizeChange(@{
        @"width": @(_bannerView.bounds.size.width),
        @"height": @(_bannerView.bounds.size.height),
                  });
}

/// Tells the delegate an ad request failed.
- (void)bannerView:(__unused GADBannerView *)bannerView
didFailToReceiveAdWithError:(NSError *)error
{
    if (_onAdFailedToLoad) {
        _onAdFailedToLoad(@{ @"error": @{ @"message": [error localizedDescription] } });
    }
}

/// Tells the delegate that a full screen view will be presented in response
/// to the user clicking on an ad.
- (void)bannerViewWillPresentScreen:(__unused GADBannerView *)bannerView
{
    if (_onAdOpened) {
        _onAdOpened(@{});
    }
}

/// Tells the delegate that the full screen view will be dismissed.
- (void)bannerViewWillDismissScreen:(__unused GADBannerView *)bannerView
{
    if (_onAdClosed) {
        _onAdClosed(@{});
    }
}

@end
