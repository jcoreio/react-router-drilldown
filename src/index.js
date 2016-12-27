/* @flow */
/* eslint-env shared-node-browser */

import React, {Component} from 'react'
import size from 'lodash.size'

type Side = 'left' | 'right'
type TransitionState = 'in' | 'out' | 'entering' | 'leaving'

type ChildProps = {
  side: Side,
  position: ?Side,
  transitioning: boolean,
  transitionState: TransitionState,
  transitionTimeout: number,
  child: any,
  onTransitionEnd: (callback: () => any) => any;
}

type Route = {
  indexRoute?: Route,
}

type Props = {
  className?: string,
  style?: Object,
  route: Route,
  routes: Array<Route>,
  renderChild: (props: ChildProps) => React.Element<any>,
  transitionTimeout: number,
  children: any,
}

type State = {
  // the child on the left side
  left: any,
  // the child on the right side
  right: any,
  // the side that should be showing
  position: ?Side,
  // whether to set the CSS transition property
  transitioning: boolean,
}

function getSide({route, routes}: Props): Side {
  return routes[routes.length - 1] === route.indexRoute ? 'left' : 'right'
}

const oppositeSide: {[side: Side]: Side} = {
  left: 'right',
  right: 'left',
}

export function defaultRenderChild(props: ChildProps): React.Element<any> {
  const {
    position,
    transitioning,
    transitionTimeout,
    child,
  } = props

  const transition = transitioning ? `transform ease-out ${transitionTimeout}ms` : ''
  const transform = position === 'right' ? 'translateX(-100%)' : 'translateX(0)'
  const style = {
    display: 'inline-block',
    width: '100%',
    transition,
    OTransition: transition,
    msTransition: transition,
    MozTransition: transition,
    KhtmlTransition: transition,
    WebkitTransition: transition,
    transform,
    OTransform: transform,
    msTransform: transform,
    MozTransform: transform,
    KhtmlTransform: transform,
    WebkitTransform: transform,
    verticalAlign: 'top',
    ...(props: Object).style || {},
  }

  const restProps = {...props}
  delete restProps.side
  delete restProps.position
  delete restProps.transitioning
  delete restProps.transitionState
  delete restProps.transitionTimeout
  delete restProps.child

  return (
    <div style={style} {...restProps}>
      {child}
    </div>
  )
}

export function createDrilldown(config: {
  renderChild?: (props: ChildProps) => React.Element<any>,
  transitionTimeout?: number,
} = {}): ReactClass<Props> {
  const transitionTimeout = config.transitionTimeout || 200
  const renderChild = config.renderChild || defaultRenderChild

  return class Drilldown extends Component<void, Props, State> {
    state: State = {
      [getSide(this.props)]: this.props.children,
      position: null,
      transitioning: false,
    }
    mounted: boolean = false
    setStateTimeout: ?number
    transitionTimeout: ?number

    componentWillMount() {
      this.mounted = true
    }

    componentWillReceiveProps(nextProps: Props) {
      const {children} = nextProps
      const currentSide = getSide(this.props)
      const targetSide = getSide(nextProps)
      const nextState: $Shape<State> = {}
      if (this.state[targetSide] !== children) nextState[targetSide] = children
      if (!this.state.position && targetSide !== currentSide) nextState.position = currentSide
      if (size(nextState)) this.setState(nextState)
    }

    setStateLater(newState: $Shape<State>) {
      if (this.setStateTimeout != null) clearTimeout(this.setStateTimeout)
      this.setStateTimeout = setTimeout(() => this.setState(newState), 17)
    }

    componentWillUpdate(nextProps: Props, nextState: State) {
      if (this.state.position && nextState.position && this.state.position !== nextState.position) {
        if (this.transitionTimeout != null) clearTimeout(this.transitionTimeout)
        this.transitionTimeout = setTimeout(this.onTransitionEnd, transitionTimeout)
      }
    }

    componentDidUpdate() {
      const targetSide = getSide(this.props)
      if (this.state.position === targetSide) return
      else if (this.state.transitioning) this.setStateLater({position: targetSide})
      else if (this.state.position) this.setStateLater({transitioning: true})
    }

    onTransitionEnd = () => {
      if (this.transitionTimeout != null) clearTimeout(this.transitionTimeout)
      const side = getSide(this.props)
      if (!this.mounted || side !== this.state.position) return
      this.setState({
        [oppositeSide[side]]: null,
        position: null,
        transitioning: false,
      })
    }

    componentWillUnmount() {
      if (this.transitionTimeout != null) clearTimeout(this.transitionTimeout)
      if (this.setStateTimeout != null) clearTimeout(this.setStateTimeout)
      this.mounted = false
    }

    render(): React.Element<any> {
      const {className, style} = this.props
      const {left, right, position, transitioning} = this.state
      const {onTransitionEnd} = this

      const getTransitionState = (side: Side): TransitionState => {
        if (!position) return side === getSide(this.props) ? 'in' : 'out'
        return side === getSide(this.props) ? 'entering' : 'leaving'
      }

      const finalStyle = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        ...style || {},
      }

      return (
        <div className={className} style={finalStyle}>
          {left && renderChild({
            side: 'left',
            position,
            transitioning,
            transitionState: getTransitionState('left'),
            transitionTimeout,
            onTransitionEnd,
            child: left,
          })}
          {right && renderChild({
            side: 'right',
            position,
            transitioning,
            transitionState: getTransitionState('right'),
            transitionTimeout,
            onTransitionEnd,
            child: right,
          })}
        </div>
      )
    }
  }
}

export default createDrilldown()

