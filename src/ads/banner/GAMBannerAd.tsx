import React from 'react';

import { GAMBannerAdProps } from '../../types';

import BaseAd, { RNAdMobBannerView } from './BaseAd';

class GAMBannerAd extends BaseAd<GAMBannerAdProps> {
  protected handleOnAppEvent(event: any) {
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

export default GAMBannerAd;
