import type { History, Update, State } from 'history'
// import { Action } from 'history'
import { observe } from 'mobx'
import type { SynchronizedHistory } from './type'

import type { RouterStore } from './store'

export const syncHistoryWithStore = (history: History, store: RouterStore) => {
  // Initialise store
  store.history = history
  store.push = history.push.bind(history)
  store.replace = history.replace.bind(history)
  store.go = history.go.bind(history)
  store.back = history.back.bind(history)
  store.forward = history.forward.bind(history)

  // Handle update from history object
  const handleLocationChange = (update: Update<State>) => {
    store.updateState(update)
  }

  const unsubscribeFromHistory = history.listen(handleLocationChange)
  handleLocationChange({
    action: history.action,
    location: history.location
  })

  const subscribe: SynchronizedHistory['subscribe'] = listener => {
    // Listen for changes to location state in store
    const unsubscribeFromStore = observe(store, 'state', ({ newValue }) => {
      const state = newValue as Update<State>
      listener(state)
    })

    listener(store.state)

    return unsubscribeFromStore
  }

  store.subscribe = subscribe
  store.stopSyncWithHistory = unsubscribeFromHistory

  return store
}
