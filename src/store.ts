import type { History, Location, Listener, Update, State } from 'history'
import { Action } from 'history'
import { observable, action, makeObservable } from 'mobx'

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

  public location: Location<State> = {
    key: 'default',
    pathname: '',
    search: '',
    state: {},
    hash: ''
  }

  constructor() {
    makeObservable(this, {
      location: observable
    })
  }

  public updateState = action((newState: Update<State>) => {
    this.state = newState
    this.location = newState.location
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
