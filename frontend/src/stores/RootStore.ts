import { createContext, useContext } from 'react';
import { AuthStore } from './AuthStore';

export class RootStore {
  authStore: AuthStore;

  constructor() {
    this.authStore = new AuthStore();
  }
}

export const rootStore = new RootStore();
export const RootStoreContext = createContext(rootStore);

export const useStore = () => {
  const context = useContext(RootStoreContext);
  if (!context) {
    throw new Error('useStore must be used within a RootStoreProvider');
  }
  return context;
};

