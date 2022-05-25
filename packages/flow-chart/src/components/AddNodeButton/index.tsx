import React from 'react';
import { PipelineBox } from '../PipelineBox';
import { NodeBox } from '../NodeBox';
import { GlobalContext } from '../../context';


interface AddNodeButtonProps {
  onClick?: () => void;
  belongPipelineBox: PipelineBox;
  fromNodeBox?: NodeBox;
}

const AddNodeButton: React.FC<AddNodeButtonProps> = (props) => {
  const { onClick, belongPipelineBox, fromNodeBox } = props;
  const { setFromNodeBox, setBelongPipelineBox, setAddNodeVisible } = React.useContext(GlobalContext);

  const circleProps: React.SVGProps<SVGCircleElement> = {
    style: { cursor: 'pointer' },
    r: 10,
    onClick: () => {
      setFromNodeBox(fromNodeBox || undefined)
      setBelongPipelineBox(belongPipelineBox)
      setAddNodeVisible(true)
      onClick && onClick()
    }
  }

  if (fromNodeBox) {
    // 有哥哥
    const { startNode, endNode } = fromNodeBox.getPoint(true)
    circleProps.cx = endNode ? endNode.virtualBottomCenter.x : startNode.virtualBottomCenter.x
    circleProps.cy = endNode ? endNode.virtualBottomCenter.y : startNode.virtualBottomCenter.y
  } else {
    const { topCenter } = belongPipelineBox.getPoint(true)
    circleProps.cx = topCenter.x
    circleProps.cy = topCenter.y
  }
  return <circle {...circleProps} />
}

export { AddNodeButton }