/* eslint-env shared-node-browser */
import * as React from 'react'
import { matchPath, withRouter } from 'react-router'
import type { Location, History } from 'history'
import type { match } from 'react-router'
import DefaultViewSlider from 'react-view-slider/simple'
import type { SimpleViewSliderProps as ViewSliderProps } from 'react-view-slider/simple'
import type { Prefix } from 'inline-style-prefixer'
import warning from 'warning'

export type Props = {
  location?: Location | null | undefined
  children?: any
  animateHeight?: boolean | null | undefined
  keepViewsMounted?: boolean | null | undefined
  keepPrecedingViewsMounted?: boolean | null | undefined
  transitionDuration?: number | null | undefined
  transitionTimingFunction?: string | null | undefined
  prefixer?: Prefix | null | undefined
  fillParent?: boolean | null | undefined
  className?: string | null | undefined
  style?: any | null | undefined
  viewportClassName?: string | null | undefined
  viewportStyle?: any | null | undefined
  viewStyle?: any | null | undefined
  innerViewWrapperStyle?: any | null | undefined
}
export type InnerProps = {
  children?: any
  animateHeight?: boolean | null | undefined
  keepViewsMounted?: boolean | null | undefined
  keepPrecedingViewsMounted?: boolean | null | undefined
  transitionDuration?: number | null | undefined
  transitionTimingFunction?: string | null | undefined
  prefixer?: Prefix | null | undefined
  fillParent?: boolean | null | undefined
  className?: string | null | undefined
  style?: any | null | undefined
  viewportClassName?: string | null | undefined
  viewportStyle?: any | null | undefined
  viewStyle?: any | null | undefined
  innerViewWrapperStyle?: any | null | undefined
  history: History
  staticContext?: {
    url?: string
  }
  location: Location
  match: match
  overrideLocation: Location | null | undefined
}

export function createDrilldown(
  config: {
    ViewSlider?: React.ComponentType<ViewSliderProps>
  } = {}
): React.ComponentType<Props> {
  const ViewSlider = config.ViewSlider || DefaultViewSlider

  class Drilldown extends React.Component<InnerProps, undefined> {
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

    render(): React.ReactElement {
      const {
        children,
        animateHeight,
        keepViewsMounted,
        keepPrecedingViewsMounted,
        transitionDuration,
        transitionTimingFunction,
        prefixer,
        fillParent,
        className,
        style,
        viewportClassName,
        viewportStyle,
        viewStyle,
        innerViewWrapperStyle,
        match: _match,
        location: _location,
        overrideLocation,
      } = this.props
      const location = overrideLocation || _location
      let match: match | null | undefined,
        child,
        key = 0
      React.Children.forEach(children, (element: any) => {
        if (!React.isValidElement(element)) return

        const {
          path: pathProp,
          exact,
          strict,
          sensitive,
          from,
        }: {
          path?: string
          from?: string
          exact?: boolean
          strict?: boolean
          sensitive?: boolean
        } = element.props as any
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
          keepViewsMounted={keepViewsMounted}
          keepPrecedingViewsMounted={keepPrecedingViewsMounted}
          transitionDuration={transitionDuration}
          transitionTimingFunction={transitionTimingFunction}
          prefixer={prefixer}
          fillParent={fillParent}
          className={className}
          style={style}
          viewportClassName={viewportClassName}
          viewportStyle={viewportStyle}
          viewStyle={viewStyle}
          innerViewWrapperStyle={innerViewWrapperStyle}
        >
          {match
            ? React.cloneElement(child as any, {
                location,
                computedMatch: match,
              })
            : null}
        </ViewSlider>
      )
    }
  }

  const Drilldown2 = withRouter(Drilldown as any)

  const Drilldown3 = (props: Props) => (
    <Drilldown2 {...(props as any)} overrideLocation={props.location} />
  )

  return Drilldown3
}
export default createDrilldown()
