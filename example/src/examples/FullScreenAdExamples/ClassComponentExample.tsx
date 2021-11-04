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
      this.props.navigation.navigate('Second');
    });
    return ad;
  }
  createAndSetAd() {
    this.setState({ interstitialAd: this.createAd() });
  }
  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.isPaid && !prevProps.isPaid) {
      this.createAndSetAd();
    }
    if (this.state.interstitialAd !== prevState.interstitialAd) {
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
          disabled={!this.state.adLoaded}
          onPress={() => {
            if (this.props.isPaid) {
              this.props.navigation.navigate('Second');
            } else {
              this.state.interstitialAd?.show();
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
