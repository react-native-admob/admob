import React, { Component } from 'react';
import {
  findNodeHandle,
  requireNativeComponent,
  UIManager,
} from 'react-native';

class BannerAd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };
    this.handleSizeChange = this.handleSizeChange.bind(this);
  }

  loadAd() {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this._bannerView),
      UIManager.getViewManagerConfig('RNAdMobBannerView').Commands.requestAd,
      null
    );
  }

  handleSizeChange(event) {
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
        onSizeChange={this.handleSizeChange}
        onAdLoaded={this.props.onAdLoaded}
        onAdFailedToLoad={this.props.onAdFailedToLoad}
        onAdOpened={this.props.onAdOpened}
        onAdClosed={this.props.onAdClosed}
        ref={(el) => (this._bannerView = el)}
      />
    );
  }
}

const RNAdMobBannerView = requireNativeComponent('RNAdMobBannerView');

export default BannerAd;
