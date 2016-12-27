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

    const comp = mount(
      <Router history={hashHistory}>
        <Route path="/" component={TopDrilldown}>
          <IndexRoute component={() =>
            <div>
              <h1>Home</h1>
              <p><Link to="/users">Users</Link></p>
              <p><Link to="/users/andy">Andy</Link></p>
            </div>
          }
          />
          <Route path="users" component={MidDrilldown}>
            <IndexRoute component={() =>
              <div>
                <h1>Users</h1>
                <Link to="/users/andy">Andy</Link>
              </div>
            }
            />
            <Route path="andy" component={() => <h1>Andy</h1>} />
          </Route>
        </Route>
      </Router>
    )

    expect(comp.find('h1').text()).to.equal('Home')
  })
})
