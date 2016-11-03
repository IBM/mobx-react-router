import { observe } from 'mobx';

export const syncHistoryWithStore = (history, store) => {
  // Initialise store
  store.history = history;

  // Handle update from history object
  const handleLocationChange = (location) => {
    store._updateLocation(location);
  };

  const unsubscribeFromHistory = history.listen(handleLocationChange);
  handleLocationChange(history.getCurrentLocation());

  return {
    ...history,
    // User can subscribe to history changes
    listen(listener) {
      const onStoreChange = (change) => {
        listener(store.location);
      };

      // Listen for changes to location state in store
      const unsubscribeFromStore = observe(store, 'location', onStoreChange);

      listener(store.location);

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
