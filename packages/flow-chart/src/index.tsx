import React from 'react'
import { MoveStage, Toolbar, MoveStageInstance, Pipeline, Config } from './components'
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

  const pipeline = new Pipeline({ pipelineData: mockData, typeConfigs })

  return (
    <div style={{ width: '100%', height: '100vh', background: 'red' }}>
      <MoveStage header={<Toolbar />} ref={moveStageRef} >
        <div style={{
          position: 'absolute',
          top: pipeline.getHeight() / 2,
          left: 0,
          width: pipeline.getWidth() + 'px',
          height: pipeline.getHeight() + 'px',
          background: '#ccc',
          transform: 'translate(-50%, -50%)'
        }}>
          <svg width={pipeline.getWidth() + 'px'} height={pipeline.getHeight() + 'px'}>
            {/* {pipeline.renderLine()} */}
          </svg>
        </div>
        {pipeline.render()}
      </MoveStage>
      {/* <Config /> */}
    </div>
  )
})

export { ProcessorEngine }
export type { ProcessorEngineProps, ProcessorEngineRef }