import React from 'react'
import { GlobalContext } from './context'
import { MoveStage, Toolbar, MoveStageInstance, NodeBox } from './components'
import './styles/global.less'
import { IDictionary } from './types'
import mockData from './mock/flowData'

interface ProcessorEngineProps { }
interface ProcessorEngineRef { }


/**
 * 标准流程图
 */
const ProcessorEngine = React.forwardRef<ProcessorEngineRef, ProcessorEngineProps>((props, ref) => {
  const { } = props;
  const ProcessorEngineRef = React.useRef<ProcessorEngineRef>(null)
  const moveStageRef = React.useRef<MoveStageInstance>(null)
  React.useImperativeHandle(ref, () => ProcessorEngineRef.current!)

  const typeConfigs = {
    branch: {
      branch: {}
    },
    group: {
      group: {}
    },
  }

  const fn = ({ nodeData }: { nodeData: IDictionary }) => {
    const nodeBox = new NodeBox({ businessData: nodeData, typeConfigs })
    if (nodeData.children) {
      nodeBox.setChildren(nodeData.children.map(item => fn({ nodeData: item })))
    }
    return nodeBox
  }

  const nodeBox = fn({ nodeData: { "id": "fRUmvbnvnMS", "type": "end", "displayName": "END", children: mockData } })

  return (
    <GlobalContext.Provider initialState={{ moveStageRef }}>
      <div style={{ width: '100%', height: '100vh', background: 'red' }}>
        <MoveStage header={<Toolbar />} ref={moveStageRef} >
          {nodeBox.render()}
        </MoveStage>
      </div>
    </GlobalContext.Provider>
  )
})

export { ProcessorEngine }
export type { ProcessorEngineProps, ProcessorEngineRef }