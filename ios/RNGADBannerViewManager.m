#import "RNGADBannerViewManager.h"
#import "RNGADBannerView.h"

@implementation RNGADBannerViewManager

RCT_EXPORT_MODULE();

- (UIView *)view
{
    return [RNGADBannerView new];
}

RCT_EXPORT_METHOD(requestAd:(nonnull NSNumber *)reactTag)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, RNGADBannerView *> *viewRegistry) {
        RNGADBannerView *view = viewRegistry[reactTag];
        if (![view isKindOfClass:[RNGADBannerView class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting RNGADBannerView, got: %@", view);
        } else {
            [view requestAd];
        }
    }];
}

RCT_EXPORT_VIEW_PROPERTY(adSize, NSString)
RCT_REMAP_VIEW_PROPERTY(adUnitID, unitId, NSString)

RCT_EXPORT_VIEW_PROPERTY(onSizeChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdLoaded, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdFailedToLoad, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdOpened, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdClosed, RCTBubblingEventBlock)

@end
