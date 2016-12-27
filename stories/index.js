import React from 'react'
import {storiesOf} from '@kadira/storybook'
import {Router, Route, IndexRoute, Link, hashHistory, withRouter} from 'react-router'
import Drilldown from '../src/withTransitionContext'
import {TransitionListener} from 'react-transition-context'

const style = {margin: '15px auto', maxWidth: 600}

const Title = withRouter(({children, location: {pathname}}) => (
  <h1>
    <Link
        to={pathname.substring(0, pathname.lastIndexOf('/'))}
        style={{verticalAlign: 'middle', marginRight: 15}}
    >
      <span className="glyphicon glyphicon-menu-left" />
    </Link>
    {children}
  </h1>
))

const DrilldownLink = ({children, ...props}) => (
  <Link className="list-group-item" {...props}>
    <span style={{float: 'right'}} className="glyphicon glyphicon-menu-right" />
    {children}
  </Link>
)

const Home = () => (
  <div style={style}>
    <h1>Home</h1>
    <div className="list-group">
      <DrilldownLink to="/users">Users</DrilldownLink>
      <DrilldownLink to="/users/andy">Andy</DrilldownLink>
    </div>
  </div>
)

const Users = () => (
  <div style={style}>
    <Title>Users</Title>
    <div className="list-group">
      <DrilldownLink to="/users/andy">Andy</DrilldownLink>
    </div>
  </div>
)


class Andy extends React.Component {
  render() {
    return (
      <div style={style}>
        <Title>Andy</Title>
        <input ref={c => this.email = c} className="form-control" placeholder="email" />
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

