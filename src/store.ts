import type { History, Listener, Update, State } from 'history'
import { Action } from 'history'
import { observable, computed, action, makeObservable } from 'mobx'

type UnregisterCallback = ReturnType<History['listen']>

export class RouterStore {
  public history: History

  public state: Update<State> = {
    action: Action.Pop,
    location: {
      key: 'default',
      pathname: '',
      search: '',
      state: {},
      hash: ''
    }
  }

  public get location() {
    return this.state.location
  }

  constructor(history: History) {
    this.history = history
    this.push = history.push.bind(history)
    this.replace = history.replace.bind(history)
    this.go = history.go.bind(history)
    this.back = history.back.bind(history)
    this.forward = history.forward.bind(history)
    makeObservable(this, {
      state: observable,
      location: computed
    })

    /**
    * Listen for changes to location state in store
    * and run listener at once
    */
    this.subscribe = listener => {
      const unlisten = history.listen(listener)
      console.log(unlisten)

      listener({
        action: history.action,
        location: history.location
      })

      return () => {
        console.log('unlisten')
        unlisten()
      }
    }

    this.stopSyncWithHistory = this.subscribe(state => this.updateState(state))
  }

  public updateState = action((newState: Update<State>) => {
    this.state = {
      action: newState.action,
      location: { ...newState.location }
    }
  })

  /*
   * History methods
   */
  public push: History['push']
  public replace: History['replace']
  public go: History['go']
  public back: History['back']
  public forward: History['forward']

  subscribe: (listener: Listener<State>) => UnregisterCallback
  stopSyncWithHistory: UnregisterCallback
}
