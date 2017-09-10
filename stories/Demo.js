import React from 'react'
import PropTypes from 'prop-types'
import {HashRouter, Route, Link, withRouter} from 'react-router-dom'
import Drilldown from '../src/withTransitionContext'
import {TransitionListener} from 'react-transition-context'

const style = {margin: '15px auto', maxWidth: 600}

const BaseTitle = ({children, match}, {rtl}) => (
  <h1>
    <Link
        to={match.url.substring(0, match.url.lastIndexOf('/')) || '/'}
        style={{verticalAlign: 'middle', marginRight: 15}}
    >
      <span
          style={{float: rtl ? 'right' : 'left'}}
          className={`glyphicon glyphicon-menu-${rtl ? 'right' : 'left'}`}
      />
    </Link>
    {children}
  </h1>
)
BaseTitle.contextTypes = {rtl: PropTypes.bool}
const Title = withRouter(BaseTitle)

const DrilldownLink = ({children, ...props}, {rtl}) => (
  <Link className="list-group-item" {...props}>
    <span style={{float: rtl ? 'left' : 'right'}} className={`glyphicon glyphicon-menu-${rtl ? 'left' : 'right'}`} />
    {children}
  </Link>
)
DrilldownLink.contextTypes = {rtl: PropTypes.bool}

const Home = ({match}) => (
  <div style={style}>
    <h1>react-router-drilldown demo</h1>
    <div className="list-group">
      <DrilldownLink to="/users">Users</DrilldownLink>
      <DrilldownLink to="/users/andy">Andy</DrilldownLink>
    </div>
  </div>
)

const Users = ({match}) => (
  <div style={style}>
    <Title>Users</Title>
    <div className="list-group">
      <DrilldownLink to={`${match.url}/andy`}>Andy</DrilldownLink>
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

const FlatDemo = () => (
  <HashRouter>
    <Drilldown>
      <Route exact path="/" component={Home} />
      <Route exact path="/users" component={Users} />
      <Route path="/users/andy" component={Andy} />
    </Drilldown>
  </HashRouter>
)

export default FlatDemo

export class RtlDemo extends React.Component {
  static childContextTypes = {
    rtl: PropTypes.bool,
  }
  getChildContext() {
    return {rtl: true}
  }
  render() {
    return (
      <HashRouter>
        <Drilldown>
          <Route key={2} exact path="/" component={Home} />
          <Route key={1} exact path="/users" component={Users} />
          <Route key={0} path="/users/andy" component={Andy} />
        </Drilldown>
      </HashRouter>
    )
  }
}

const UsersRoute = ({match}) => (
  <Drilldown>
    <Route key={0} exact path={match.path} component={Users} />
    <Route key={1} path={`${match.url}/andy`} component={Andy} />
  </Drilldown>
)

export const NestedDemo = () => (
  <HashRouter>
    <Drilldown>
      <Route key={0} exact path="/" component={Home} />
      <Route key={1} path="/users" component={UsersRoute} />
    </Drilldown>
  </HashRouter>
)

