import { makeAutoObservable } from 'mobx';

export class RouterStore {
  location = null;

  history = null;

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  _updateLocation(newState) {
    this.location = newState;
  }

  /*
   * History methods
   */
  push(location, state) {
    this.history.push(location, state);
  };

  replace(location, state) {
    this.history.replace(location, state);
  };

  go(iState) {
    this.history.go(iState);
  };

  back() {
    this.history.back();
  };

  forward() {
    this.history.forward();
  };
};
