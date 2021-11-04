import React from 'react';
import { Button, SafeAreaView, ScrollView } from 'react-native';

import BannerAdExample from '../examples/BannerAdExample';
import ClassComponentExample from '../examples/FullScreenAdExamples/ClassComponentExample';
import FunctionComponentExample from '../examples/FullScreenAdExamples/FunctionComponentExample';
import { usePaidDispatch, usePaidState } from '../PaidProvider';

const ExamplesScreen = () => {
  const { isPaid } = usePaidState();
  const dispatch = usePaidDispatch();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView>
        <BannerAdExample />
        <ClassComponentExample />
        <FunctionComponentExample />
        <Button
          title={`${isPaid ? 'En' : 'Dis'}able Ads`}
          onPress={() => dispatch({ type: 'TOGGLE_PAID' })}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExamplesScreen;
