// Type definitions for mobx-react-router 4.0
// Project: https://github.com/alisd23/mobx-react-router

import { History, Location, Listener } from 'history';

declare namespace MobxReactRouter {

  type UnregisterCallback = () => void

  export interface SynchronizedHistory extends History {
    subscribe: (listener: Listener) => UnregisterCallback;
    unsubscribe?: UnregisterCallback;
  }

  export class RouterStore {
    history: History;
    location: Location;
  }

  export interface RouterStore extends Pick<History, 'push' | 'replace' | 'go' | 'back' | 'forward'> { }

  export function syncHistoryWithStore(history: History, store: RouterStore): SynchronizedHistory;
}

export = MobxReactRouter;
