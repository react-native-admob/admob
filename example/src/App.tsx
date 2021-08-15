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
import RNBootSplash from 'react-native-bootsplash';
import AdMob, {
  AdHookOptions,
  BannerAd,
  BannerAdSize,
  useAppOpenAd,
  useInterstitialAd,
  useRewardedAd,
  useRewardedInterstitialAd,
} from '@react-native-admob/admob';

interface ExampleGroupProps {
  style?: StyleProp<ViewStyle>;
  title: string;
  children: React.ReactNode;
}

const ExampleGroup = ({
  style,
  title,
  children,
  ...props
}: ExampleGroupProps) => (
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
const UNIT_ID_APP_OPEN = 'ca-app-pub-3940256099942544/5662855259';

const hookOptions: AdHookOptions = {
  loadOnDismissed: true,
  requestOptions: {
    requestNonPersonalizedAdsOnly: true,
  },
};

function Example() {
  const bannerRef = useRef<BannerAd>(null);
  const adaptiveBannerRef = useRef<BannerAd>(null);
  const gamBannerRef = useRef<BannerAd>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [adTick, setAdTick] = useState(5);
  const rewardedAd = useRewardedAd(UNIT_ID_REWARDED, hookOptions);
  const interstitalAd = useInterstitialAd(UNIT_ID_INTERSTITIAL, hookOptions);
  const rewardedInterstitialAd = useRewardedInterstitialAd(
    UNIT_ID_REWARDED_INTERSTITIAL,
    hookOptions
  );

  useEffect(() => {
    const { adLoadError, adPresentError } = interstitalAd;
    if (adLoadError) {
      console.error(adLoadError);
    } else if (adPresentError) {
      console.error(adPresentError);
    }
  }, [interstitalAd]);

  useEffect(() => {
    if (rewardedAd.reward) {
      console.log('Reward earned: ');
      console.log(rewardedAd.reward);
    }
  }, [rewardedAd.reward]);

  useEffect(() => {
    if (adTick > 0 && modalVisible) {
      const timeout = setTimeout(() => setAdTick((prev) => prev - 1), 1000);
      return () => clearTimeout(timeout);
    } else if (adTick === 0) {
      rewardedInterstitialAd.show();
      setAdTick(5);
    } else if (!modalVisible) {
      setAdTick(5);
    }
  }, [adTick, modalVisible, rewardedInterstitialAd]);

  useEffect(() => {
    if (rewardedInterstitialAd.adDismissed) {
      setModalVisible(false);
    }
  }, [rewardedInterstitialAd.adDismissed]);

  useEffect(() => {
    if (rewardedInterstitialAd.reward) {
      console.log('Reward earned: ');
      console.log(rewardedInterstitialAd.reward);
    }
  }, [rewardedInterstitialAd.reward]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <ExampleGroup title="AdMob - Basic">
          <BannerAd
            size={BannerAdSize.BANNER}
            unitId={UNIT_ID_BANNER}
            onAdLoaded={() => console.log('Banner Ad loaded!')}
            ref={bannerRef}
          />
          <Button title="Reload" onPress={() => bannerRef.current?.loadAd()} />
        </ExampleGroup>
        <ExampleGroup title="Adaptive Banner">
          <BannerAd
            size={BannerAdSize.ADAPTIVE_BANNER}
            unitId={UNIT_ID_BANNER}
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
          <BannerAd
            size={BannerAdSize.BANNER}
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
        </ExampleGroup>
        <ExampleGroup title="Rewarded">
          <Button
            title="Show Rewarded Video and preload next"
            disabled={!rewardedAd.adLoaded}
            onPress={() => rewardedAd.show()}
          />
        </ExampleGroup>
        <ExampleGroup title="Interstitial">
          <Button
            title="Show Interstitial and preload next"
            disabled={!interstitalAd.adLoaded}
            onPress={() => interstitalAd.show()}
          />
        </ExampleGroup>
        <ExampleGroup title="RewardedInterstitial">
          <Button
            title="Show Rewarded Interstitial Video and preload next"
            disabled={!rewardedInterstitialAd.adLoaded}
            onPress={() => setModalVisible(true)}
          />
        </ExampleGroup>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
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
    </View>
  );
}

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { adDismissed } = useAppOpenAd(initialized ? UNIT_ID_APP_OPEN : null, {
    showOnColdStart: true,
  });

  useEffect(() => {
    const initAdmob = async () => {
      await AdMob.initialize();
      setInitialized(true);
    };
    const load = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setLoaded(true);
    };

    initAdmob();
    load();
  }, []);

  useEffect(() => {
    if (initialized && loaded && adDismissed) {
      RNBootSplash.hide({ fade: true });
    }
  }, [initialized, loaded, adDismissed]);

  return initialized && loaded && adDismissed ? <Example /> : <View />;
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
