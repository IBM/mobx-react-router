// Type definitions for mobx-react-router 4.0
// Project: https://github.com/alisd23/mobx-react-router

import { LocationDescriptor, History, UnregisterCallback, Location } from 'history';

declare namespace MobxReactRouter {

  export interface SynchronizedHistory extends History {
    unsubscribe?: UnregisterCallback;
  }

  export class RouterStore {
    location: Location;
    history: SynchronizedHistory;
    push(path: string): void;
    push(location: LocationDescriptor): void;
    replace(path: string): void;
    replace(location: LocationDescriptor): void;
    go(n: number): void;
    goBack(): void;
    goForward(): void;
  }

  export function syncHistoryWithStore(history: History, store: RouterStore): SynchronizedHistory;
}

export = MobxReactRouter;
