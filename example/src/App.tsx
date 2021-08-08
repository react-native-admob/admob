import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {
  AdHookOptions,
  AdManager,
  BannerAd,
  BannerAdSize,
  useInterstitialAd,
  useRewardedAd,
} from '@react-native-admob/admob';

interface BannerExampleProps {
  style?: StyleProp<ViewStyle>;
  title: string;
  children: React.ReactNode;
}

const BannerExample = ({
  style,
  title,
  children,
  ...props
}: BannerExampleProps) => (
  <View {...props} style={[styles.example, style]}>
    <Text style={styles.title}>{title}</Text>
    <View>{children}</View>
  </View>
);

const UNIT_ID_REWARDED = 'ca-app-pub-3940256099942544/5224354917';
const UNIT_ID_INTERSTITIAL = 'ca-app-pub-3940256099942544/1033173712';
const UNIT_ID_BANNER = 'ca-app-pub-3940256099942544/6300978111';
const UNIT_ID_GAM_BANNER = '/6499/example/banner';

const hookOptions: AdHookOptions = {
  requestOnDismissed: true,
};

export default function Example() {
  const bannerRef = useRef<BannerAd>(null);
  const adaptiveBannerRef = useRef<BannerAd>(null);
  const gamBannerRef = useRef<BannerAd>(null);
  const [loading, setLoading] = useState(true);
  const rewardedAd = useRewardedAd(UNIT_ID_REWARDED, hookOptions);
  const interstitalAd = useInterstitialAd(UNIT_ID_INTERSTITIAL, hookOptions);

  useEffect(() => {
    const init = async () => {
      await AdManager.initialize();

      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    const { adLoadError, adPresentError } = rewardedAd;
    if (adLoadError) {
      console.error(adLoadError);
    } else if (adPresentError) {
      console.error(adPresentError);
    }
  }, [rewardedAd]);

  useEffect(() => {
    if (rewardedAd.reward) {
      console.log('Reward earned: ');
      console.log(rewardedAd.reward);
    }
  }, [rewardedAd.reward]);

  useEffect(() => {
    const { adLoadError, adPresentError } = interstitalAd;
    if (adLoadError) {
      console.error(adLoadError);
    } else if (adPresentError) {
      console.error(adPresentError);
    }
  }, [interstitalAd]);

  return (
    <View style={styles.container}>
      {!loading && (
        <ScrollView>
          <BannerExample title="AdMob - Basic">
            <BannerAd
              size={BannerAdSize.BANNER}
              unitId={UNIT_ID_BANNER}
              onAdLoaded={() => console.log('Banner Ad loaded!')}
              ref={bannerRef}
            />
            <Button
              title="Reload"
              onPress={() => bannerRef.current?.loadAd()}
            />
          </BannerExample>
          <BannerExample title="Adaptive Banner">
            <BannerAd
              size={BannerAdSize.ADAPTIVE_BANNER}
              unitId={UNIT_ID_BANNER}
              ref={adaptiveBannerRef}
            />
            <Button
              title="Reload"
              onPress={() => adaptiveBannerRef.current?.loadAd()}
            />
          </BannerExample>
          <BannerExample title="Ad Manager Banner">
            <BannerAd
              size={BannerAdSize.BANNER}
              sizes={[BannerAdSize.BANNER, BannerAdSize.MEDIUM_RECTANGLE]}
              unitId={UNIT_ID_GAM_BANNER}
              ref={gamBannerRef}
            />
            <Button
              title="Reload"
              onPress={() => gamBannerRef.current?.loadAd()}
            />
          </BannerExample>
          <BannerExample title="Rewarded">
            <Button
              title="Show Rewarded Video and preload next"
              disabled={!rewardedAd.adLoaded}
              onPress={() => rewardedAd.presentAd()}
            />
          </BannerExample>
          <BannerExample title="Interstitial">
            <Button
              title="Show Interstitial and preload next"
              disabled={!interstitalAd.adLoaded}
              onPress={() => interstitalAd.presentAd()}
            />
          </BannerExample>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 30 : 10,
  },
  example: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    margin: 10,
  },
});
