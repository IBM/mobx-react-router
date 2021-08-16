import type { History, Listener, State } from 'history'

type UnregisterCallback = ReturnType<History['listen']>

export interface SynchronizedHistory extends History {
  subscribe: (listener: Listener<State>) => UnregisterCallback
  unsubscribe: UnregisterCallback
}
