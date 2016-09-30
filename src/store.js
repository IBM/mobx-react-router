import { observable, action } from 'mobx';

export class RouterStore {
  @observable
  locationBeforeTransitions = null;

  constructor(history) {
    this.history = history;
  }

  @action
  updateLocation(newState) {
    const state = this.locationBeforeTransitions;
    this.locationBeforeTransitions = { ...state, ...newState };
  }

  push(location) {
    this.history.push(location);
  }
};
