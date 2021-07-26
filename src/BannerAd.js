import React, { Component } from 'react';
import {
  findNodeHandle,
  requireNativeComponent,
  UIManager,
} from 'react-native';
import { createErrorFromErrorData } from './utils';

class BannerAd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleAdFailedToLoad = this.handleAdFailedToLoad.bind(this);
  }

  loadAd() {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this._bannerView),
      UIManager.getViewManagerConfig('RNGADBannerView').Commands.requestAd,
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

  handleAdFailedToLoad(event) {
    if (this.props.onAdFailedToLoad) {
      this.props.onAdFailedToLoad(
        createErrorFromErrorData(event.nativeEvent.error)
      );
    }
  }

  render() {
    return (
      <RNGADBannerView
        {...this.props}
        style={[this.props.style, this.state.style]}
        onSizeChange={this.handleSizeChange}
        onAdFailedToLoad={this.handleAdFailedToLoad}
        ref={(el) => (this._bannerView = el)}
      />
    );
  }
}

const RNGADBannerView = requireNativeComponent('RNGADBannerView');

export default BannerAd;
