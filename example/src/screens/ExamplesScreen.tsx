import React from 'react';
import { Button, SafeAreaView, ScrollView } from 'react-native';

import BannerAdExample from '../examples/BannerAdExample';
import ClassApiExample from '../examples/FullScreenAdExamples/ClassApiExample';
import HookApiExample from '../examples/FullScreenAdExamples/HookApiExample';
import { usePaidDispatch, usePaidState } from '../PaidProvider';

const ExamplesScreen = () => {
  const { isPaid } = usePaidState();
  const dispatch = usePaidDispatch();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView>
        <BannerAdExample />
        <ClassApiExample />
        <HookApiExample />
        <Button
          title={`${isPaid ? 'En' : 'Dis'}able Ads`}
          onPress={() => dispatch({ type: 'TOGGLE_PAID' })}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExamplesScreen;
