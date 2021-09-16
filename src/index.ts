/* eslint-disable no-param-reassign */
import type { History, Listener, State, Update } from 'history'
import { Action } from 'history'
import { action, computed, makeObservable, observable } from 'mobx'
import { match } from 'path-to-regexp'

type UnregisterCallback = ReturnType<History['listen']>

export class RouterStore {
  public pathList: string[] = []

  public history: History

  public state: Update<State> = {
    action: Action.Pop,
    location: {
      key: 'default',
      pathname: '',
      search: '',
      state: {},
      hash: '',
    },
  }

  /** @readonly */
  public get location(): Update<State>['location'] {
    return this.state.location
  }

  constructor(history: History) {
    this.history = history
    this.push = history.push.bind(history)
    this.replace = history.replace.bind(history)
    this.go = history.go.bind(history)

    // compatible with old history api
    const back = history.back.bind(history)
    const forward = history.forward.bind(history)
    this.back = back
    this.forward = forward

    makeObservable(this, {
      state: observable,
      location: computed,
      query: computed,
      pathList: observable,
      hashValue: computed,
      pathValue: computed,
      appendPathList: action,
      prependPathList: action,
    })

    /**
     * Listen for changes to location state in store
     * and run listener at once
     */
    this.subscribe = listener => {
      const unlisten = history.listen(listener)

      listener({
        action: history.action,
        location: history.location,
      })

      return unlisten
    }

    this.stopSyncWithHistory = this.subscribe(this.updateState)
  }

  public updateState = action((newState: Update<State>) => {
    this.state = {
      action: newState.action,
      location: { ...newState.location },
    }
  })

  /**
   * get query format from location.search
   * @readonly
   * */
  public get query(): Record<string, any> {
    const { search } = this.location
    const query: Record<string, any> = {}
    if (search) {
      const searchParam = new URLSearchParams(search)
      searchParam.forEach((value, name) => {
        if (query[name]) {
          if (Array.isArray(query[name])) {
            query[name].push(value)
          } else {
            query[name] = [query[name], value]
          }
        } else {
          query[name] = value
        }
      })
    }
    return query
  }

  /**
   * get hash, not include '#'
   * @readonly
   * */
  public get hashValue(): any {
    const { hash } = this.location
    if (hash) {
      return hash.slice(1)
    }
    return ''
  }

  /**
   * get path variable value, example:
   * /path/:name => /path/abc
   * router.pathValue.name => ac
   *
   * @readonly
   * */
  public get pathValue(): Record<string, string> {
    const { pathname } = this.location
    let param = {}
    let hasPathValue = false
    this.pathList.find(path => {
      const matchResult = match(path!, { decode: decodeURIComponent })(pathname)
      if (matchResult && matchResult) {
        param = matchResult.params
        hasPathValue = true
      }
      return hasPathValue
    })
    return param
  }

  /**
   * append new path to router.pathList, like '/abc/:name'
   * Note: the pathList order will affect pathValue
   * */
  public appendPathList(...pathList: string[]): void {
    this.pathList.push(...pathList)
  }

  /**
   * preppend new path to router.pathList, like '/abc/:name'
   * Note: the pathList order will affect pathValue
   * */
  public prependPathList(...pathList: string[]): void {
    this.pathList.unshift(...pathList)
  }

  /*
   * History methods
   */
  public push: History['push']

  public replace: History['replace']

  public go: History['go']

  public back: History['back']

  public forward: History['forward']

  public goBack: History['back']

  public goForward: History['forward']

  subscribe: (listener: Listener<State>) => UnregisterCallback

  stopSyncWithHistory: UnregisterCallback
}
