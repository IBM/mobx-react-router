// Type definitions for mobx-react-router 3.1
// Project: https://github.com/alisd23/mobx-react-router

declare namespace MobxReactRouter {

  export type Action = 'POP' | 'PUSH' | 'REPLACE';
  export type TransitionHook = (location: Location, callback: (result: any) => void) => any;
  export type LocationListener = (location: Location) => void;
  export type UnsubscribeCallback = () => any;
  export type ListenerLike = (...args: any[]) => any;

  export interface HistoryLike {
    push(path: any): any;
    replace(path: any): any;
    go(n: number): any;
    goBack(): any;
    goForward(): any;
    listen(listener: ListenerLike): UnsubscribeCallback;
  }

  export interface History {
    listenBefore(hook: TransitionHook): UnsubscribeCallback;
    listen(listener: LocationListener): UnsubscribeCallback;
    transitionTo(location: Location): void;
    push(path: string): void;
    push(location: LocationDescriptor): void;
    replace(path: string): void;
    replace(location: LocationDescriptor): void;
    go(n: number): void;
    goBack(): void;
    goForward(): void;
    createKey(): string;
    createPath(path: string): string;
    createPath(location: LocationDescriptor): string;
    createHref(path: string): string;
    createHref(location: LocationDescriptor): string;
    createLocation(path: string, action?: Action, key?: string): Location;
    createLocation(location: LocationDescriptor): Location;
    getCurrentLocation: () => Location;

    /** @deprecated */
    setState(path: string): void;
    /** @deprecated */
    setState(location: LocationDescriptor): void;
    /** @deprecated use push() instead */
    pushState(path: string): void;
    /** @deprecated use push() instead */
    pushState(location: LocationDescriptor): void;
    /** @deprecated use replace() instead */
    replaceState(path: string): void;
    /** @deprecated use replace() instead */
    replaceState(location: LocationDescriptor): void;
    /** @deprecated */
    registerTransitionHook(hook: TransitionHook): UnsubscribeCallback;
    /** @deprecated */
    unregisterTransitionHook(hook: TransitionHook): void;
  }

  export interface Location {
    pathname: string;
    search: string;
    action: string;
    key: string;
    state: any;
    query: any;
    hash?: string;
    basename?: string;
  }

  export interface LocationDescriptor {
    pathname?: string;
    search?: string;
    action?: string;
    state?: any;
    hash?: string;
    key?: string;
  }

  export interface SynchronizedHistory extends History {
    unsubscribe?: UnsubscribeCallback;
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

  export function syncHistoryWithStore(history: HistoryLike, store: RouterStore): SynchronizedHistory;
}

export = MobxReactRouter;
