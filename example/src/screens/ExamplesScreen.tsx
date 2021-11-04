import React from 'react';
import { Button, SafeAreaView, ScrollView } from 'react-native';

import BannerAdExample from '../examples/BannerAdExample';
import ClassComponentExample from '../examples/FullScreenAdExamples/ClassComponentExample';
import FunctionComponentExample from '../examples/FullScreenAdExamples/FunctionComponentExample';
import PaidContext from '../PaidContext';

const ExamplesScreen = () => {
  const { isPaid, onPaidChange } = React.useContext(PaidContext);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView>
        <BannerAdExample />
        <ClassComponentExample />
        <FunctionComponentExample />
        <Button
          title={`${isPaid ? 'En' : 'Dis'}able Ads`}
          onPress={() => onPaidChange(!isPaid)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExamplesScreen;
