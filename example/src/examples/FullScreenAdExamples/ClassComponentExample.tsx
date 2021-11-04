/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import { Button } from 'react-native';
import { InterstitialAd, TestIds } from '@react-native-admob/admob';
import { useNavigation } from '@react-navigation/native';

import ExampleGroup from '../../components/ExampleGroup';
import { RootStackNavigationProps } from '../../Navigator';
import { usePaidState } from '../../PaidProvider';

interface State {
  adLoaded: boolean;
  interstitialAd: InterstitialAd | null;
}

interface Props {
  navigation: RootStackNavigationProps<'Examples'>;
  isPaid: boolean;
}

class ClassComponentExample extends React.Component<Props, State> {
  state: State = {
    adLoaded: false,
    interstitialAd: this.props.isPaid ? null : this.createAd(),
  };
  createAd() {
    const ad = InterstitialAd.createAd(TestIds.INTERSTITIAL_VIDEO, {
      loadOnDismissed: true,
      requestOptions: {
        requestNonPersonalizedAdsOnly: true,
      },
    });
    ad.addEventListener('adLoaded', () => {
      this.setState({ adLoaded: true });
    });
    ad.addEventListener('adDismissed', () => {
      this.navigateToSecondScreen();
    });
    return ad;
  }

  navigateToSecondScreen = () => this.props.navigation.navigate('Second');

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.isPaid !== prevProps.isPaid) {
      this.setState({
        interstitialAd: this.props.isPaid ? null : this.createAd(),
      });
    }
    if (this.state.interstitialAd !== prevState.interstitialAd) {
      this.setState({ adLoaded: false });
      prevState.interstitialAd?.destroy();
    }
  }

  componentWillUnmount() {
    this.state.interstitialAd?.destroy();
  }

  render() {
    return (
      <ExampleGroup title="Interstitial">
        <Button
          title="Show Interstitial Ad and move to next screen"
          onPress={() => {
            if (this.state.adLoaded) {
              this.state.interstitialAd?.show();
            } else {
              this.navigateToSecondScreen();
            }
          }}
        />
      </ExampleGroup>
    );
  }
}

export default function () {
  const navigation = useNavigation<RootStackNavigationProps<'Examples'>>();
  const { isPaid } = usePaidState();
  return <ClassComponentExample navigation={navigation} isPaid={isPaid} />;
}
