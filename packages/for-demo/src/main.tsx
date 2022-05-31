import React from 'react'
import ReactDOM from 'react-dom/client'
import { ExampleLayout } from './index'
import { Demo1 } from './components'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <ExampleLayout /> */}
    <Demo1 />
  </React.StrictMode>
)
