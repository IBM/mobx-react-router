import { observe } from 'mobx';

export const syncHistoryWithStore = (history, store) => {
  const getStoreLocation = () => {
    return store.locationBeforeTransitions;
  };

  // Handle update from history object
  const handleLocationChange = (location) => {
    store._updateLocation(location);
  };

  const unsubscribeFromHistory = history.listen(handleLocationChange);

  return {
    ...history,
    // User can subscribe to history changes
    listen(listener) {
      let lastLocation = getStoreLocation();
      let unsubscribed = false;

      const onStoreChange = (change) => {
        const currentLocation = getStoreLocation();
        if (currentLocation === lastLocation) {
          return;
        }
        lastLocation = currentLocation;
        if (!unsubscribed) {
          listener(lastLocation);
        }
      };

      // Listen for changes to location state in store
      const unsubscribeFromStore = observe(
        getStoreLocation(),
        onStoreChange,
        invokeImmediately
      );

      listener(lastLocation);

      return () => {
        unsubscribed = true;
        unsubscribeFromStore();
      };
    },

    // Provide way to unsubscribe from store AND history
    unsubscribe() {
      unsubscribeFromHistory();
      unsubscribeFromStore();
    }
  };
};
