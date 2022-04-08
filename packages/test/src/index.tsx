import React from 'react'
import { GlobalContext } from './context'
import { MoveStage, Toolbar, FlowContainer, MoveStageInstance } from './components'
import './styles/global.less'

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
  return (
    <GlobalContext.Provider initialState={{moveStageRef}}>
      <div style={{ width: '100%', height: '100vh', background: 'red' }}>
        <MoveStage header={<Toolbar />} ref={moveStageRef} >
          <FlowContainer/>
        </MoveStage>
      </div>
    </GlobalContext.Provider>
  )
})

export { ProcessorEngine }
export type { ProcessorEngineProps, ProcessorEngineRef }