import React, { Component, createRef } from 'react';
import {
  findNodeHandle,
  requireNativeComponent,
  StyleProp,
  UIManager,
  ViewStyle,
} from 'react-native';

import { GAMBannerAdProps } from '../types';

interface BannerAdState {
  style: StyleProp<ViewStyle>;
}

class BannerAd extends Component<GAMBannerAdProps> {
  state: BannerAdState = {
    style: { width: 0, height: 0 },
  };
  bannerRef = createRef<typeof RNAdMobBannerView>();

  loadAd() {
    UIManager.dispatchViewManagerCommand(
      //@ts-expect-error
      findNodeHandle(this.bannerRef),
      'requestAd',
      undefined
    );
  }

  private handleSizeChange(event: any) {
    const { height, width } = event.nativeEvent;
    this.setState({ style: { width, height } });
    if (this.props.onSizeChange) {
      this.props.onSizeChange({ width, height });
    }
  }

  private handleOnAdLoaded() {
    if (this.props.onAdLoaded) {
      this.props.onAdLoaded();
    }
  }

  private handleOnAdFailedToLoad(event: any) {
    if (this.props.onAdFailedToLoad) {
      this.props.onAdFailedToLoad(event.nativeEvent);
    }
  }

  private handleOnAdOpened() {
    if (this.props.onAdOpened) {
      this.props.onAdOpened();
    }
  }

  private handleOnAdClosed() {
    if (this.props.onAdClosed) {
      this.props.onAdClosed();
    }
  }

  private handleOnAppEvent(event: any) {
    const { name, info } = event.nativeEvent;
    if (this.props.onAppEvent) {
      this.props.onAppEvent(name, info);
    }
  }

  render() {
    return (
      <RNAdMobBannerView
        {...this.props}
        style={[this.props.style, this.state.style]}
        onAdLoaded={this.handleOnAdLoaded.bind(this)}
        onAdFailedToLoad={this.handleOnAdFailedToLoad.bind(this)}
        onAdOpened={this.handleOnAdOpened.bind(this)}
        onAdClosed={this.handleOnAdClosed.bind(this)}
        onAppEvent={this.handleOnAppEvent.bind(this)}
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
  requireNativeComponent<GAMBannerAdProps>('RNAdMobBannerView');

export default BannerAd;
