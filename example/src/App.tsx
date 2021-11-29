import React from 'react';

import Navigator from './Navigator';
import PaidProvider from './PaidProvider';

function App() {
  return (
    <PaidProvider>
      <Navigator />
    </PaidProvider>
  );
}

export default App;
