import { observable, action } from 'mobx';

export class RouterStore {
  @observable accessor location = null;

  history = null;

  @action
  _updateLocation(newState) {
    this.location = newState;
  }

  /*
   * History methods
   */
  @action.bound push = (location, state) => {
    this.history.push(location, state);
  };

  @action.bound replace = (location, state) => {
    this.history.replace(location, state);
  };

  @action.bound go = (iState) => {
    this.history.go(iState);
  };

  @action.bound back = () => {
    this.history.back();
  };

  @action.bound forward = () => {
    this.history.forward();
  };
};
