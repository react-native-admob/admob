import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { useAppOpenAd } from '@react-native-admob/admob';

import { usePaidState } from '../PaidProvider';

interface AppOpenAdExampleProps {
  onSplashDismissed: () => void;
}

const AppOpenAdExample = ({ onSplashDismissed }: AppOpenAdExampleProps) => {
  const [loaded, setLoaded] = useState(false);
  const { adDismissed, adLoadError } = useAppOpenAd();
  const { isPaid } = usePaidState();

  useEffect(() => {
    const load = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setLoaded(true);
    };
    load();
  }, []);

  useEffect(() => {
    async function hide() {
      await RNBootSplash.hide({ fade: true });
      onSplashDismissed();
    }
    if (isPaid || (loaded && (adDismissed || adLoadError))) {
      hide();
    }
  }, [loaded, adDismissed, adLoadError, onSplashDismissed, isPaid]);

  return <View />;
};

export default AppOpenAdExample;
