import React, { useRef } from 'react';
import { Button, Text } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  GAMBannerAd,
  TestIds,
} from '@react-native-admob/admob';

import ExampleGroup from '../components/ExampleGroup';
import { usePaidState } from '../PaidProvider';

const UNIT_ID_GAM_BANNER = '/6499/example/banner';

const AdSpace = ({
  isPaid,
  children,
}: {
  isPaid: boolean;
  children: React.ReactNode;
}) => (isPaid ? <Text>Ad was removed</Text> : <>{children}</>);

const BannerAdExample = () => {
  const bannerRef = useRef<BannerAd>(null);
  const adaptiveBannerRef = useRef<BannerAd>(null);
  const gamBannerRef = useRef<GAMBannerAd>(null);
  const { isPaid } = usePaidState();

  return (
    <>
      <ExampleGroup title="Banner - Basic">
        <AdSpace isPaid={isPaid}>
          <BannerAd
            size={BannerAdSize.BANNER}
            unitId={TestIds.BANNER}
            onAdLoaded={() => console.log('Banner Ad loaded!')}
            ref={bannerRef}
          />
          <Button title="Reload" onPress={() => bannerRef.current?.loadAd()} />
        </AdSpace>
      </ExampleGroup>
      <ExampleGroup title="Adaptive Banner">
        <AdSpace isPaid={isPaid}>
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
        </AdSpace>
      </ExampleGroup>
      <ExampleGroup title="Ad Manager Banner">
        <AdSpace isPaid={isPaid}>
          <GAMBannerAd
            sizes={[BannerAdSize.BANNER, BannerAdSize.MEDIUM_RECTANGLE]}
            onSizeChange={(size) => {
              console.log(size);
            }}
            unitId={UNIT_ID_GAM_BANNER}
            ref={gamBannerRef}
          />
          <Button
            title="Reload"
            onPress={() => gamBannerRef.current?.loadAd()}
          />
        </AdSpace>
      </ExampleGroup>
    </>
  );
};

export default BannerAdExample;
