import React from 'react'
import ReactDOM from 'react-dom'
import { ProcessorEngine } from './index'
import mockData from './mock/flowData'

ReactDOM.render(
  <React.StrictMode>
    <ProcessorEngine value={mockData} />
  </React.StrictMode>,
  document.getElementById('root')
)
