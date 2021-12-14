import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-native';
import {
  FullScreenAdOptions,
  TestIds,
  useRewardedInterstitialAd,
} from '@react-native-admob/admob';
import { useNavigation } from '@react-navigation/core';

import CountDownModal from '../../components/CountDownModal';
import ExampleGroup from '../../components/ExampleGroup';
import { RootStackNavigationProps } from '../../Navigator';

const hookOptions: FullScreenAdOptions = {
  loadOnDismissed: true,
  requestOptions: {
    requestNonPersonalizedAdsOnly: true,
    serverSideVerificationOptions: {
      userId: '123',
    },
  },
};

const HookApiExample = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { adLoaded, adDismissed, reward, show, adLoadError } =
    useRewardedInterstitialAd(TestIds.REWARDED_INTERSTITIAL, hookOptions);
  const navigation = useNavigation<RootStackNavigationProps<'Examples'>>();

  const navigateToSecondScreen = useCallback(
    () => navigation.navigate('Second'),
    [navigation]
  );

  useEffect(() => {
    if (adDismissed) {
      setModalVisible(false);
      navigateToSecondScreen();
    }
  }, [adDismissed, navigateToSecondScreen]);

  useEffect(() => {
    if (reward) {
      console.log('Reward earned from Rewarded Interstitial Ad: ');
      console.log(reward);
    }
  }, [reward]);

  useEffect(() => {
    if (adLoadError) {
      const { code, message } = adLoadError;
      console.log(`Ad failed to load with code ${code} - ${message}`);
    }
  }, [adLoadError]);

  return (
    <>
      <ExampleGroup title="Rewarded Interstitial">
        <Button
          title="Show Rewarded Interstitial Ad and move to next screen"
          onPress={() => {
            if (adLoaded) {
              setModalVisible(true);
            } else {
              navigateToSecondScreen();
            }
          }}
        />
      </ExampleGroup>
      {modalVisible && (
        <CountDownModal
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            navigateToSecondScreen();
          }}
          onTimeout={show}
        />
      )}
    </>
  );
};

export default HookApiExample;
