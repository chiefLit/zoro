import React from 'react'
import { NodeBox } from './components'
import './styles/index.less'
import { FlowContext, FlowProvider } from '@/context'
import { FlowTableData, FlowTableProps } from './types'
import { PropertiesDrawer } from './components/PropertiesDrawer'

interface FlowTableInstance {
  getNodeById: (id: string) => FlowTableData
}

const FlowTable = React.forwardRef<FlowTableInstance>((props, ref) => {
  const { flowData, getNodeById } = React.useContext(FlowContext)
  React.useImperativeHandle(ref, () => ({ getNodeById }))
  return <>
    <NodeBox data={flowData} />
    <PropertiesDrawer visible />
  </>
})

const App = React.forwardRef<FlowTableInstance, FlowTableProps>((props, ref) => {
  const flowTableRef = React.useRef<FlowTableInstance>(null)
  React.useImperativeHandle(ref, () => flowTableRef.current!)
  return (
    <div className="flow-table-wrapper">
      <FlowProvider {...props}>
        <FlowTable ref={flowTableRef} />
      </FlowProvider>
    </div>
  )
})

export default App
