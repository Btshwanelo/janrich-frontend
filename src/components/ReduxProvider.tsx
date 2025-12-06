'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useEffect } from 'react';
import { store, persistor } from '../lib/store';
import { syncAuthFromLocalStorage } from '../lib/slices/authSlice';

interface ReduxProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  // Sync localStorage to cookie on mount and when store rehydrates
  useEffect(() => {
    // Initial sync
    syncAuthFromLocalStorage();

    // Subscribe to store changes to sync auth state
    const unsubscribe = store.subscribe(() => {
      syncAuthFromLocalStorage();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={() => {
          // Sync after rehydration
          syncAuthFromLocalStorage();
        }}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
