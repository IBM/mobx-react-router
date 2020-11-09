import type { History, Location, LocationListener } from 'history';
import { observe } from 'mobx';

import type { RouterStore } from './store';
import type { SynchronizedHistory } from './type';

export const syncHistoryWithStore = (history: History, store: RouterStore) => {
  // Initialise store
  store.history = history as SynchronizedHistory;
  store.push = history.push.bind(history);
  store.replace = history.replace.bind(history);
  store.go = history.go.bind(history);
  store.goBack = history.goBack.bind(history);
  store.goForward = history.goForward.bind(history);

  // Handle update from history object
  const handleLocationChange = (location: Location) => {
    store.updateLocation(location);
  };

  const unsubscribeFromHistory = history.listen(handleLocationChange);
  handleLocationChange(history.location);

  // type Listener = (l: History.LocationState, a: Action) => any

  const subscribe = (listener: LocationListener) => {
    // Listen for changes to location state in store
    const unsubscribeFromStore = observe(store, 'location', ({ newValue }) => {
      const rawLocation: Location = { ...(newValue as Location) };
      listener(rawLocation, history.action);
    });

    listener(store.location, history.action);

    return unsubscribeFromStore;
  };

  store.history.subscribe = subscribe;
  store.history.unsubscribe = unsubscribeFromHistory;

  return store.history;
};
