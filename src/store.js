import { observable, action } from 'mobx';

export class RouterStore {
  @observable location = null;

  history = null;

  constructor() {
    this.push = this.push.bind(this);
    this.replace = this.replace.bind(this);
    this.go = this.go.bind(this);
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
  }

  @action
  _updateLocation(newState) {
    this.location = newState;
  }

  /*
   * History methods
   */
  push(location) {
    this.history.push(location);
  }
  replace(location) {
    this.history.replace(location);
  }
  go(n) {
    this.history.go(n);
  }
  goBack() {
    this.history.goBack();
  }
  goForward() {
    this.history.goForward();
  }
};
