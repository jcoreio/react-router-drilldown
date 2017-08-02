/* eslint-env shared-node-browser */

import React from 'react'
import {mount} from 'enzyme'
import {expect} from 'chai'
import {Router, Route, IndexRoute, Link, createMemoryHistory} from 'react-router'
import Drilldown from '../src'

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('Drilldown', () => {
  let comp, history

  function init(location = '/') {
    const TopDrilldown = props => <Drilldown {...props} viewportClassName="top-drilldown" />
    const MidDrilldown = props => <Drilldown {...props} viewportClassName="mid-drilldown" />

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
    const home = comp.find('.top-drilldown').children().at(0)
    expect(home.prop('data-transition-state')).to.equal('in')
    history.push('/users')
    await delay(300)
    const usersParent = comp.find('.top-drilldown').children().at(1)
    expect(home.prop('data-transition-state')).to.equal('leaving')
    expect(usersParent.prop('data-transition-state')).to.equal('entering')
    await delay(500)
    expect(usersParent.prop('data-transition-state')).to.equal('in')

    history.push('/users/andy')
    await delay(300)
    const users = comp.find('.mid-drilldown').children().at(0)
    const andy = comp.find('.mid-drilldown').children().at(1)
    expect(usersParent.prop('data-transition-state')).to.equal('in')
    expect(users.prop('data-transition-state')).to.equal('leaving')
    expect(andy.prop('data-transition-state')).to.equal('entering')
    await delay(500)
    expect(andy.prop('data-transition-state')).to.equal('in')
  })
  it('animates transitions to index routes', async () => {
    init('/users/andy')

    const usersParent = comp.find('.top-drilldown').children().at(1)
    const andy = comp.find('.mid-drilldown').children().at(1)
    expect(usersParent.prop('data-transition-state')).to.equal('in')
    expect(andy.prop('data-transition-state')).to.equal('in')
    history.push('/users')
    await delay(300)
    const users = comp.find('.mid-drilldown').children().at(0)
    expect(usersParent.prop('data-transition-state')).to.equal('in')
    expect(users.prop('data-transition-state')).to.equal('entering')
    expect(andy.prop('data-transition-state')).to.equal('leaving')
    await delay(500)
    expect(usersParent.prop('data-transition-state')).to.equal('in')
    expect(users.prop('data-transition-state')).to.equal('in')

    history.push('/')
    await delay(300)
    const home = comp.find('.top-drilldown').children().at(0)
    expect(home.prop('data-transition-state')).to.equal('entering')
    expect(usersParent.prop('data-transition-state')).to.equal('leaving')
    expect(users.prop('data-transition-state')).to.equal('in')
    await delay(500)
    expect(home.prop('data-transition-state')).to.equal('in')
  })
  it('handles quick transitions back and forth gracefully', async () => {
    init()
    history.push('/users')
    await delay(50)
    history.push('/')
    await delay(50)
    history.push('/users')
    await delay(500)
    expect(comp.find('h1').text()).to.equal('Users')
  })
})
