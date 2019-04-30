/* @flow */
/* eslint-env shared-node-browser */

import * as React from 'react'
import { matchPath, withRouter } from 'react-router'
import type { Location, Match } from 'react-router'
import DefaultViewSlider from 'react-view-slider/simple'
import type { Props as ViewSliderProps } from 'react-view-slider/simple'
import type { Prefixer } from 'inline-style-prefixer'
import warning from 'warning'

export type Props = {
  children?: any,
  location: Location,
  match: Match,
  animateHeight?: boolean,
  transitionDuration?: number,
  transitionTimingFunction?: string,
  prefixer?: Prefixer,
  fillParent?: boolean,
  className?: string,
  style?: Object,
  viewportClassName?: string,
  viewportStyle?: Object,
  viewStyle?: ?Object,
}

type InnerProps = Props & {
  overrideLocation?: ?Location,
}

export function createDrilldown(
  config: {
    ViewSlider?: React.ComponentType<ViewSliderProps>,
  } = {}
): React.ComponentType<Props> {
  const ViewSlider = config.ViewSlider || DefaultViewSlider

  class Drilldown extends React.Component<InnerProps, void> {
    componentDidUpdate(prevProps: InnerProps) {
      warning(
        !(prevProps.overrideLocation && !this.props.overrideLocation),
        '<Drilldown> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'
      )

      warning(
        !(!prevProps.overrideLocation && this.props.overrideLocation),
        '<Drilldown> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'
      )
    }

    render(): React.Node {
      const {
        children,
        animateHeight,
        transitionDuration,
        transitionTimingFunction,
        prefixer,
        fillParent,
        className,
        style,
        viewportClassName,
        viewportStyle,
        viewStyle,
        match: _match,
        location: _location,
        overrideLocation,
      } = this.props
      const location = overrideLocation || _location

      let match,
        child,
        key = 0
      React.Children.forEach(children, (element: any) => {
        if (!React.isValidElement(element)) return

        const { path: pathProp, exact, strict, sensitive, from } = element.props
        const path = pathProp || from

        if (match == null) {
          child =
            element.key != null ? element : React.cloneElement(element, { key })
          match = path
            ? matchPath(location.pathname, { path, exact, strict, sensitive })
            : _match
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
          viewStyle={viewStyle}
        >
          {match
            ? React.cloneElement((child: any), {
                location,
                computedMatch: match,
              })
            : null}
        </ViewSlider>
      )
    }
  }

  const Drilldown2 = withRouter(Drilldown)
  const Drilldown3 = (props: Props) => (
    <Drilldown2 {...props} overrideLocation={props.location} />
  )
  return Drilldown3
}

export default createDrilldown()
