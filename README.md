# react-router-drilldown

[![CircleCI](https://circleci.com/gh/jcoreio/react-router-drilldown.svg?style=svg)](https://circleci.com/gh/jcoreio/react-router-drilldown)
[![Coverage Status](https://codecov.io/gh/jcoreio/react-router-drilldown/branch/master/graph/badge.svg)](https://codecov.io/gh/jcoreio/react-router-drilldown)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/react-router-drilldown.svg)](https://badge.fury.io/js/react-router-drilldown)

This is a simple component that provides drilldown-style horizontal slide transitions between index and child routes.
It is based upon the `<Switch>` component from `react-router` v4 and uses `react-view-slider` internally.

For `react-router` v2 or v3, see the [legacy project](https://github.com/jcoreio/react-router-3-drilldown).

[Live Demo](http://jcoreio.github.io/react-router-drilldown/)

## Usage

```
npm install --save react-router react-router-dom react-router-drilldown react-view-slider
```

Create a `<Drilldown>` element with child `<Route>`s exactly like you would for a `<Switch>`.
By default the first child `<Route>` is at the left, and subsequent child routes will slide in from the right.
However, you also customize the order by giving an integer `key` to each child route.

```js
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Drilldown from 'react-router-drilldown'

const Home = () => (
  <div>
    <h1>Home</h1>
    <p>
      <Link to="/users">Users</Link>
    </p>
    <p>
      <Link to="/users/andy">Andy</Link>
    </p>
  </div>
)

const Users = ({ match }) => (
  <div>
    <h1>Users</h1>
    <Link to={`${match.url}/andy`}>Andy</Link>
  </div>
)

const Andy = () => <h1>Andy</h1>

render(
  <Router>
    <Drilldown>
      <Route exact path="/" component={Home} />
      <Route exact path="/users" component={Users} />
      <Route path="/users/andy" component={Andy} />
    </Drilldown>
  </Router>,
  document.getElementById('root')
)
```

Note: if you transition directly from `/` to `/users/andy` before ever visiting `/users`, the `/users` view will not
show in the middle of the animated transition. However, once you have visited `/users`, it will show between the other
two views when transitioning between them.

## Drilldowns can be nested

Instead of the flat route configuration shown above, you also use a separate drilldown at each level:

```js
const UsersRoute = ({ match }) => (
  <Drilldown>
    <Route exact path={match.path} component={Users} />
    <Route path={`${match.url}/andy`} component={Andy} />
  </Drilldown>
)

render(
  <Router>
    <Drilldown>
      <Route exact path="/" component={Home} />
      <Route path="/users" component={UsersRoute} />
    </Drilldown>
  </Router>,
  document.getElementById('root')
)
```

Unlike the flat example above, you will not see the `/users` view fly by in the middle when transitioning directly
from `/` to `/users/andy`.

## Props

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

### `location: Location` (default: accessed from `withRouter`)

If given, this location is used instead of the one from `withRouter`.
