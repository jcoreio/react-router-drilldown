// @flow

import React from 'react'
import {createDrilldown, defaultRenderChild} from './index'
import TransitionContext from 'react-transition-context'

import type {ChildProps} from './index'

const DrilldownChildWithTransitionContext = (props: ChildProps): React.Element<any> => (
  <TransitionContext transitionState={props.transitionState}>
    {defaultRenderChild(props)}
  </TransitionContext>
)

export default createDrilldown({
  renderChild: DrilldownChildWithTransitionContext,
})

