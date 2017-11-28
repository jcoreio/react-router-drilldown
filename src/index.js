/* @flow */
/* eslint-env shared-node-browser */

import * as React from 'react'
import PropTypes from 'prop-types'
import {matchPath} from 'react-router'
import type {Location} from 'react-router'
import DefaultViewSlider from 'react-view-slider/lib/simple'
import type {Props as ViewSliderProps} from 'react-view-slider/lib/simple'
import type {Prefixer} from 'inline-style-prefixer'
import invariant from 'invariant'
import warning from 'warning'

export type Props = {
  children?: any,
  location?: Location,
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

export function createDrilldown(config: {
  ViewSlider?: React.ComponentType<ViewSliderProps>,
} = {}): React.ComponentType<Props> {
  const ViewSlider = config.ViewSlider || DefaultViewSlider

  return class Drilldown extends React.Component<Props, void> {
    static contextTypes = {
      router: PropTypes.shape({
        route: PropTypes.object.isRequired
      }).isRequired
    }

    componentWillMount() {
      invariant(
        this.context.router,
        'You should not use <Drilldown> outside a <Router>'
      )
    }

    componentWillReceiveProps(nextProps: Props) {
      warning(
        !(nextProps.location && !this.props.location),
        '<Drilldown> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'
      )

      warning(
        !(!nextProps.location && this.props.location),
        '<Drilldown> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'
      )
    }

    render(): React.Node {
      const { route } = this.context.router
      const {
        children, animateHeight, transitionDuration, transitionTimingFunction, prefixer, fillParent, className, style,
        viewportClassName, viewportStyle,
      } = this.props
      const location = this.props.location || route.location

      let match, child, key = 0
      React.Children.forEach(children, (element: any) => {
        if (!React.isValidElement(element)) return

        const { path: pathProp, exact, strict, sensitive, from } = element.props
        const path = pathProp || from

        if (match == null) {
          child = element.key != null ? element : React.cloneElement(element, {key})
          match = path ? matchPath(location.pathname, { path, exact, strict, sensitive }) : route.match
        }
        key++
      })

      return (
        <ViewSlider
            animateHeight={animateHeight}
            transitionDuration={transitionDuration}
            transitionTimingFunction={transitionTimingFunction}
            prefixer={prefixer}
            fillParent={fillParent}
            className={className}
            style={style}
            viewportClassName={viewportClassName}
            viewportStyle={viewportStyle}
        >
          {match ? React.cloneElement((child: any), { location, computedMatch: match }) : null}
        </ViewSlider>
      )
    }
  }
}

export default createDrilldown()

