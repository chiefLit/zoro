import React from 'react';
import { IDictionary } from '../../types';
import { PipelineBox } from '../PipelineBox';
import { NodeBox } from '../NodeBox';
import { getUniqId } from '../../utils';
import { GlobalContext } from '../../context';


interface AddNodeButtonProps {
  onClick?: () => void;
  belongPipelineBox: PipelineBox;
  fromNodeBox?: NodeBox;
}

const AddNodeButton: React.FC<AddNodeButtonProps> = (props) => {
  const { onClick, belongPipelineBox, fromNodeBox } = props;
  const { setFromNodeBox, setBelongPipelineBox, setAddNodeVisible } = React.useContext(GlobalContext);

  const handleClick = () => {
    setFromNodeBox(fromNodeBox || undefined)
    setBelongPipelineBox(belongPipelineBox)
    setAddNodeVisible(true)
  }
  if (fromNodeBox) {
    const { startNode, endNode } = fromNodeBox.getPoint(true)
    return endNode
      ? <circle cx={endNode.virtualBottomCenter.x} cy={endNode.virtualBottomCenter.y} r="10" onClick={() => handleClick()} />
      : <circle cx={startNode.virtualBottomCenter.x} cy={startNode.virtualBottomCenter.y} r="10" onClick={() => handleClick()} />
  } else {
    const { topCenter } = belongPipelineBox.getPoint(true)
    return <circle cx={topCenter.x} cy={topCenter.y} r="10" onClick={() => handleClick()} />
  }
}

export { AddNodeButton }