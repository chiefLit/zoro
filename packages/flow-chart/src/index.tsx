import React from 'react'
import { Toolbar, PipelineBox, Config } from './components'
import './styles/global.less'
import mockData from './mock/flowData'
import useGlobalModel from './context'
import MoveStage from './components/MoveStage'

interface ProcessorEngineProps { }
interface ProcessorEngineRef { }


/**
 * 标准流程图
 */
const ProcessorEngine = React.forwardRef<ProcessorEngineRef, ProcessorEngineProps>((props, ref) => {
  const { } = props;
  const ProcessorEngineRef = React.useRef<ProcessorEngineRef>(null)
  React.useImperativeHandle(ref, () => ProcessorEngineRef.current!)

  const pipeline = new PipelineBox({ pipelineData: mockData })

  return (
    <div style={{ width: '100%', height: '100vh', background: 'red' }}>
      <MoveStage header={<Toolbar />} >
        <div style={{
          position: 'absolute',
          top: 0,
          left: -pipeline.getWidth() / 2 + 'px',
          width: pipeline.getWidth() + 'px',
          height: pipeline.getHeight() + 'px',
          background: '#ccc'
        }}>
          <svg width={pipeline.getWidth() + 'px'} height={pipeline.getHeight() + 'px'}>
            {pipeline.drawerBox()}
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