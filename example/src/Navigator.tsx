import React, { useState } from 'react';
import { AppOpenAdProvider, TestIds } from '@react-native-admob/admob';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import AppOpenAdExample from './examples/AppOpenAdExample';
import ExamplesScreen from './screens/ExamplesScreen';
import SecondScreen from './screens/SecondScreen';
import { usePaidState } from './PaidProvider';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigator() {
  const [splashDismissed, setSplashDismissed] = useState(false);
  const { isPaid } = usePaidState();

  return (
    <AppOpenAdProvider
      unitId={isPaid ? null : TestIds.APP_OPEN}
      options={{ showOnColdStart: true, loadOnDismissed: splashDismissed }}
    >
      <NavigationContainer>
        {splashDismissed ? (
          <Stack.Navigator initialRouteName="Examples">
            <Stack.Screen name="Examples" component={ExamplesScreen} />
            <Stack.Screen name="Second" component={SecondScreen} />
          </Stack.Navigator>
        ) : (
          <AppOpenAdExample
            onSplashDismissed={() => setSplashDismissed(true)}
          />
        )}
      </NavigationContainer>
    </AppOpenAdProvider>
  );
}

export type RootStackParamList = {
  Examples: undefined;
  Second: undefined;
};

export type RootStackNavigationProps<
  T extends keyof RootStackParamList = 'Examples'
> = NativeStackNavigationProp<RootStackParamList, T>;
