import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import AdMob, {
  AdHookOptions,
  BannerAd,
  BannerAdSize,
  useInterstitialAd,
  useRewardedAd,
  useRewardedInterstitialAd,
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
const UNIT_ID_REWARDED_INTERSTITIAL = 'ca-app-pub-3940256099942544/6978759866';
const UNIT_ID_BANNER = 'ca-app-pub-3940256099942544/6300978111';
const UNIT_ID_GAM_BANNER = '/6499/example/banner';

const hookOptions: AdHookOptions = {
  loadOnDismissed: true,
  requestOptions: {
    requestNonPersonalizedAdsOnly: true,
  },
};

export default function Example() {
  const bannerRef = useRef<BannerAd>(null);
  const adaptiveBannerRef = useRef<BannerAd>(null);
  const gamBannerRef = useRef<BannerAd>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [adTick, setAdTick] = useState(5);
  const rewardedAd = useRewardedAd(UNIT_ID_REWARDED, hookOptions);
  const interstitalAd = useInterstitialAd(UNIT_ID_INTERSTITIAL, hookOptions);
  const rewardedInterstitialAd = useRewardedInterstitialAd(
    UNIT_ID_REWARDED_INTERSTITIAL,
    hookOptions
  );

  useEffect(() => {
    const init = async () => {
      await AdMob.initialize();

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

  useEffect(() => {
    if (adTick > 0 && modalVisible) {
      const timeout = setTimeout(() => setAdTick((prev) => prev - 1), 1000);
      return () => clearTimeout(timeout);
    } else if (adTick === 0) {
      if (Platform.OS === 'android') {
        rewardedInterstitialAd.show();
        setAdTick(5);
      }
      setModalVisible(false);
    } else if (!modalVisible) {
      setAdTick(5);
    }
  }, [adTick, modalVisible, rewardedInterstitialAd]);

  useEffect(() => {
    const { adLoadError, adPresentError } = rewardedInterstitialAd;
    if (adLoadError) {
      console.error(adLoadError);
    } else if (adPresentError) {
      console.error(adPresentError);
    }
  }, [rewardedInterstitialAd]);

  useEffect(() => {
    if (rewardedInterstitialAd.reward) {
      console.log('Reward earned: ');
      console.log(rewardedInterstitialAd.reward);
    }
  }, [rewardedInterstitialAd.reward]);

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
              onPress={() => rewardedAd.show()}
            />
          </BannerExample>
          <BannerExample title="Interstitial">
            <Button
              title="Show Interstitial and preload next"
              disabled={!interstitalAd.adLoaded}
              onPress={() => interstitalAd.show()}
            />
          </BannerExample>
          <BannerExample title="RewardedInterstitial">
            <Button
              title="Show Rewarded Interstitial Video and preload next"
              disabled={!rewardedInterstitialAd.adLoaded}
              onPress={() => setModalVisible(true)}
            />
          </BannerExample>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
            onDismiss={() => {
              if (adTick === 0) {
                rewardedInterstitialAd.show();
                setAdTick(5);
              }
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Watch this video and earn reward.
                </Text>
                <Text style={styles.modalText}>
                  Ad starts in {adTick} seconds
                </Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>No Thanks</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
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
  centeredView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  modalView: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
    margin: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  button: {
    borderRadius: 20,
    elevation: 2,
    padding: 10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
