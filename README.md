# mobx-react-router

[![npm version](https://badge.fury.io/js/%40ibm%2Fmobx-react-router.svg)](https://www.npmjs.com/package/@ibm/mobx-react-router)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **⚠️ Important:** The NPM location of this repository has changed. Use `@ibm/mobx-react-router` instead of the deprecated `mobx-react-router`.

Keep your MobX state in sync with react-router via a `RouterStore`.

Router location state is **observable**, so any references to it in `MobX`
components will cause the component to re-render when the location changes.

Very much inspired by (and copied from) [react-router-redux](https://github.com/reactjs/react-router-redux/tree/master).

## Features

- 🔄 Keeps MobX state in sync with react-router
- 📦 Observable router location for automatic component re-renders
- 🎯 Simple API with familiar history methods (push, replace, go, back, forward)
- 📝 Full TypeScript support included
- ⚡ Compatible with React Router v6
- 🪝 Works with both class and functional components

## Why Use This?

If you're using MobX for state management in your React application, `mobx-react-router` provides seamless integration with react-router. Instead of managing routing state separately, you can:

- **Access routing state in MobX stores** - Use `location.pathname`, `location.search`, etc. in your business logic
- **Trigger navigation from stores** - Call `push()`, `replace()`, etc. directly from your MobX actions
- **Automatic re-renders** - Components automatically update when route changes, thanks to MobX observables
- **Centralized state** - Keep all application state, including routing, in one place

## Prerequisites

- **React** 16.8 or higher
- **MobX** 6.3.2 or higher
- **React Router** 6.14.2 or higher

> **Note:** This branch (master) is for use with **react-router v6**. For react-router v5, check the [v5 branch](https://github.com/IBM/mobx-react-router/tree/v5).

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [RouterStore](#routerstore)
  - [syncHistoryWithStore](#synchistorywithstorehistory-store)

## Installation

```bash
npm install --save @ibm/mobx-react-router
```

> **⚠️ Deprecation Notice:** The package `mobx-react-router` is deprecated. Use `@ibm/mobx-react-router` instead.

If you haven't installed the peer dependencies yet:

```bash
npm install --save mobx mobx-react react-router
```

## Quick Start

Here's a minimal example to get you started:

```js
import { createBrowserHistory } from 'history';
import { RouterStore, syncHistoryWithStore } from '@ibm/mobx-react-router';

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const history = syncHistoryWithStore(browserHistory, routingStore);

// Use routingStore.location in your components
// Use history with <Router location={routingStore.location} navigator={history}>
```

## Usage

`index.js`
```js
import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from '@ibm/mobx-react-router';
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
    <Router location={routingStore.location} navigator={history}>
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
    const { location, push, back } = this.props.routing;

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

Check our live [example](https://stackblitz.com/edit/github-bje76z-uyn64v?file=README.md) with Vite.js.

### HashRouter

You can replace `history/createBrowserHistory` with `history/createHashHistory` in the example above to use hash routes instead of HTML5 routing.

## Troubleshooting

**Routes not updating correctly when URL changes**

There is a known issue with React Router 4 and MobX (and Redux) where "blocker" components like those
created by `@observer` (and `@connect` in Redux) block react router updates from propagating down the
component tree.

To fix problems like this, try wrapping components which are being "blocked" with React Router's `withRouter` higher
order component should help, depending on the case.

## API

### RouterStore

```js
const store = new RouterStore();
```

A **router store** instance has the following properties:

#### Properties

- **`location`** (*observable*) - The current [location object](https://github.com/mjackson/history#listening) from history
  - `pathname` - The path of the URL
  - `search` - The URL query string
  - `hash` - The URL hash fragment
  - `state` - Location-specific state
  - `key` - Unique identifier for this location

- **`history`** - Raw [history API](https://github.com/mjackson/history#properties) object for advanced usage

#### Methods

The store provides the following [history navigation methods](https://github.com/mjackson/history#navigation):

- **`push(path: string | object)`** - Navigate to a new location, adding to history stack
  ```js
  routingStore.push('/users/123');
  routingStore.push({ pathname: '/users', search: '?id=123' });
  ```

- **`replace(path: string | object)`** - Replace current location without adding to history
  ```js
  routingStore.replace('/login');
  ```

- **`go(n: number)`** - Move n steps in history (negative for backwards)
  ```js
  routingStore.go(-2); // Go back 2 pages
  ```

- **`back()`** - Go back one page (equivalent to `go(-1)`)
  ```js
  routingStore.back();
  ```

- **`forward()`** - Go forward one page (equivalent to `go(1)`)
  ```js
  routingStore.forward();
  ```

### syncHistoryWithStore(history, store)

Synchronizes a history instance with a RouterStore.

#### Parameters

- **`history`** - A history object (from `createBrowserHistory`, `createHashHistory`, etc.)
- **`store`** - An instance of `RouterStore`

#### Returns

An *enhanced* history object with the following **additional methods**:

- **`subscribe(listener: Function): UnsubscribeFunction`**
  Subscribes to any changes in the store's `location` observable.
  **Returns:** An unsubscribe function which destroys the listener
  
  ```js
  const unsubscribeFromStore = history.subscribe((location, action) => {
    console.log(`Navigated to ${location.pathname}`);
  });

  history.push('/test1');  // Logs: "Navigated to /test1"
  unsubscribeFromStore();  // Stop listening
  history.push('/test2');  // No log
  ```

- **`unsubscribe(): void`**
  Un-syncs the store from the history. The store will **no longer update** when the history changes.
  
  ```js
  history.unsubscribe();
  // Store no longer updates when history changes
  ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test-watch

# Lint code
npm run lint
```
