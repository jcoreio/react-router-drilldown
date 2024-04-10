/* eslint-env shared-node-browser */

import React from 'react'
import { expect } from 'chai'
import { createMemoryHistory, History } from 'history'
import { Router, Route, Link, match } from 'react-router-dom'
import Drilldown from '../src'
import { useTransitionContext } from 'react-transition-context'
import { describe, it } from 'mocha'
import { render, RenderResult, act } from '@testing-library/react'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

describe('Drilldown', function () {
  this.timeout(10000)
  let comp: RenderResult, history: History

  function init({
    location = '/',
    keepPrecedingViewsMounted,
  }: { location?: string; keepPrecedingViewsMounted?: boolean } = {}) {
    const Home = () => {
      const state = useTransitionContext()
      return (
        <div className="home" data-transition-state={state}>
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
    }

    const Users = ({ match }: { match: match }) => {
      const state = useTransitionContext()
      return (
        <div className="users" data-transition-state={state}>
          <h1>Users</h1>
          <Link to={`${match.url}/andy`} className="andy-link">
            Andy
          </Link>
        </div>
      )
    }

    const Andy = () => {
      const state = useTransitionContext()
      return (
        <div className="andy" data-transition-state={state}>
          <h1>Andy</h1>
        </div>
      )
    }

    const UsersRoute = ({ match }: { match: match }) => {
      const state = useTransitionContext()
      return (
        <Drilldown
          viewportClassName="mid-drilldown"
          data-transition-state={state}
          keepPrecedingViewsMounted={keepPrecedingViewsMounted}
        >
          <Route exact path={match.url} component={Users} />
          <Route path={`${match.url}/andy`} component={Andy} />
        </Drilldown>
      )
    }

    history = createMemoryHistory({
      initialEntries: [location],
      initialIndex: 0,
    })

    comp = render(
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

  it('animates transitions to child routes', async function () {
    init()

    expect(comp.container.querySelector('h1')?.innerHTML).to.equal('Home')
    expect(
      comp.container
        .querySelector('.home')
        ?.getAttribute('data-transition-state')
    ).to.equal('in')
    await act(() => history.push('/users'))
    await delay(300)
    expect(
      comp.container
        .querySelector('.users')
        ?.getAttribute('data-transition-state')
    ).to.equal('entering')
    expect(
      comp.container
        .querySelector('.home')
        ?.getAttribute('data-transition-state')
    ).to.equal('leaving')
    await delay(500)
    expect(
      comp.container
        .querySelector('.users')
        ?.getAttribute('data-transition-state')
    ).to.equal('in')
    expect(comp.container.querySelector('.home')).not.to.exist
    expect(comp.container.querySelector('.andy')).not.to.exist

    await act(() => history.push('/users/andy'))
    await delay(300)
    // there is now only one TransitionContext directly under .top-drilldown
    expect(
      comp.container
        .querySelector('.users')
        ?.getAttribute('data-transition-state')
    ).to.equal('leaving')
    expect(
      comp.container
        .querySelector('.andy')
        ?.getAttribute('data-transition-state')
    ).to.equal('entering')
    await delay(500)
    // there is now only one TransitionContext directly under .mid-drilldown
    expect(
      comp.container
        .querySelector('.andy')
        ?.getAttribute('data-transition-state')
    ).to.equal('in')
    expect(comp.container.querySelector('.home')).not.to.exist
    expect(comp.container.querySelector('.users')).not.to.exist
  })
  it('supports keepPrecedingViewsMounted', async () => {
    init({ keepPrecedingViewsMounted: true })

    expect(
      comp.container
        .querySelector('.home')
        ?.getAttribute('data-transition-state')
    ).to.equal('in')
    expect(
      comp.container
        .querySelector('.users')
        ?.getAttribute('data-transition-state')
    ).to.equal(undefined)
    expect(
      comp.container
        .querySelector('.andy')
        ?.getAttribute('data-transition-state')
    ).to.equal(undefined)
    history.push('/users')
    await delay(300)
    expect(
      comp.container
        .querySelector('.home')
        ?.getAttribute('data-transition-state')
    ).to.equal('leaving')
    expect(
      comp.container
        .querySelector('.users')
        ?.getAttribute('data-transition-state')
    ).to.equal('entering')
    expect(
      comp.container
        .querySelector('.andy')
        ?.getAttribute('data-transition-state')
    ).to.equal(undefined)
    await delay(500)
    expect(
      comp.container
        .querySelector('.home')
        ?.getAttribute('data-transition-state')
    ).to.equal('out')
    expect(
      comp.container
        .querySelector('.users')
        ?.getAttribute('data-transition-state')
    ).to.equal('in')
    expect(
      comp.container
        .querySelector('.andy')
        ?.getAttribute('data-transition-state')
    ).to.equal(undefined)

    history.push('/users/andy')
    await delay(300)
    expect(
      comp.container
        .querySelector('.home')
        ?.getAttribute('data-transition-state')
    ).to.equal('out')
    expect(
      comp.container
        .querySelector('.users')
        ?.getAttribute('data-transition-state')
    ).to.equal('leaving')
    expect(
      comp.container
        .querySelector('.andy')
        ?.getAttribute('data-transition-state')
    ).to.equal('entering')
    await delay(500)
    expect(
      comp.container
        .querySelector('.home')
        ?.getAttribute('data-transition-state')
    ).to.equal('out')
    expect(
      comp.container
        .querySelector('.users')
        ?.getAttribute('data-transition-state')
    ).to.equal('out')
    expect(
      comp.container
        .querySelector('.andy')
        ?.getAttribute('data-transition-state')
    ).to.equal('in')

    history.push('/users')
    await delay(300)
    expect(
      comp.container
        .querySelector('.home')
        ?.getAttribute('data-transition-state')
    ).to.equal('out')
    expect(
      comp.container
        .querySelector('.users')
        ?.getAttribute('data-transition-state')
    ).to.equal('entering')
    expect(
      comp.container
        .querySelector('.andy')
        ?.getAttribute('data-transition-state')
    ).to.equal('leaving')

    await delay(500)
    expect(
      comp.container
        .querySelector('.home')
        ?.getAttribute('data-transition-state')
    ).to.equal('out')
    expect(
      comp.container
        .querySelector('.users')
        ?.getAttribute('data-transition-state')
    ).to.equal('in')
    expect(
      comp.container
        .querySelector('.andy')
        ?.getAttribute('data-transition-state')
    ).to.equal(undefined)
  })
  it('animates transitions to index routes', async () => {
    init({ location: '/users/andy' })
    expect(
      comp.container
        .querySelector('.home')
        ?.getAttribute('data-transition-state')
    ).to.equal(undefined)
    expect(
      comp.container
        .querySelector('.users')
        ?.getAttribute('data-transition-state')
    ).to.equal(undefined)
    expect(
      comp.container
        .querySelector('.andy')
        ?.getAttribute('data-transition-state')
    ).to.equal('in')

    history.push('/users')
    await delay(300)
    expect(
      comp.container
        .querySelector('.home')
        ?.getAttribute('data-transition-state')
    ).to.equal(undefined)
    expect(
      comp.container
        .querySelector('.users')
        ?.getAttribute('data-transition-state')
    ).to.equal('entering')
    expect(
      comp.container
        .querySelector('.andy')
        ?.getAttribute('data-transition-state')
    ).to.equal('leaving')
    await delay(500)
    expect(
      comp.container
        .querySelector('.home')
        ?.getAttribute('data-transition-state')
    ).to.equal(undefined)
    expect(
      comp.container
        .querySelector('.users')
        ?.getAttribute('data-transition-state')
    ).to.equal('in')
    expect(
      comp.container
        .querySelector('.andy')
        ?.getAttribute('data-transition-state')
    ).to.equal(undefined)

    history.push('/')
    await delay(300)
    expect(
      comp.container
        .querySelector('.home')
        ?.getAttribute('data-transition-state')
    ).to.equal('entering')
    expect(
      comp.container
        .querySelector('.users')
        ?.getAttribute('data-transition-state')
    ).to.equal('leaving')
    expect(
      comp.container
        .querySelector('.andy')
        ?.getAttribute('data-transition-state')
    ).to.equal(undefined)
    await delay(500)
    expect(
      comp.container
        .querySelector('.home')
        ?.getAttribute('data-transition-state')
    ).to.equal('in')
    expect(
      comp.container
        .querySelector('.users')
        ?.getAttribute('data-transition-state')
    ).to.equal(undefined)
    expect(
      comp.container
        .querySelector('.andy')
        ?.getAttribute('data-transition-state')
    ).to.equal(undefined)
  })
  it('handles quick transitions back and forth gracefully', async () => {
    init()
    history.push('/users')
    await delay(50)
    history.push('/')
    await delay(50)
    history.push('/users')
    await delay(500)
    expect(
      comp.container
        .querySelector('.home')
        ?.getAttribute('data-transition-state')
    ).to.equal('leaving')
    expect(
      comp.container
        .querySelector('.users')
        ?.getAttribute('data-transition-state')
    ).to.equal('entering')
    expect(
      comp.container
        .querySelector('.andy')
        ?.getAttribute('data-transition-state')
    ).to.equal(undefined)
    await delay(500)
    expect(
      comp.container
        .querySelector('.home')
        ?.getAttribute('data-transition-state')
    ).to.equal(undefined)
    expect(
      comp.container
        .querySelector('.users')
        ?.getAttribute('data-transition-state')
    ).to.equal('in')
    expect(
      comp.container
        .querySelector('.andy')
        ?.getAttribute('data-transition-state')
    ).to.equal(undefined)
  })
})
