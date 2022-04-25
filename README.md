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

Complete code here: [example](https://github.com/superwf/mobx-react-router-example)

`router.js`

```javascript
import { createBrowserHistory } from 'history'
import { RouterStore } from '@superwf/mobx-react-router'

const browserHistory = createBrowserHistory()
export const router = new RouterStore(browserHistory)
```

`index.js`

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router'
import App from './App'
import { router } from './router'

ReactDOM.render(
  <Router history={router.history}>
    <App />
  </Router>
  document.getElementById('root')
)
```

`App.js`

```javascript
import React, { Component } from 'react'
import { observer } from 'mobx-react-lite'
import { router } from './router'

export const App = observer(() => {
  const { location, push, back } = router
  return (
    <div>
      <span>Current pathname: {location.pathname}</span>
      <button onClick={() => push('/test')}>go to "/test"</button>
      <button onClick={back}>Go Back</button>
    </div>
  )
})
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
