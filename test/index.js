/* eslint-env shared-node-browser */

import React from 'react'
import {mount} from 'enzyme'
import {expect} from 'chai'
import {Router, Route, IndexRoute, Link, createMemoryHistory} from 'react-router'
import sinon from 'sinon'
import {createDrilldown, defaultRenderChild} from '../src'

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('Drilldown', () => {
  let comp, history, topRenderChild, midRenderChild

  function init(location = '/') {
    topRenderChild = sinon.spy(defaultRenderChild)
    const TopDrilldown = createDrilldown({
      renderChild: topRenderChild,
    })
    midRenderChild = sinon.spy(defaultRenderChild)
    const MidDrilldown = createDrilldown({
      renderChild: midRenderChild,
    })

    const Home = () => (
      <div className="home">
        <h1>Home</h1>
        <p><Link to="/users" className="users-link">Users</Link></p>
        <p><Link to="/users/andy" className="andy-link">Andy</Link></p>
      </div>
    )

    const Users = () => (
      <div className="users">
        <h1>Users</h1>
        <Link to="/users/andy" className="andy-link">Andy</Link>
      </div>
    )

    const Andy = () => <div className="andy"><h1>Andy</h1></div>

    history = createMemoryHistory(location)

    comp = mount(
      <Router history={history}>
        <Route path="/" component={TopDrilldown}>
          <IndexRoute component={Home} />
          <Route path="users" component={MidDrilldown}>
            <IndexRoute component={Users} />
            <Route path="andy" component={Andy} />
          </Route>
        </Route>
      </Router>
    )
  }
  afterEach(() => {
    if (comp) comp.unmount()
  })

  it('animates transitions to child routes', async () => {
    init()

    expect(comp.find('h1').text()).to.equal('Home')
    expect(topRenderChild.args[0][0].transitionState).to.equal('in')
    topRenderChild.reset()
    history.push('/users')
    await delay(300)
    expect(comp.find('h1').text()).to.equal('Users')
    expect(topRenderChild.args[0][0].transitionState).to.equal('leaving')
    expect(topRenderChild.args[1][0].transitionState).to.equal('entering')
    expect(topRenderChild.args[topRenderChild.args.length - 1][0].side).to.equal('right')
    expect(topRenderChild.args[topRenderChild.args.length - 1][0].transitionState).to.equal('in')

    topRenderChild.reset()
    midRenderChild.reset()
    history.push('/users/andy')
    await delay(300)
    expect(comp.find('h1').text()).to.equal('Andy')
    expect(midRenderChild.args[0][0].transitionState).to.equal('leaving')
    expect(midRenderChild.args[1][0].transitionState).to.equal('entering')
    expect(midRenderChild.args[midRenderChild.args.length - 1][0].side).to.equal('right')
    expect(midRenderChild.args[midRenderChild.args.length - 1][0].transitionState).to.equal('in')
  })
  it('animates transitions to index routes', async () => {
    init('/users/andy')

    expect(comp.find('h1').text()).to.equal('Andy')
    expect(midRenderChild.args[0][0].transitionState).to.equal('in')
    midRenderChild.reset()
    history.push('/users')
    await delay(300)
    expect(comp.find('h1').text()).to.equal('Users')
    expect(midRenderChild.args[0][0].transitionState).to.equal('entering')
    expect(midRenderChild.args[1][0].transitionState).to.equal('leaving')
    expect(midRenderChild.args[midRenderChild.args.length - 1][0].side).to.equal('left')
    expect(midRenderChild.args[midRenderChild.args.length - 1][0].transitionState).to.equal('in')

    topRenderChild.reset()
    midRenderChild.reset()
    history.push('/')
    await delay(300)
    expect(comp.find('h1').text()).to.equal('Home')
    expect(topRenderChild.args[0][0].transitionState).to.equal('entering')
    expect(topRenderChild.args[1][0].transitionState).to.equal('leaving')
    expect(topRenderChild.args[topRenderChild.args.length - 1][0].side).to.equal('left')
    expect(topRenderChild.args[topRenderChild.args.length - 1][0].transitionState).to.equal('in')
  })
  it('handles quick transitions back and forth gracefully', async () => {
    init()
    history.push('/users')
    await delay(50)
    history.push('/')
    await delay(50)
    history.push('/users')
    await delay(300)
    expect(comp.find('h1').text()).to.equal('Users')
  })
})
