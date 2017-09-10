import React from 'react'
import {storiesOf} from '@kadira/storybook'
import FlatDemo, {NestedDemo, RtlDemo} from './Demo'

storiesOf('react-router-drilldown', module)
  .add('Flat', FlatDemo)
  .add('Nested', NestedDemo)
  .add('Right-to-Left', () => <RtlDemo />)

