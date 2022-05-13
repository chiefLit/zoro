import React from 'react'
import { Toolbar, PipelineBox, Config } from './components'
import './styles/global.less'
import useGlobalModel from './context'
import MoveStage from './components/MoveStage'
import { AddNodeDrawer } from './businessComponents'
import { Button } from 'antd'

interface ProcessorEngineProps {
  value: any[];
}
interface ProcessorEngineRef { }

/**
 * 标准流程图
 */
const ProcessorEngine = React.forwardRef<ProcessorEngineRef, ProcessorEngineProps>((props, ref) => {
  const { value } = props;
  const ProcessorEngineRef = React.useRef<ProcessorEngineRef>(null)
  React.useImperativeHandle(ref, () => ProcessorEngineRef.current!)
  const { addNodeVisible, setFlowData, flowData } = useGlobalModel()
  const pipeline = new PipelineBox({ pipelineData: value })
  // const [pipeline, setPipeline] = React.useState<PipelineBox>()

  // let pipeline: PipelineBox | undefined = undefined

  React.useEffect(() => {
    // const defaultPipeline = new PipelineBox({ pipelineData: value })
    setFlowData(value)
  }, [value])

  // if (flowData) {
  //   pipeline = new PipelineBox({ pipelineData: flowData })
  // }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <MoveStage header={<Toolbar />} >
        {
          pipeline
            ? <div style={{
              position: 'absolute',
              top: 0,
              left: -pipeline?.getWidth() / 2 + 'px',
              width: pipeline?.getWidth() + 'px',
              height: pipeline?.getHeight() + 'px',
              background: '#ccc'
            }}>
              <svg width={pipeline?.getWidth() + 'px'} height={pipeline?.getHeight() + 'px'}>
                {pipeline?.drawBox()}
                {pipeline?.drawLine()}
                {pipeline?.drawAddNodeButton()}
              </svg>
            </div>
            : null
        }
        {pipeline && pipeline?.render()}
      </MoveStage>
      <AddNodeDrawer visible={addNodeVisible} />
      {/* <Config /> */}
    </div>
  )
})

export { ProcessorEngine }
export type { ProcessorEngineProps, ProcessorEngineRef }