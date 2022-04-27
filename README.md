# mobx-react-router

- [mobx-react-router](#mobx-react-router)
  - [Overview](#overview)
  - [Upgrade Note](#upgrade-note)
  - [Installation](#installation)
  - [Example](#example)
  - [CDN](#cdn)
  - [API](#api)
    - [RouterStore constructor](#routerstore-constructor)
    - [Instance properties](#instance-properties)
    - [Instance methods](#instance-methods)

## Overview

Keep your MobX state in sync with react-router via a `RouterStore`.

Router location state is **observable**, so any references to it in `MobX`

components will cause the component to re-render when the location changes.

This repo is forked from alisd23/mobx-react-router.

Totally rewrite with typescript and has type definition together.

Tested 🥳

![Statements](./badge/badge-statements.svg)

![Branches](./badge/badge-branches.svg)

![Functions](./badge/badge-functions.svg)

![Lines](./badge/badge-lines.svg)

## Upgrade note

💡 **Note** 2021-8-16 update to v7 for compatible with history v5, mobx v6, react-router v5 and path-to-regexp v6

Since `History` upgrade to V5, its api changed a lot.

So please [**READ API**](#api) part again even you have used mobx-react-router.

💡 **Note** if you need to work with old version react-router and history, install v6 by `npm install --save @superwf/mobx-react-router@6.0.0`

## Installation

```sh
npm install --save @superwf/mobx-react-router
```

## Example

### ReactRouter V5 example

Complete project see here: [v5 example](https://github.com/superwf/mobx-react-router-example/tree/react-router-5)

`router.js`

```javascript
import { createBrowserHistory } from 'history'
import { RouterStore } from '@superwf/mobx-react-router'

const browserHistory = createBrowserHistory()
export const router = new RouterStore(browserHistory)
```

`App.js`

```javascript
import { observer } from 'mobx-react-lite'
import { router } from "./router";
import { Router, Route, Switch, Link } from "react-router-dom"

export const App = observer(() => {
  return (
    <Router history={router.history}>
      <div className="App">
        <main>
          <p>
            <Link to="/pagea">go to page A</Link>
            <br /><br />
            <Link to="/pageb">go to page b</Link>
          </p>
          <Switch location={router.location}>
            <Route path="/pagea" component={() => <div>page A content</div>} />
            <Route path="/pageb" component={() => <div>page B content</div>} />
          </Switch>
        </main>
      </div>
    </Router>
  );
})
```

`index.js`

```javascript
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
```

### ReactRouter V6 example

Complete project see here: [v6 example](https://github.com/superwf/mobx-react-router-example)

`router.js`, same as react-router v5

```javascript
import { createBrowserHistory } from 'history'
import { RouterStore } from '@superwf/mobx-react-router'

const browserHistory = createBrowserHistory()
export const router = new RouterStore(browserHistory)
```

`RouteWrapper.js`

```javascript
import { router } from "./router";
import { Routes, Route } from "react-router-dom"

router.appendPathList('/user/:name')

const PageA = () => <h1>Route Page A Content</h1>
const PageB = () => <h1>Route Page B Content</h1>

export const RouteWrapper = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/pagea" element={<PageA />} />
        <Route path="/pageb" element={<PageB />} />
      </Routes>
    </div>
  );
}
```

`Main.jsx`

```javascript
import * as React from "react"
import { observer } from 'mobx-react-lite'
import { Link } from "react-router-dom"
import { Router, Outlet } from "react-router-dom"
import { RouteWrapper } from "./RouteWrapper"
import { router } from "./router";

export const Main = observer(() => {
  const { location, push, back, query, hashValue, pathValue } = router
  let [state, setState] = React.useState({
    action: router.history.action,
    location: router.history.location,
  }); 
  React.useLayoutEffect(() => router.subscribe(setState), []);
  return <Router location={state.location} navigationType={state.action} navigator={router.history}>
    <main>
      <header className="App-header">
        <p>React Router 6 example</p>
        <Link to="/pagea">go to Page A</Link>
        <br /><br />
        <Link to="/pageb">go to Page B</Link>
      </header>
      <RouteWrapper />
      <Outlet />
    </main>
  </Router>
})
```

`index.js`

```javascript
import ReactDOM from 'react-dom';
import { Main } from './Main';

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
```

## CDN

- Global var mode mode. Global variable name: `window.MobxReactRouter`

`<script type="javascript" src="https://unpkg.com/@superwf/mobx-react-router@latest/dist/mobx-react-router.min.js"></script>`

- Es module mode.

```javascript
import { RouterStore } from 'https://unpkg.com/@superwf/mobx-react-router/module/index.js'
```

## API

### RouterStore constructor

param: `history` - A variant of a history object, usually `browserHistory`

```javascript
const browserHistory = createBrowserHistory()
// or hashHistory or memoryHistory
const router = new RouterStore(browserHistory)
```

### Instance properties

A **RouterStore** instance has the following properties:

- **history** - raw [history API](https://github.com/mjackson/history#properties) object
- `state` (*observable*) - sync with history state, type as below.

```javascript
{ action: history.action, location: history.location }
```

- **location** (*observable*, *readonly*) - sync with history location

```javascript
router.push('/test1')
router.location.pathname // '/test1'
```

- **history** the history instance from constructor. Use it as your will, do not update it.

- **pathList** string[], observable, used to match `pathValue`. **Do not** use it directly unless you absolutely know your purpose.

- **query** url search object format.

```javascript
router.push('/abc?a=1&b=2')
router.query // { a: '1', b: '2' }
router.push('/abc?id=1&id=2')
router.query // { id: ['1', '2'] }
```

- **hashValue** hash string without `#`.

```javascript
router.push('/abc#xxx')
router.hashValue // 'xxx'
```

- **pathValue** extract path parameter to object type, need `pathList` work together.

```javascript
router.appendPathList('/user/:name')
router.push('/user/xxx')
router.hashValue // 'xxx'
```

### Instance methods

- **stopSyncWithHistory**, stop sync with history any more, once stoped, can not start again.

```javascript
router.push('/test1')
router.location.pathname // '/test1'
router.stopSyncWithHistory()
router.push('/test2') // not sync any more
router.location.pathname // '/test1'
```

- **subscribe(*listener*) and unsubscribe()**

Subscribes to any changes in the store's `location` observable,
and run the listener at once with current history state.
**Returns** an unsubscribe function which destroys the listener

```javascript
const stopListen = router.subscribe(({ location }) => console.log(location.pathname))
router.push('/test1') // output '/test1'
stopListen()
router.push('/test2') // no output any more
```

- **appendPathList**, **prependPathList**

Append or prepend new paths to `pathList` property,

💡 **Note** path in pathList **order** is important, first matched path will return the `pathValue` result.

Use `prependPathList` for some `path` which has high priority.

```javascript
router.appendPathList('/user/:name')
router.push('/user/rock') // match "/user/:name"
router.pathValue // now get a path param: { name: 'rock' }
```

The following methods bind to the history instance, for more detail read here: [history methods](https://github.com/remix-run/history/blob/main/docs/navigation.md):

- **push**
- **replace**
- **go**
- **back**
- **forward**
- **subscribe**
