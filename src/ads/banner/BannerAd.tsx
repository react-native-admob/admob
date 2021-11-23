import React from 'react';

import { BannerAdProps } from '../../types';

import BaseAd, { RNAdMobBannerView } from './BaseAd';

class BannerAd extends BaseAd<BannerAdProps> {
  render() {
    return (
      <RNAdMobBannerView
        {...this.props}
        style={[this.props.style, this.state.style]}
        onAdLoaded={this.handleOnAdLoaded.bind(this)}
        onAdFailedToLoad={this.handleOnAdFailedToLoad.bind(this)}
        onAdOpened={this.handleOnAdOpened.bind(this)}
        onAdClosed={this.handleOnAdClosed.bind(this)}
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

export default BannerAd;
