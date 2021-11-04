import React from 'react';
import { AppOpenAdProvider, TestIds } from '@react-native-admob/admob';

import Navigator from './Navigator';
import { usePaidState } from './PaidProvider';
import PaidProvider from './PaidProvider';

function App() {
  const { isPaid } = usePaidState();

  return (
    <AppOpenAdProvider
      unitId={isPaid ? null : TestIds.APP_OPEN}
      options={{ showOnColdStart: true }}
    >
      <Navigator />
    </AppOpenAdProvider>
  );
}

export default () => (
  <PaidProvider>
    <App />
  </PaidProvider>
);
