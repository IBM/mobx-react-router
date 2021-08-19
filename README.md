# mobx-react-router

This repo is forked from alisd23/mobx-react-router.

Totally rewrite with typescript and has type definition together.

100% tested.

## Breaking Changes

### Note 2021-8-16 update to v7 for compatible with history v5, mobx v6 and path-to-regexp v6.

Since `History` upgrade to V5, history api changed a lot.

So please **READ THIS API**.

Keep your MobX state in sync with react-router via a `RouterStore`.

Router location state is **observable**, so any references to it in `MobX`

components will cause the component to re-render when the location changes.

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [RouterStore](#routerstore)

Note: V7 is for use with **react-router v5**.

## Installation

```sh
npm install --save @superwf/mobx-react-router
```

## Usage

`router.js`

```js
import { createBrowserHistory } from 'history'
import { RouterStore } from 'mobx-react-router'

export const router = new RouterStore(browserHistory)
```

`index.js`

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router'
import App from './App'
import { router } from './router'

const browserHistory = createBrowserHistory()

ReactDOM.render(
  <Router history={router.history}>
    <App />
  </Router>
  document.getElementById('root')
)
```

`App.js`

```js
import React, { Component } from 'react'
import { observer } from 'mobx-react-lite'
import { router } from './router'

export const App = observer(() => {
  const { location, push, back } = router
  return (
    <div>
    <span>Current pathname: {location.pathname}</span>
    <button onClick={() => push('/test')}>Change url</button>
    <button onClick={() => back()}>Go Back</button>
    </div>
  )
})
```

## API

### RouterStore

#### constructor

param: `history` - A variant of a history object, usually `browserHistory`

```js
const browserHistory = createBrowserHistory()
// or hashHistory or memoryHistory
const router = new RouterStore(browserHistory)
```

A **router store** instance has the following properties:

- `history` - raw [history API](https://github.com/mjackson/history#properties) object
- `state` (*observable*) - sync with history state

```js
{ action: history.action, location: history.location }
```

- `location` (*observable*) - sync with history location

And the following methods and properties bind to the history instance [history methods](https://github.com/mjackson/history#navigation):

- **push(*path*)**
- **replace(*path*)**
- **go(*n*)**
- **back()**
- **forward()**
- **location**

returns an *enhanced* history object with the following **additional methods**:

- **subscribe(*listener*)**  

Subscribes to any changes in the store's `location` observable,
and run the listener at once with current history state.
**Returns** an unsubscribe function which destroys the listener

#### Additional peoperties 🍧

- **store instance sync with history automatically**  

```js
router.push('/test1')
router.location.pathname // '/test1'
router.stopSyncWithHistory()
router.push('/test2') // not sync any more
router.location.pathname // '/test1'
```

- **subscribe(*listener*) and unsubscribe()**  

```js
const stopListen = router.subscribe(({ location }) => console.log(location.pathname))
router.push('/test1') // output '/test1'
stopListen()
router.push('/test2') // no output any more
```

```js
history.stopSyncWithHistory()
// Store no longer updates
```

************************

**Below is some sugar properties, hope you like them. 🍻🍻🍻**

- **query**

```js
router.push('/abc?a=1&b=2')
router.query // { a: '1', b: '2' }
router.push('/abc?id=1&id=2')
router.query // { id: ['1', '2'] }
```

- **hashValue**

```js
router.push('/abc#xxx')
router.hashValue // 'xxx'
```

- **appendPathList**, **prependPathList**, **pathValue**

use appendPathList or prependPathList to add some paths,

**Note** path order is important, because first matched path will return the result.

so use `prependPathList` is some `path` has high priority.

```js
router.appendPathList('/user/:name')
router.push('/user/rock')
router.pathValue // { name: 'rock' }
```
