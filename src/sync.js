import { observe } from 'mobx';

export const syncHistoryWithStore = (history, store) => {
  // Initialise store
  store.history = history;

  // Handle update from history object
  const handleLocationChange = (location) => {
    store._updateLocation(location);
  };

  const unsubscribeFromHistory = history.listen(handleLocationChange);
  handleLocationChange(history.location);

  const subscribe = (listener) => {
    const onStoreChange = (change) => {
      const rawLocation = { ...store.location };
      listener(rawLocation, history.action);
    };

    // Listen for changes to location state in store
    const unsubscribeFromStore = observe(store, 'location', onStoreChange);

    listener(store.location, history.action);

    return () => {
      unsubscribeFromStore();
    };
  };
  const unsubscribe = () => unsubscribeFromHistory();

  history.subscribe = subscribe;
  history.unsubscribe = unsubscribe;

  return history;
};
