import { Component, createRef } from 'react';
import {
  findNodeHandle,
  requireNativeComponent,
  StyleProp,
  UIManager,
  ViewStyle,
} from 'react-native';

import { BannerAdProps, GAMBannerAdProps } from '../../types';

interface BannerAdState {
  style: StyleProp<ViewStyle>;
}

export const RNAdMobBannerView =
  requireNativeComponent<GAMBannerAdProps>('RNAdMobBannerView');

abstract class BaseAd<
  T extends BannerAdProps | GAMBannerAdProps
> extends Component<T> {
  state: BannerAdState = {
    style: { width: 0, height: 0 },
  };
  bannerRef = createRef();

  loadAd() {
    UIManager.dispatchViewManagerCommand(
      //@ts-expect-error
      findNodeHandle(this.bannerRef),
      'requestAd',
      undefined
    );
  }

  protected handleSizeChange(event: any) {
    const { height, width } = event.nativeEvent;
    this.setState({ style: { width, height } });
    if (this.props.onSizeChange) {
      this.props.onSizeChange({ width, height });
    }
  }

  protected handleOnAdLoaded() {
    if (this.props.onAdLoaded) {
      this.props.onAdLoaded();
    }
  }

  protected handleOnAdFailedToLoad(event: any) {
    if (this.props.onAdFailedToLoad) {
      this.props.onAdFailedToLoad(event.nativeEvent);
    }
  }

  protected handleOnAdOpened() {
    if (this.props.onAdOpened) {
      this.props.onAdOpened();
    }
  }

  protected handleOnAdClosed() {
    if (this.props.onAdClosed) {
      this.props.onAdClosed();
    }
  }
}

export default BaseAd;
