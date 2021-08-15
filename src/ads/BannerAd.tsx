import React, { Component, createRef } from 'react';
import {
  findNodeHandle,
  requireNativeComponent,
  StyleProp,
  UIManager,
  ViewStyle,
} from 'react-native';

import { BannerAdProps, GAMBannerAdProps } from '../types';

interface BannerAdState {
  style: StyleProp<ViewStyle>;
}

class BannerAd extends Component<BannerAdProps | GAMBannerAdProps> {
  state: BannerAdState = {
    style: { width: 0, height: 0 },
  };
  bannerRef = createRef<typeof RNAdMobBannerView>();

  loadAd() {
    UIManager.dispatchViewManagerCommand(
      //@ts-expect-error
      findNodeHandle(this.bannerRef),
      UIManager.getViewManagerConfig('RNAdMobBannerView').Commands.requestAd,
      undefined
    );
  }

  handleSizeChange(event: any) {
    const { height, width } = event.nativeEvent;
    this.setState({ style: { width, height } });
    if (this.props.onSizeChange) {
      this.props.onSizeChange({ width, height });
    }
  }

  render() {
    return (
      <RNAdMobBannerView
        {...this.props}
        style={[this.props.style, this.state.style]}
        onSizeChange={this.handleSizeChange.bind(this)}
        requestOptions={this.props.requestOptions || {}}
        ref={(el) => {
          //@ts-expect-error
          this.bannerRef = el;
        }}
      />
    );
  }
}

const RNAdMobBannerView =
  requireNativeComponent<BannerAdProps>('RNAdMobBannerView');

export default BannerAd;
