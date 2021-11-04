import React, { createContext, Dispatch, useContext, useReducer } from 'react';

interface State {
  isPaid: boolean;
}

type Action = { type: 'TOGGLE_PAID' };

const PaidStateContext = createContext<State>({
  isPaid: false,
});
const PaidDispatchContext = createContext<Dispatch<Action>>(() => null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TOGGLE_PAID':
      return {
        isPaid: !state.isPaid,
      };
    default:
      throw new Error('Unhandled action');
  }
}

export default function PaidProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, {
    isPaid: false,
  });

  return (
    <PaidStateContext.Provider value={state}>
      <PaidDispatchContext.Provider value={dispatch}>
        {children}
      </PaidDispatchContext.Provider>
    </PaidStateContext.Provider>
  );
}

export function usePaidState() {
  const state = useContext(PaidStateContext);
  return state;
}

export function usePaidDispatch() {
  const dispatch = useContext(PaidDispatchContext);
  return dispatch;
}
