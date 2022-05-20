import React from 'react'
import { Toolbar, PipelineBox } from './components'
import './styles/global.less'
import MoveStage from './components/MoveStage'
import { AddNodeDrawer } from './businessComponents'
import { GlobalProvider, GlobalContext } from './context'

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
  return (
    <GlobalProvider data={value}>
      <GlobalContext.Consumer>
        {
          data => {
            const { flowData, sizeConfig, sceneZoomPercentage, addNodeVisible } = data
            const pipeline = new PipelineBox({ pipelineData: flowData || [], sizeConfig })
            return (
              <div style={{ width: '100%', height: '100vh' }}>
                <MoveStage header={<Toolbar />} sceneZoomPercentage={sceneZoomPercentage}>
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
          }
        }
      </GlobalContext.Consumer>
    </GlobalProvider>
  )
})

export { ProcessorEngine }
export type { ProcessorEngineProps, ProcessorEngineRef }