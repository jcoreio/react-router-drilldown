/* @flow */
/* eslint-env shared-node-browser */

import React, {Component} from 'react'
import size from 'lodash.size'
import Prefixer from 'inline-style-prefixer'

type Side = 'left' | 'right'
type TransitionState = 'in' | 'out' | 'entering' | 'leaving'

export type ChildProps = {
  side: Side,
  transitionState: TransitionState,
  children: any,
  style: Object,
}

type Route = {
  indexRoute?: Route,
}

export type Props = {
  className?: string,
  style?: Object,
  innerClassName?: string,
  innerStyle?: Object,
  route: Route,
  routes: Array<Route>,
  children: any,
  prefixer?: {+prefix: (styles: Object) => Object},
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
  const restProps = {...props}
  delete restProps.side
  delete restProps.transitionState

  return <div {...restProps} />
}

const defaultPrefixer = new Prefixer()

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
    timeouts: {[name: string]: number} = {}

    setTimeout(name: string, callback: () => any, delay: number) {
      if (this.timeouts[name]) clearTimeout(this.timeouts[name])
      this.timeouts[name] = setTimeout(callback, delay)
    }

    setStateLater(newState: $Shape<State>) {
      this.setTimeout('setState', () => this.setState(newState), 17)
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

    componentWillUpdate(nextProps: Props, nextState: State) {
      if (this.state.position && nextState.position && this.state.position !== nextState.position) {
        this.setTimeout('onTransitionEnd', this.onTransitionEnd, transitionTimeout)
      }
    }

    componentDidUpdate() {
      const targetSide = getSide(this.props)
      if (this.state.position === targetSide) return
      else if (this.state.transitioning) this.setStateLater({position: targetSide})
      else if (this.state.position) this.setStateLater({transitioning: true})
    }

    onTransitionEnd = () => {
      if (this.timeouts.onTransitionEnd) clearTimeout(this.timeouts.onTransitionEnd)
      const side = getSide(this.props)
      if (side !== this.state.position) return
      this.setState({
        [oppositeSide[side]]: null,
        position: null,
        transitioning: false,
      })
    }

    componentWillUnmount() {
      for (let name in this.timeouts) clearTimeout(this.timeouts[name])
    }

    render(): React.Element<any> {
      const {style, innerClassName, innerStyle, prefixer} = this.props
      const {left, right, position, transitioning} = this.state
      const {onTransitionEnd} = this

      const getTransitionState = (side: Side): TransitionState => {
        if (!position) return side === getSide(this.props) ? 'in' : 'out'
        return side === getSide(this.props) ? 'entering' : 'leaving'
      }

      const outerStyle = {
        overflow: 'hidden',
        ...style || {},
      }

      const finalInnerStyle = (prefixer || defaultPrefixer).prefix({
        whiteSpace: 'nowrap',
        transition: transitioning ? `transform ease-out ${transitionTimeout}ms` : '',
        transform: position === 'right' ? 'translateX(-100%)' : 'translateX(0)',
        ...innerStyle || {},
      })

      const childStyle = {
        width: '100%',
        display: 'inline-block',
        verticalAlign: 'top',
      }

      const restProps = {...this.props}
      delete restProps.style
      delete restProps.innerClassName
      delete restProps.innerStyle
      delete restProps.prefixer
      delete restProps.route
      delete restProps.routes
      delete restProps.children
      delete restProps.location
      delete restProps.params
      delete restProps.router
      delete restProps.routeParams

      return (
        <div style={outerStyle} {...restProps}>
          <div className={innerClassName} style={finalInnerStyle} onTransitionEnd={onTransitionEnd}>
            {left && renderChild({
              side: 'left',
              transitionState: getTransitionState('left'),
              children: left,
              style: childStyle,
            })}
            {right && renderChild({
              side: 'right',
              transitionState: getTransitionState('right'),
              children: right,
              style: childStyle,
            })}
          </div>
        </div>
      )
    }
  }
}

export default createDrilldown()

