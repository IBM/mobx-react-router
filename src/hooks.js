import { createContext, useContext, useState, useEffect } from 'react';
import { reaction } from 'mobx';

export const RouterStoreContext = createContext(null);

export const RouterStoreProvider = RouterStoreContext.Provider;

export const useRouterStore = () => {
  const store = useContext(RouterStoreContext);
  if (!store) throw new Error('useRouterStore must be used within RouterStoreContext.Provider');
  return store;
};

export const useLocation = () => {
  const store = useRouterStore();
  const [location, setLocation] = useState(() => store.location);

  useEffect(() => reaction(
    () => store.location,
    setLocation
  ), [store]);

  return location;
};
