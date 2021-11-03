import React, { useEffect, useState } from 'react';
import { Button } from 'react-native';
import {
  FullScreenAdOptions,
  TestIds,
  useRewardedInterstitialAd,
} from '@react-native-admob/admob';
import { useNavigation } from '@react-navigation/core';

import { RootStackNavigationProps } from '../../App';
import CountDownModal from '../../components/CountDownModal';
import ExampleGroup from '../../components/ExampleGroup';

const hookOptions: FullScreenAdOptions = {
  loadOnDismissed: true,
  requestOptions: {
    requestNonPersonalizedAdsOnly: true,
  },
};

const FunctionComponentExample = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { adLoaded, adDismissed, reward, show } = useRewardedInterstitialAd(
    TestIds.REWARDED_INTERSTITIAL,
    hookOptions
  );
  const navigation = useNavigation<RootStackNavigationProps<'Examples'>>();

  useEffect(() => {
    if (adDismissed) {
      setModalVisible(false);
      navigation.navigate('Second');
    }
  }, [adDismissed, navigation]);

  useEffect(() => {
    if (reward) {
      console.log('Reward earned from Rewarded Interstitial Ad: ');
      console.log(reward);
    }
  }, [reward]);

  return (
    <>
      <ExampleGroup title="Rewarded Interstitial">
        <Button
          title="Show Rewarded Interstitial Ad and move to next screen"
          disabled={!adLoaded}
          onPress={() => setModalVisible(true)}
        />
      </ExampleGroup>
      {modalVisible && (
        <CountDownModal
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            navigation.navigate('Second');
          }}
          onTimeout={show}
        />
      )}
    </>
  );
};

export default FunctionComponentExample;
