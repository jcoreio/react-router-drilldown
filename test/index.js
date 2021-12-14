/* eslint-env shared-node-browser */

import React from 'react'
import { mount } from 'enzyme'
import { expect } from 'chai'
import { createMemoryHistory } from 'history'
import { Router, Route, Link } from 'react-router-dom'
import Drilldown from '../src'
import { TransitionContext } from 'react-transition-context'

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('Drilldown', function() {
  this.timeout(10000)
  let comp, history

  function init({
    location = '/',
    keepPrecedingViewsMounted,
  }: {| location?: string, keepPrecedingViewsMounted?: boolean |} = {}) {
    const Home = () => (
      <div className="home">
        <h1>Home</h1>
        <p>
          <Link to="/users" className="users-link">
            Users
          </Link>
        </p>
        <p>
          <Link to="/users/andy" className="andy-link">
            Andy
          </Link>
        </p>
      </div>
    )

    const Users = ({ match }) => (
      <div className="users">
        <h1>Users</h1>
        <Link to={`${match.url}/andy`} className="andy-link">
          Andy
        </Link>
      </div>
    )

    const Andy = () => (
      <div className="andy">
        <h1>Andy</h1>
      </div>
    )

    const UsersRoute = ({ match }) => (
      <Drilldown
        viewportClassName="mid-drilldown"
        keepPrecedingViewsMounted={keepPrecedingViewsMounted}
      >
        <Route exact path={match.url} component={Users} />
        <Route path={`${match.url}/andy`} component={Andy} />
      </Drilldown>
    )

    history = createMemoryHistory({
      initialEntries: [location],
      initialIndex: 0,
    })

    comp = mount(
      <Router history={history}>
        <Drilldown
          viewportClassName="top-drilldown"
          keepPrecedingViewsMounted={keepPrecedingViewsMounted}
        >
          <Route exact path="/" component={Home} />
          <Route path="/users" component={UsersRoute} />
        </Drilldown>
      </Router>
    )
  }
  afterEach(() => {
    if (comp) comp.unmount()
  })

  it('animates transitions to child routes', async () => {
    init()

    expect(comp.find('h1').text()).to.equal('Home')
    expect(
      comp
        .find('.top-drilldown')
        .find(TransitionContext)
        .prop('state')
    ).to.equal('in')
    history.push('/users')
    await delay(300)
    comp.update()
    expect(
      comp
        .find('.top-drilldown')
        .find(TransitionContext)
        .at(1)
        .prop('state')
    ).to.equal('entering')
    expect(
      comp
        .find('.top-drilldown')
        .find(TransitionContext)
        .at(0)
        .prop('state')
    ).to.equal('leaving')
    await delay(500)
    comp.update()
    expect(
      comp
        .find('.top-drilldown')
        .find(TransitionContext)
        .at(1)
        .prop('state')
    ).to.equal('in')
    expect(
      comp
        .find('.mid-drilldown')
        .find(TransitionContext)
        .at(0)
        .prop('state')
    ).to.equal('in')

    history.push('/users/andy')
    await delay(300)
    comp.update()
    // there is now only one TransitionContext directly under .top-drilldown
    expect(
      comp
        .find('.top-drilldown')
        .find(TransitionContext)
        .at(0)
        .prop('state')
    ).to.equal('in')
    expect(
      comp
        .find('.mid-drilldown')
        .find(TransitionContext)
        .at(0)
        .prop('state')
    ).to.equal('leaving')
    expect(
      comp
        .find('.mid-drilldown')
        .find(TransitionContext)
        .at(1)
        .prop('state')
    ).to.equal('entering')
    await delay(500)
    comp.update()
    // there is now only one TransitionContext directly under .mid-drilldown
    expect(
      comp
        .find('.mid-drilldown')
        .find(TransitionContext)
        .at(0)
        .prop('state')
    ).to.equal('in')
    expect(comp.text()).to.equal('Andy')
  })
  it('supports keepPrecedingViewsMounted', async () => {
    init({ keepPrecedingViewsMounted: true })

    expect(comp.find('h1').text()).to.equal('Home')
    expect(
      comp
        .find('.top-drilldown')
        .find(TransitionContext)
        .prop('state')
    ).to.equal('in')
    history.push('/users')
    await delay(300)
    comp.update()
    expect(
      comp
        .find('.top-drilldown')
        .find(TransitionContext)
        .at(1)
        .prop('state')
    ).to.equal('entering')
    expect(
      comp
        .find('.top-drilldown')
        .find(TransitionContext)
        .at(0)
        .prop('state')
    ).to.equal('leaving')
    await delay(500)
    comp.update()
    expect(
      comp
        .find('.top-drilldown')
        .find(TransitionContext)
        .at(1)
        .prop('state')
    ).to.equal('in')
    expect(
      comp
        .find('.mid-drilldown')
        .find(TransitionContext)
        .at(0)
        .prop('state')
    ).to.equal('in')

    history.push('/users/andy')
    await delay(300)
    comp.update()
    expect(
      comp
        .find('.top-drilldown')
        .find(TransitionContext)
        .at(1)
        .prop('state')
    ).to.equal('in')
    expect(
      comp
        .find('.mid-drilldown')
        .find(TransitionContext)
        .at(0)
        .prop('state')
    ).to.equal('leaving')
    expect(
      comp
        .find('.mid-drilldown')
        .find(TransitionContext)
        .at(1)
        .prop('state')
    ).to.equal('entering')
    await delay(500)
    comp.update()
    expect(
      comp
        .find('.mid-drilldown')
        .find(TransitionContext)
        .at(1)
        .prop('state')
    ).to.equal('in')

    expect(comp.text()).to.equal('HomeUsersAndyUsersAndyAndy')

    history.push('/users')
    await delay(300)
    comp.update()
    expect(
      comp
        .find('.top-drilldown')
        .find(TransitionContext)
        .at(1)
        .prop('state')
    ).to.equal('in')
    expect(
      comp
        .find('.mid-drilldown')
        .find(TransitionContext)
        .at(0)
        .prop('state')
    ).to.equal('entering')
    expect(
      comp
        .find('.mid-drilldown')
        .find(TransitionContext)
        .at(1)
        .prop('state')
    ).to.equal('leaving')

    await delay(500)
    expect(comp.update().text()).to.equal('HomeUsersAndyUsersAndy')
  })
  it('animates transitions to index routes', async () => {
    init({ location: '/users/andy' })

    expect(
      comp
        .find('.top-drilldown')
        .find(TransitionContext)
        .at(0)
        .prop('state')
    ).to.equal('in')
    expect(
      comp
        .find('.mid-drilldown')
        .find(TransitionContext)
        .at(0)
        .prop('state')
    ).to.equal('in')
    history.push('/users')
    await delay(300)
    comp.update()
    expect(
      comp
        .find('.top-drilldown')
        .find(TransitionContext)
        .at(0)
        .prop('state')
    ).to.equal('in')
    expect(
      comp
        .find('.mid-drilldown')
        .find(TransitionContext)
        .at(0)
        .prop('state')
    ).to.equal('entering')
    expect(
      comp
        .find('.mid-drilldown')
        .find(TransitionContext)
        .at(1)
        .prop('state')
    ).to.equal('leaving')
    await delay(500)
    comp.update()
    expect(
      comp
        .find('.top-drilldown')
        .find(TransitionContext)
        .at(0)
        .prop('state')
    ).to.equal('in')
    expect(
      comp
        .find('.mid-drilldown')
        .find(TransitionContext)
        .at(0)
        .prop('state')
    ).to.equal('in')

    history.push('/')
    await delay(300)
    comp.update()
    expect(
      comp
        .find('.top-drilldown')
        .find(TransitionContext)
        .at(0)
        .prop('state')
    ).to.equal('entering')
    expect(
      comp
        .find('.top-drilldown')
        .find(TransitionContext)
        .at(1)
        .prop('state')
    ).to.equal('leaving')
    await delay(500)
    comp.update()
    expect(
      comp
        .find('.top-drilldown')
        .find(TransitionContext)
        .at(0)
        .prop('state')
    ).to.equal('in')
  })
  it('handles quick transitions back and forth gracefully', async () => {
    init()
    history.push('/users')
    await delay(50)
    history.push('/')
    await delay(50)
    history.push('/users')
    await delay(500)
    comp.update()
    expect(comp.find('h1').text()).to.equal('Users')
  })
})
