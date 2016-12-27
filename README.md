# react-router-drilldown

[![Build Status](https://travis-ci.org/jcoreio/react-router-drilldown.svg?branch=master)](https://travis-ci.org/jcoreio/react-router-drilldown)
[![Coverage Status](https://coveralls.io/repos/github/jcoreio/react-router-drilldown/badge.svg?branch=master)](https://coveralls.io/github/jcoreio/react-router-drilldown?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This is a simple component that provides drilldown-style horizontal slide transitions between index and child routes.
Currently it only supports `react-router` versions 2 and 3.

[Live Demo](http://jcoreio.github.io/react-router-drilldown/)

## Usage
```
npm install --save react-router-drilldown
```

```js
import React from 'react'
import {Router, Route, IndexRoute, Link, browserHistory} from 'react-router'
import Drilldown from 'react-router-drilldown'

const Home = () => (
  <div>
    <h1>Home</h1>
    <p><Link to="/users">Users</Link></p>
    <p><Link to="/users/andy">Andy</Link></p>
  </div>
)

const Users = () => (
  <div>
    <h1>Users</h1>
    <Link to="/users/andy">Andy</Link>
  </div>
)

const Andy = () => <h1>Andy</h1>

<Router history={browserHistory}>
  <Route path="/" component={Drilldown}>
    <IndexRoute component={Home} />
    <Route path="users" component={Drilldown}>
      <IndexRoute component={Users} />
      <Route path="andy" component={Andy} />
    </Route>
  </Route>
</Router>
```

Note how the `/` and `users` routes both have `component={Drilldown}`.  `Drilldown` only animates transitions at one
level, and only when navigating from the index route to a child route or vice versa, so if you want more than two levels
in your drilldown UI you must use a `Drilldown` on each level.

## withTransitionContext
You can use this with my [react-transition-context](https://github.com/jedwards1211/react-transition-context) package
to easily focus elements when a drilldown route has fully entered.
```
npm install --save react-router-drilldown react-transition-context
```

```js
import React from 'react'
import {Router, Route, IndexRoute, Link, browserHistory} from 'react-router'
import Drilldown from 'react-router-drilldown/lib/withTransitionContext'
import {TransitionListener} from 'react-transition-context'

const Home = () => (
  <div>
    <h1>Home</h1>
    <p><Link to="/users">Users</Link></p>
    <p><Link to="/users/andy">Andy</Link></p>
  </div>
)

const Users = () => (
  <div>
    <h1>Users</h1>
    <Link to="/users/andy">Andy</Link>
  </div>
)

class Andy extends React.Component {
  render() {
    return (
      <div>
        <h1>Andy</h1>
        <input ref={c => this.email = c} placeholder="email" />
        <TransitionListener didComeIn={() => this.email.focus()} />
      </div>
    )
  }
}

<Router history={browserHistory}>
  <Route path="/" component={Drilldown}>
    <IndexRoute component={Home} />
    <Route path="users" component={Drilldown}>
      <IndexRoute component={Users} />
      <Route path="andy" component={Andy} />
    </Route>
  </Route>
</Router>
```

## customization
This package also exports a `createDrilldown` function that accepts `transitionTimeout` and `renderChild` properties
(this is the API used by `react-router-drilldown/lib/withTransitionContext`).

`transitionTimeout` is in milliseconds and is used as the timeout if no `transitionend` event is fired, and as the
`transition-duration`.

`renderChild` is passed the following properties:
* `side`: `'left' | 'right'`
* `transitionState`: `'in' | 'out' | 'entering' | 'leaving'`
* `children`: the route content
* `style`: the default inline style

```js
import React from 'react'
import {Router, Route, IndexRoute, Link, browserHistory} from 'react-router'
import {createDrilldown} from 'react-router-drilldown'

const Drilldown = createDrilldown({
  renderChild: ({side, transitionState, children, style}) => (
    <div style={style}>
      <h3>Side: {side}</h3>
      <h3>Transition State: {transitionState}</h3>
      {children}
    </div>
  ),
})

const Home = () => (
  <div>
    <h1>Home</h1>
    <p><Link to="/users">Users</Link></p>
    <p><Link to="/users/andy">Andy</Link></p>
  </div>
)

const Users = () => (
  <div>
    <h1>Users</h1>
    <Link to="/users/andy">Andy</Link>
  </div>
)

const Andy = () => <h1>Andy</h1>

<Router history={browserHistory}>
  <Route path="/" component={Drilldown}>
    <IndexRoute component={Home} />
    <Route path="users" component={Drilldown}>
      <IndexRoute component={Users} />
      <Route path="andy" component={Andy} />
    </Route>
  </Route>
</Router>
```

