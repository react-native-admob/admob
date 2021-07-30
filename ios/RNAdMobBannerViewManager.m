#import "RNAdMobBannerViewManager.h"
#import "RNAdMobBannerView.h"

@implementation RNAdMobBannerViewManager

RCT_EXPORT_MODULE();

- (UIView *)view
{
    return [RNAdMobBannerView new];
}

RCT_EXPORT_METHOD(requestAd:(nonnull NSNumber *)reactTag)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, RNAdMobBannerView *> *viewRegistry) {
        RNAdMobBannerView *view = viewRegistry[reactTag];
        if (![view isKindOfClass:[RNAdMobBannerView class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNGADBannerView, got: %@", view);
        } else {
            [view requestAd];
        }
    }];
}

RCT_EXPORT_VIEW_PROPERTY(size, NSString)
RCT_EXPORT_VIEW_PROPERTY(unitId, NSString)

RCT_EXPORT_VIEW_PROPERTY(onSizeChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdLoaded, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdFailedToLoad, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdOpened, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdClosed, RCTBubblingEventBlock)

@end
