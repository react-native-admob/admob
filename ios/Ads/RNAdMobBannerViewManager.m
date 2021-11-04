#import "RNAdMobBannerView.h"

@interface RNAdMobBannerViewManager : RCTViewManager
@end

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
            RCTLogError(@"Invalid view returned from registry, expecting RNAdMobBannerView, got: %@", view);
        } else {
            [view requestAd];
        }
    }];
}

RCT_EXPORT_VIEW_PROPERTY(size, NSString)
RCT_EXPORT_VIEW_PROPERTY(unitId, NSString)
RCT_EXPORT_VIEW_PROPERTY(sizes, NSArray)
RCT_EXPORT_VIEW_PROPERTY(requestOptions, NSDictionary)

RCT_EXPORT_VIEW_PROPERTY(onSizeChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdLoaded, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdFailedToLoad, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdOpened, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdClosed, RCTDirectEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onAppEvent, RCTDirectEventBlock)

@end
