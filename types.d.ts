// Type definitions for mobx-react-router 4.0
// Project: https://github.com/alisd23/mobx-react-router

import { History, Location, UnregisterCallback } from 'history';

declare namespace MobxReactRouter {

  export interface SynchronizedHistory extends History {
    unsubscribe?: UnregisterCallback;
  }

  export class RouterStore {
    history?: SynchronizedHistory;
    location?: Location;
  }

  export interface RouterStore extends Pick<History, 'push' | 'replace' | 'go' | 'goBack' | 'goForward'> { }

  export function syncHistoryWithStore(history: History, store: RouterStore): SynchronizedHistory;
}

export = MobxReactRouter;
