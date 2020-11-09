import type { History, LocationListener, UnregisterCallback } from 'history';

export interface SynchronizedHistory extends History {
  subscribe: (listener: LocationListener) => UnregisterCallback
  unsubscribe: UnregisterCallback
}
