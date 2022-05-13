import React from 'react';
import { PointPosition } from '../../types';
import { PipelineBox } from '../PipelineBox';
import { NodeBox } from '../NodeBox';
import useGlobalModel from '../../context'
import { getUniqId } from '../../utils';


interface AddNodeButtonProps {
  onClick?: () => void;
  belongPipelineBox: PipelineBox;
  fromNodeBox?: NodeBox;
}

const AddNodeButton: React.FC<AddNodeButtonProps> = (props) => {
  const { onClick, belongPipelineBox, fromNodeBox } = props;
  const { setFromNodeBox, setBelongPipelineBox, setAddNodeVisible, flowData, setFlowData } = useGlobalModel()

  const handleClick = () => {
    setFromNodeBox(fromNodeBox)
    setBelongPipelineBox(belongPipelineBox)
    // setAddNodeVisible(true)

    // 调试代码 
    const mockNode = { displayName: '132', type: 'query12', id: getUniqId() }
    if (!flowData) return
    if (fromNodeBox) {
      let targetPipeline = JSON.parse(JSON.stringify(flowData));
      let pathList = fromNodeBox.path
      const lastIndex = pathList.pop() as number
      pathList.forEach(i => {
        targetPipeline = targetPipeline?.[i]
      })
      console.log('%cindex.tsx line:35 flowData', 'color: #007acc;', flowData);
      console.log('%cindex.tsx line:45 fromNodeBox.path', 'color: #007acc;', fromNodeBox.path);
      console.log('%cindex.tsx line:35 lastIndex', 'color: #007acc;', lastIndex);
      console.log('%cindex.tsx line:35 targetPipeline', 'color: #007acc;', targetPipeline);
      // if (targetPipeline) {
      //   targetPipeline.splice(lastIndex, 0 ,mockNode)
      // }
      // setFlowData(targetPipeline)
    } else {
      let targetPipeline = JSON.parse(JSON.stringify(flowData));
      belongPipelineBox.path.forEach(i => {
        targetPipeline = targetPipeline?.[i]
      })
      console.log('%cindex.tsx line:45 flowData', 'color: #007acc;', flowData);
      console.log('%cindex.tsx line:45 belongPipelineBox.path', 'color: #007acc;', belongPipelineBox.path);
      console.log('%cindex.tsx line:35 targetPipeline', 'color: #007acc;', targetPipeline);
      if (targetPipeline) {
        (targetPipeline as any).pipeline = (targetPipeline as any)?.pipeline || []
        targetPipeline.pipeline = [mockNode, ...(targetPipeline as any)?.pipeline]
      }
      // setFlowData(targetPipeline)
    }
  }

  if (fromNodeBox) {
    const { startNode, endNode } = fromNodeBox.getPoint(true)
    return endNode
      ? <circle cx={endNode.virtualBottomCenter.x} cy={endNode.virtualBottomCenter.y} r="10" onClick={handleClick} />
      : <circle cx={startNode.virtualBottomCenter.x} cy={startNode.virtualBottomCenter.y} r="10" onClick={handleClick} />
  } else {
    const { topCenter } = belongPipelineBox.getPoint(true)
    return <circle cx={topCenter.x} cy={topCenter.y} r="10" onClick={handleClick} />
  }
}

export { AddNodeButton }