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
  BannerAd,
  InterstitialAd,
  RewardedAd,
  Reward,
  AdManager,
  BannerAdSize,
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

export default function Example() {
  const bannerRef = useRef<BannerAd>(null);
  const adaptiveBannerRef = useRef<BannerAd>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await AdManager.setRequestConfiguration();

      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    if (loading) return;

    RewardedAd.setUnitId('ca-app-pub-3940256099942544/5224354917');

    RewardedAd.addEventListener('rewarded', (reward: Reward) =>
      console.log('RewardedAd => rewarded', reward)
    );
    RewardedAd.addEventListener('adPresented', () =>
      console.log('RewardedAd => adPresented')
    );
    RewardedAd.addEventListener('adFailedToPresent', () =>
      console.warn('RewardedAd => adFailedToPresent')
    );
    RewardedAd.addEventListener('adDismissed', () => {
      console.log('RewardedAd => adDismissed');
      RewardedAd.requestAd().catch((error) => console.warn(error));
    });

    RewardedAd.requestAd().catch((error) => console.warn(error));

    InterstitialAd.setUnitId('ca-app-pub-3940256099942544/1033173712');

    InterstitialAd.addEventListener('adPresented', () =>
      console.log('InterstitialAd => adPresented')
    );
    InterstitialAd.addEventListener('adFailedToPresent', () =>
      console.warn('InterstitialAd => adFailedToPresent')
    );
    InterstitialAd.addEventListener('adDismissed', () => {
      console.log('InterstitialAd => adDismissed');
      InterstitialAd.requestAd().catch((error) => console.warn(error));
    });

    InterstitialAd.requestAd().catch((error) => console.warn(error));

    return () => {
      RewardedAd.removeAllListeners();
      InterstitialAd.removeAllListeners();
    };
  }, [loading]);

  function showRewarded() {
    RewardedAd.presentAd().catch((error) => console.warn(error));
  }

  function showInterstitial() {
    InterstitialAd.presentAd().catch((error) => console.warn(error));
  }

  return (
    <View style={styles.container}>
      {!loading && (
        <ScrollView>
          <BannerExample title="AdMob - Basic">
            <BannerAd
              size={BannerAdSize.MEDIUM_RECTANGLE}
              unitId="ca-app-pub-3940256099942544/6300978111"
              onAdLoaded={() => console.log('Ad loaded!')}
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
              unitId="ca-app-pub-3940256099942544/6300978111"
              ref={adaptiveBannerRef}
            />
            <Button
              title="Reload"
              onPress={() => adaptiveBannerRef.current?.loadAd()}
            />
          </BannerExample>
          <BannerExample title="Rewarded">
            <Button
              title="Show Rewarded Video and preload next"
              onPress={showRewarded}
            />
          </BannerExample>
          <BannerExample title="Interstitial">
            <Button
              title="Show Interstitial and preload next"
              onPress={showInterstitial}
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
    margin: 10,
    fontSize: 20,
  },
});
