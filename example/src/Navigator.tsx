import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import AppOpenAdExample from './examples/AppOpenAdExample';
import ExamplesScreen from './screens/ExamplesScreen';
import SecondScreen from './screens/SecondScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigator() {
  const [splashDismissed, setSplashDismissed] = useState(false);

  return (
    <NavigationContainer>
      {splashDismissed ? (
        <Stack.Navigator initialRouteName="Examples">
          <Stack.Screen name="Examples" component={ExamplesScreen} />
          <Stack.Screen name="Second" component={SecondScreen} />
        </Stack.Navigator>
      ) : (
        <AppOpenAdExample onSplashDismissed={() => setSplashDismissed(true)} />
      )}
    </NavigationContainer>
  );
}

export type RootStackParamList = {
  Examples: undefined;
  Second: undefined;
};

export type RootStackNavigationProps<
  T extends keyof RootStackParamList = 'Examples'
> = NativeStackNavigationProp<RootStackParamList, T>;
