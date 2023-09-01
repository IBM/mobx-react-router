import { observe } from 'mobx';

export const syncHistoryWithStore = (history, store) => {
  // Initialise store
  store.history = history;

  // Handle update from history object
  const handleLocationChange = (history) => {
    store._updateLocation(history.location);
  };

  const unsubscribeFromHistory = history.listen(handleLocationChange);
  handleLocationChange(history);

  const subscribe = (listener) => {
    const onStoreChange = () => {
      const rawLocation = { ...store.location };
      listener(rawLocation, history.action);
    };

    // Listen for changes to location state in store
    const unsubscribeFromStore = observe(store, 'location', onStoreChange);

    listener(store.location, history.action);

    return unsubscribeFromStore;
  };

  history.subscribe = subscribe;
  history.unsubscribe = unsubscribeFromHistory;

  return history;
};
