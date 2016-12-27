import React from 'react'
import { storiesOf } from '@kadira/storybook'
import {Router, Route, IndexRoute, Link, hashHistory} from 'react-router'
import Drilldown from '../src/withTransitionContext'
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

storiesOf('react-router-drilldown', module)
  .add('first', () => (
    <Router history={hashHistory}>
      <Route path="/" component={Drilldown}>
        <IndexRoute component={Home} />
        <Route path="users" component={Drilldown}>
          <IndexRoute component={Users} />
          <Route path="andy" component={Andy} />
        </Route>
      </Route>
    </Router>
  ))

