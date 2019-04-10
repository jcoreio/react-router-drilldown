// @flow
/* eslint-env browser */

import * as React from 'react'
import { render } from 'react-dom'
import { NestedDemo } from './Demo'

const root = document.getElementById('root')
if (!root) throw new Error('failed to get root element')

render(<NestedDemo />, root)
