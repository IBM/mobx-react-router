import { observable, action } from 'mobx';

export class RouterStore {
  @observable location = null;

  history = null;

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
  go(number) {
    this.history.go(number);
  }
  goBack() {
    this.history.goBack();
  }
  goForward() {
    this.history.goForward();
  }
};
