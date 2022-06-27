import React from 'react'
import { NodeBox } from './components'
import { mock1 } from './mock'
import './styles/index.less'
import { FlowContext, FlowProvider } from '@/context'
import { FlowTableData } from './types'
import { PropertiesDrawer } from './components/PropertiesDrawer'

const FlowTable = () => {
  const { flowData } = React.useContext(FlowContext)
  return <>
    <NodeBox data={flowData} />
    <PropertiesDrawer visible />
  </>
}

function App() {
  return (
    <div className="flow-table-wrapper">
      <FlowProvider data={mock1}>
        <FlowTable />
      </FlowProvider>
    </div>
  )
}

export default App
