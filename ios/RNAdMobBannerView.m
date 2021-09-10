#import "RNAdMobBannerView.h"
#import "RNAdMobCommon.h"

@implementation RNAdMobBannerView

- (void)setUnitId:(NSString *)unitId {
    _unitId = unitId;
    [self requestAd];
}

- (void)setSize:(NSString *)size {
    _size = size;
    [self requestAd];
}

- (void)setSizes:(NSArray *)sizes
{
    _sizes = sizes;
    [self requestAd];
}

- (void)setRequestOptions:(NSDictionary *)requestOptions
{
    _requestOptions = requestOptions;
    [self requestAd];
}

- (void)requestAd
{
    if (_unitId == nil || (_size == nil && _sizes == nil) || _requestOptions == nil) {
        return;
    }
    GADAdSize size = [RNAdMobCommon stringToAdSize:_size ? _size : _sizes[0]];
    if (!_bannerView) {
        _bannerView = [[GAMBannerView alloc] initWithAdSize:size];
        _bannerView.delegate = self;
        _bannerView.appEventDelegate = self;
        _bannerView.adSizeDelegate = self;
        _bannerView.rootViewController = RCTPresentedViewController();
        [self addSubview:_bannerView];
    }
    _bannerView.adUnitID = _unitId;
    _bannerView.adSize = size;
    if (_sizes) {
        if ([_unitId hasPrefix:@"/"]) {
            _bannerView.validAdSizes = [RNAdMobCommon stringsToValues:_sizes];
        } else {
            RCTLogError(@"Trying to set sizes in non Ad Manager unit Id");
        }
    }
    
    GAMRequest *request = [RNAdMobCommon buildAdRequest:_requestOptions];
    [_bannerView loadRequest:request];
}

# pragma mark GADBannerViewDelegate

/// Tells the delegate an ad request loaded an ad.
- (void)bannerViewDidReceiveAd:(GAMBannerView *)bannerView
{
    _onSizeChange(@{
        @"width": @(_bannerView.bounds.size.width),
        @"height": @(_bannerView.bounds.size.height),
                  });
    
    if (_onAdLoaded) {
        _onAdLoaded(nil);
    }
}

/// Tells the delegate an ad request failed.
- (void)bannerView:(__unused GAMBannerView *)bannerView
didFailToReceiveAdWithError:(NSError *)error
{
    if (_onAdFailedToLoad) {
        NSDictionary *jsError = RCTJSErrorFromCodeMessageAndNSError(@"E_AD_LOAD_FAILED", error.localizedDescription, error);
        _onAdFailedToLoad(jsError);
    }
}

/// Tells the delegate that a full screen view will be presented in response
/// to the user clicking on an ad.
- (void)bannerViewWillPresentScreen:(__unused GAMBannerView *)bannerView
{
    if (_onAdOpened) {
        _onAdOpened(nil);
    }
}

/// Tells the delegate that the full screen view will be dismissed.
- (void)bannerViewDidDismissScreen:(__unused GAMBannerView *)bannerView
{
    if (_onAdClosed) {
        _onAdClosed(nil);
    }
}

- (void)adView:(__unused GAMBannerView *)bannerView didReceiveAppEvent:(NSString *)name withInfo:(NSString *)info
{
    if (_onAppEvent) {
        _onAppEvent(@{
            @"name": name,
            @"info": info
                    });
    }
}

- (void)adView:(GAMBannerView *)bannerView willChangeAdSizeTo:(GADAdSize)size
{
    _onSizeChange(@{
        @"width": @(_bannerView.bounds.size.width),
        @"height": @(_bannerView.bounds.size.height),
                  });
}

@end
