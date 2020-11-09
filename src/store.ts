import type { History, Location } from 'history';
import { observable, action, makeObservable } from 'mobx';

import type { SynchronizedHistory } from './type';

export class RouterStore {
  public history: SynchronizedHistory

  public location: Location = {
    pathname: '',
    search: '',
    state: '',
    hash: ''
  }

  constructor() {
    makeObservable(this, {
      location: observable
    });
  }

  public updateLocation = action((newState: Location) => {
    this.location = newState;
  })

  /*
   * History methods
   */
  public push: History['push']
  public replace: History['replace']
  public go: History['go']
  public goBack: History['goBack']
  public goForward: History['goForward']
}
