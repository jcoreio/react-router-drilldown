/* eslint-env shared-node-browser */

import React from 'react'
import {mount} from 'enzyme'
import {expect} from 'chai'
import {Router, Route, IndexRoute, Link, hashHistory} from 'react-router'
import sinon from 'sinon'
import {createDrilldown, defaultRenderChild} from '../src'

describe('Drilldown', () => {
  it('works', async () => {
    const topRenderChild = sinon.spy(defaultRenderChild)
    const TopDrilldown = createDrilldown({
      renderChild: topRenderChild,
    })
    const midRenderChild = sinon.spy(defaultRenderChild)
    const MidDrilldown = createDrilldown({
      renderChild: midRenderChild,
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

    const comp = mount(
      <Router history={hashHistory}>
        <Route path="/" component={TopDrilldown}>
          <IndexRoute component={Home} />
          <Route path="users" component={MidDrilldown}>
            <IndexRoute component={Users} />
            <Route path="andy" component={Andy} />
          </Route>
        </Route>
      </Router>
    )

    expect(comp.find('h1').text()).to.equal('Home')
  })
})
