import { observe } from 'mobx';

export const syncHistoryWithStore = (history, store) => {
  const getStoreLocation = () => {
    return store.location;
  };

  // Initialise store
  store.history = history;
  store._updateLocation(history.getCurrentLocation());

  // Handle update from history object
  const handleLocationChange = (location) => {
    store._updateLocation(location);
  };

  const unsubscribeFromHistory = history.listen(handleLocationChange);

  return {
    ...history,
    // User can subscribe to history changes
    listen(listener) {
      const onStoreChange = (change) => {
        listener(getStoreLocation());
      };

      // Listen for changes to location state in store
      const unsubscribeFromStore = observe(store, 'location', onStoreChange);

      listener(getStoreLocation());

      return () => {
        unsubscribeFromStore();
      };
    },

    // Provide way to unsubscribe from history
    unsubscribe() {
      unsubscribeFromHistory();
    }
  };
};
