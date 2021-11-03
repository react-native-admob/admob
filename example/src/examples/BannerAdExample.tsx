import React, { useRef } from 'react';
import { Button } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  GAMBannerAd,
  TestIds,
} from '@react-native-admob/admob';

import ExampleGroup from '../components/ExampleGroup';

const UNIT_ID_GAM_BANNER = '/6499/example/banner';

const BannerAdExample = () => {
  const bannerRef = useRef<BannerAd>(null);
  const adaptiveBannerRef = useRef<BannerAd>(null);
  const gamBannerRef = useRef<GAMBannerAd>(null);

  return (
    <>
      <ExampleGroup title="AdMob - Basic">
        <BannerAd
          size={BannerAdSize.BANNER}
          unitId={TestIds.BANNER}
          onAdLoaded={() => console.log('Banner Ad loaded!')}
          ref={bannerRef}
        />
        <Button title="Reload" onPress={() => bannerRef.current?.loadAd()} />
      </ExampleGroup>
      <ExampleGroup title="Adaptive Banner">
        <BannerAd
          size={BannerAdSize.ADAPTIVE_BANNER}
          unitId={TestIds.BANNER}
          ref={adaptiveBannerRef}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
        <Button
          title="Reload"
          onPress={() => adaptiveBannerRef.current?.loadAd()}
        />
      </ExampleGroup>
      <ExampleGroup title="Ad Manager Banner">
        <GAMBannerAd
          sizes={[BannerAdSize.BANNER, BannerAdSize.MEDIUM_RECTANGLE]}
          onSizeChange={(size) => {
            console.log(size);
          }}
          unitId={UNIT_ID_GAM_BANNER}
          ref={gamBannerRef}
        />
        <Button title="Reload" onPress={() => gamBannerRef.current?.loadAd()} />
      </ExampleGroup>
    </>
  );
};

export default BannerAdExample;
