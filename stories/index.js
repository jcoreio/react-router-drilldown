import React from 'react'
import { storiesOf } from '@kadira/storybook'
import {Router, Route, IndexRoute, Link, hashHistory} from 'react-router'
import Drilldown from '../src'

storiesOf('react-router-drilldown', module)
  .add('first', () => (
    <Router history={hashHistory}>
      <Route path="/" component={Drilldown}>
        <IndexRoute component={() =>
          <div>
            <h1>Home ;lkjas;ldkja;lskjdf;laksjdfa</h1>
            <p><Link to="/users">Users</Link></p>
            <p><Link to="/users/andy">Andy</Link></p>
          </div>
        }
        />
        <Route path="users" component={Drilldown}>
          <IndexRoute component={() =>
            <div>
              <h1>Users a;lkjlkajsldkfja;sldfa</h1>
              <Link to="/users/andy">Andy</Link>
            </div>
          }
          />
          <Route path="andy" component={() => <h1>Andy</h1>} />
        </Route>
      </Route>
    </Router>
  ))

