# mobx-react-router
Keep your MobX state in sync with react-router via a `RouterStore`.

Router location state is **observable**, so any references to it in `MobX`
components will cause the component to re-render when the location changes.

Very much inspired by (and copied from) [react-router-redux](https://github.com/reactjs/react-router-redux/tree/master).

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [RouterStore](#routerstore)
  - [syncHistoryWithStore](#synchistorywithstorehistory-store)


This branch (master) is for use with **react-router v4**.

If you're looking for the bindings for use with react-router `v3` go to [the v3 branch](https://github.com/alisd23/mobx-react-router/tree/v3).


## Installation

```
npm install --save mobx-react-router
```

And if you haven't installed all the peer dependencies, you should probably do that now:

```bash
npm install --save mobx mobx-react react-router
```

## Usage

`index.js`
```js
import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router';
import App from './App';

const browserHistory = createBrowserHistory();
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

### Typescript

If you are using typescript - the built in typings for this project depend on
`@types/history`, so make sure you have them installed too.

## Troubleshooting

**Routes not updating correctly when URL changes**

There is a known issue with React Router 4 and MobX (and Redux) where "blocker" components like those
created by `@observer` (and `@connect` in Redux) block react router updates from propagating down the
component tree.

There is a React Router 4 documentation page for information on this issue:

https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md

To fix problems like this, try wrapping components which are being "blocked" with React Router's `withRouter` higher
order component should help, depending on the case.

Refer to the link above for more information on this solution, and some alternatives.


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

- **subscribe(*listener*)**  
Subscribes to any changes in the store's `location` observable  
**Returns** an unsubscribe function which destroys the listener
```js
const unsubscribeFromStore = history.subscribe((location, action) => console.log(location.pathname));

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
