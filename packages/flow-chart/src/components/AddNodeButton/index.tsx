import React from 'react';
import { PointPosition } from '../../types';
import { PipelineBox } from '../PipelineBox';
import { NodeBox } from '../NodeBox';


interface AddNodeButtonProps {
  onClick?: () => void;
  belongPipeline: PipelineBox;
  formNode?: NodeBox;
}

const AddNodeButton: React.FC<AddNodeButtonProps> = (props) => {
  const { onClick, belongPipeline, formNode } = props;

  const handleClick = () => {
    console.log('%cindex.tsx line:17 belongPipeline', 'color: #007acc;', belongPipeline);
    console.log('%cindex.tsx line:17 formNode', 'color: #007acc;', formNode);
    onClick && onClick()
  }

  if (formNode) {
    const { startNode, endNode } = formNode.getPoint(true)
    return endNode
      ? <circle cx={endNode.virtualBottomCenter.x} cy={endNode.virtualBottomCenter.y} r="10" onClick={handleClick} />
      : <circle cx={startNode.virtualBottomCenter.x} cy={startNode.virtualBottomCenter.y} r="10" onClick={handleClick} />
  } else {
    const { topCenter } = belongPipeline.getPoint(true)
    return <circle cx={topCenter.x} cy={topCenter.y} r="10" onClick={handleClick} />
  }
}

export { AddNodeButton }