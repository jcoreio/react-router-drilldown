# react-router-drilldown

[![Build Status](https://travis-ci.org/jcoreio/react-router-drilldown.svg?branch=master)](https://travis-ci.org/jcoreio/react-router-drilldown)
[![Coverage Status](https://coveralls.io/repos/github/jcoreio/react-router-drilldown/badge.svg?branch=master)](https://coveralls.io/github/jcoreio/react-router-drilldown?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This is a simple component that provides drilldown-style horizontal slide transitions between index and child routes.
It is based upon `react-view-slider`.
Currently it only supports `react-router` versions 2 and 3.

[Live Demo](http://jcoreio.github.io/react-router-drilldown/)

## Usage
```
npm install --save react-router-drilldown react-view-slider
```

```js
import React from 'react'
import {render} from 'react-dom'
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

render(
  <Router history={browserHistory}>
    <Route path="/" component={Drilldown}>
      <IndexRoute component={Home} />
      <Route path="users" component={Drilldown}>
        <IndexRoute component={Users} />
        <Route path="andy" component={Andy} />
      </Route>
    </Route>
  </Router>,
  document.getElementById('root')
)
```

Note how the `/` and `users` routes both have `component={Drilldown}`.  `Drilldown` only animates transitions at one
level, and only when navigating from the index route to a child route or vice versa, so if you want more than two levels
in your drilldown UI you must use a `Drilldown` on each level.

## withTransitionContext
You can use this with my [react-transition-context](https://github.com/jedwards1211/react-transition-context) package
to easily focus elements when a drilldown route has fully entered.
```
npm install --save react-router-drilldown react-view-slider react-transition-context
```

```js
import React from 'react'
import {render} from 'react-dom'
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

render(
  <Router history={browserHistory}>
    <Route path="/" component={Drilldown}>
      <IndexRoute component={Home} />
      <Route path="users" component={Drilldown}>
        <IndexRoute component={Users} />
        <Route path="andy" component={Andy} />
      </Route>
    </Route>
  </Router>,
  document.getElementById('root')
)
```

## Props that should be injected by `react-router`

* `route`
* `routes`
* `children`

## Props that are passed along to [`react-view-slider`](https://github.com/jcoreio/react-view-slider)

### `animateHeight: boolean` (default: `true`)

If truthy, `ViewSlider` will animate its height to match the height of the page at `activePage`.

### `transitionDuration: number` (default: `500`)

The duration of the transition between pages.

### `transitionTimingFunction: string` (default: `'ease'`)

The timing function for the transition between pages.

### `prefixer: Prefixer`

If given, overrides the `inline-style-prefixer` used to autoprefix inline styles.

### `fillParent: boolean` (default: `false`)

If truthy, `Drilldown` will use absolute positioning on itself and its pages to fill its parent element.

### `className: string`

Any extra class names to add to the root element.

### `style: Object`

Extra inline styles to add to the root element.

### `viewportClassName: string`

Any extra class names to add to the inner "viewport" element.

### `viewportStyle: Object`

Extra inline styles to add to the inner "viewport" element.


