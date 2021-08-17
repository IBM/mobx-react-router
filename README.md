# mobx-react-router

## Note 2021-8-16 update v7 for compatible with history v5

Api changed a lot, please read this.

Keep your MobX state in sync with react-router via a `RouterStore`.

Router location state is **observable**, so any references to it in `MobX`
components will cause the component to re-render when the location changes.

Very much inspired by (and copied from) [react-router-redux](https://github.com/reactjs/react-router-redux/tree/master).

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [RouterStore](#routerstore)

V7 is for use with **react-router v5**.

## Installation

```sh
npm install --save @superwf/mobx-react-router
```

```sh
npm install --save mobx mobx-react react-router
```

## Usage

`index.js`

```js
import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';
import { Router } from 'react-router';
import App from './App';

const browserHistory = createBrowserHistory();
const router = new RouterStore(browserHistory);

const stores = {
  // Key can be whatever you want
  routing: router,
  // ...other stores
};

ReactDOM.render(
  <Provider {...stores}>
    <Router history={router.history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
```

`App.js`

```js
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('router')
@observer
export default class App extends Component {
  render() {
    const { location, push, back } = this.props.router;

    return (
      <div>
        <span>Current pathname: {location.pathname}</span>
        <button onClick={() => push('/test')}>Change url</button>
        <button onClick={() => back()}>Go Back</button>
      </div>
    );
  }
}
```

## API

### RouterStore

```js
const browserHistory = createBrowserHistory();
const store = new RouterStore(browserHistory);
```

A **router store** instance has the following properties:

- `location` (*observable*) - history [location object](https://github.com/mjackson/history#listening)
- `history` - raw [history API](https://github.com/mjackson/history#properties) object

And the following [history methods](https://github.com/mjackson/history#navigation):

- **push(*path*)**
- **replace(*path*)**
- **go(*n*)**
- **back()**
- **forward()**

- `history` - A variant of a history object, usually `browserHistory`
- `store` - An instance of `RouterStore`

returns an *enhanced* history object with the following **additional methods**:

- **subscribe(*listener*)**  
Subscribes to any changes in the store's `location` observable  
**Returns** an unsubscribe function which destroys the listener

```js
const unsubscribeFromStore = router.subscribe(({ location, action }) => console.log(location.pathname));

history.push('/test1');
unsubscribeFromStore();
history.push('/test2');

// Logs
// 'test1'
```

- **unsubscribe()**  
Un-syncs the store from the history.
The store will **no longer update** when the history changes

```js
history.stopSyncWithHistory();
// Store no longer updates
```
