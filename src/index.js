/* @flow */
/* eslint-env shared-node-browser */

import React, {Component} from 'react'
import DefaultViewSlider from 'react-view-slider'
import type {ViewProps, Props as ViewSliderProps} from 'react-view-slider'
import type {Prefixer} from 'inline-style-prefixer'

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
  path?: string,
}

export type Props = {
  route: Route,
  routes: Array<Route>,
  children?: any,
  animateHeight?: boolean,
  transitionDuration?: number,
  transitionTimingFunction?: string,
  prefixer?: Prefixer,
  fillParent?: boolean,
  className?: string,
  style?: Object,
  viewportClassName?: string,
  viewportStyle?: Object,
}

type State = {
  children: [any, any],
}

function getActiveView({route, routes}: Props): number {
  return routes[routes.length - 1] === route.indexRoute ? 0 : 1
}

export function createDrilldown(config: {
  ViewSlider?: ReactClass<ViewSliderProps>,
} = {}): ReactClass<Props> {
  return class Drilldown extends Component<void, Props, State> {
    state: State

    constructor(props: Props) {
      super(props)
      const children: [any, any] = [null, null]
      children[getActiveView(props)] = props.children
      this.state = {children}
    }

    componentWillReceiveProps(nextProps: Props) {
      const {children} = nextProps
      const viewIndex = getActiveView(nextProps)
      if (this.state.children[viewIndex] !== children) {
        const newChildren = [...this.state.children]
        newChildren[viewIndex] = children
        this.setState({children: newChildren})
      }
    }

    renderView = ({index, key, ref, style, transitionState}: ViewProps): React.Element<any> => (
      <div key={key} ref={ref} style={style} data-transition-state={transitionState}>
        {this.state.children[index]}
      </div>
    )

    render(): React.Element<any> {
      const {
        animateHeight, transitionDuration, transitionTimingFunction, prefixer, fillParent, className, style,
        viewportClassName, viewportStyle,
      } = this.props

      const ViewSlider = config.ViewSlider || DefaultViewSlider

      return (
        <ViewSlider
            numViews={2}
            activeView={getActiveView(this.props)}
            renderView={this.renderView}
            animateHeight={animateHeight}
            transitionDuration={transitionDuration}
            transitionTimingFunction={transitionTimingFunction}
            prefixer={prefixer}
            fillParent={fillParent}
            className={className}
            style={style}
            viewportClassName={viewportClassName}
            viewportStyle={viewportStyle}
        />
      )
    }
  }
}

export default createDrilldown()

