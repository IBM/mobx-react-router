# mobx-react-router
Keep your MobX state in sync with react-router via a `RouterStore`.

Router location state is **observable**, so any references to it in `MobX` components will cause the component to re-render when the location changes.

Very much inspired by (and copied from) [react-router-redux](https://github.com/reactjs/react-router-redux/tree/master/test).

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [RouterStore](#routerstore)
  - [syncHistoryWithStore](#synchistorywithstorehistory-store)

I have decided to support `react-router v3` as a **minimum**, so `mobx-react-router` has a peer dependency of that version.
Upgrading a project from `v2` to `v3` should be fairly trivial, so I feel there is no reason to support `v2` anymore.

## Installation

For use with **react-router v3** *(most recent stable version)*.

```
npm install mobx-react-router --save
```

## Usage

`index.js`
```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router, Route, browserHistory } from 'react-router';
import App from './App';

const routingStore = new RouterStore();

const stores = {
  // Key can be whatever you want
  routing: routingStore,
  // ...other stores
};

const history = syncHistoryWithStore(browserHistory, routingStore);

ReactDOM.render(
  <Provider {...stores}>
    <Router history={history}>
      <Route path='/' component={App} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
```

`App.js`
```js
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('routing')
@observer
export default class App extends Component {
  render() {
    const { location, push, goBack } = this.props.routing;

    return (
      <div>
        <span>Current pathname: {location.pathname}</span>
        <button onClick={() => push('/test')}>Change url</button>
        <button onClick={() => goBack()}>Go Back</button>
      </div>
    );
  }
}
```

## API

### RouterStore

```js
const store = new RouterStore();
```

A **router store** instance has the following properties:

- `location` (*observable*) - history [location object](https://github.com/mjackson/history#listening)
- `history` - raw [history API](https://github.com/mjackson/history#properties) object

And the following [history methods](https://github.com/mjackson/history#navigation):

- **push(*path*)**
- **replace(*path*)**
- **go(*n*)**
- **goBack()**
- **goForward()**

### syncHistoryWithStore(*history*, *store*)

- `history` - A variant of a history object, usually `browserHistory`
- `store` - An instance of `RouterStore`

returns an *enhanced* history object with the following **additional methods**:

- **listen(*listener*)**  
Listen to any changes in the store's `location` observable  
**Returns** an unsubscribe function which destroys the listener
```js
const unsubscribeFromStore = history.listen(location => console.log(location.pathname));

history.push('/test1');
unsubscribeFromStore();
history.push('/test2');

// Logs
// 'test1'
```

- **unsubscribe()**  
Un-syncs the store from the history. The store will **no longer update** when the history changes

```js
history.unsubscribe();
// Store no longer updates
```
