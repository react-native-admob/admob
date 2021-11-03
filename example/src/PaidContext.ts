import React from 'react';

interface PaidContextProps {
  isPaid: boolean;
  onPaidChange: (isPaid: boolean) => void;
}

const PaidContext = React.createContext<PaidContextProps>({
  isPaid: false,
  onPaidChange: () => {},
});

export default PaidContext;
