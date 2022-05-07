import React from "react";
import { IDictionary, INodeBoxConfig, IPipelineConfig } from "../../types";
import { NodeBox } from "../NodeBox";
import useGlobalModel from '../../context'
import { getUniqId } from "../../utils";
import { DrawLine } from "../Line";

interface PipelineBoxProps {
  parentNodeBox?: NodeBox;
  pipelineData: IDictionary[];
  indexInNodeBox?: number;
}
/**
 * 管道
 * 根据 数据 决定定位
 * 根据 childrenNodeBoxs 决定宽高
 */
class PipelineBox extends React.Component<PipelineBoxProps> {
  constructor(props: PipelineBoxProps) {
    super(props);
    const { typeConfigs, nodeBoxConfig } = useGlobalModel()
    this.nodeBoxConfig = nodeBoxConfig
    if (props.pipelineData) {
      this.childrenNodeBoxs = props.pipelineData.map((item, index) => {
        const typeConfig: IDictionary = typeConfigs[item.type as keyof typeof typeConfigs]
        let nodeBox: NodeBox;
        // if (typeConfig && typeConfig.group) {
        //   nodeBox = new GroupNodeBox({ nodeData: item, parentPipeline: this, indexInPipeline: index });
        // } else {
        nodeBox = new NodeBox({ nodeData: item, parentPipeline: this, indexInPipeline: index });
        // }
        return nodeBox
      })
    }
  }

  // 业务数据
  public pipelineData: IDictionary[] = this.props.pipelineData;

  // NodeBox配置
  public nodeBoxConfig: INodeBoxConfig;

  // 在NodeBox中的索引
  public indexInNodeBox: number = this.props.indexInNodeBox || 0;

  // 父级NodeBox
  public parentNodeBox?: NodeBox = this.props.parentNodeBox;

  // 父级Pipeline
  public parentPipeline?: PipelineBox = this.props.parentNodeBox?.parentPipeline;

  // 子NodeBox
  public childrenNodeBoxs?: NodeBox[] = [];

  // 根Pipeline
  public rootPipeline: PipelineBox = this.props.parentNodeBox ? this.props.parentNodeBox.parentPipeline.rootPipeline : this

  public getX = (): number => {
    let x = 0;
    if (this.parentNodeBox) {
      if (this.indexInNodeBox === 0) {
        x = this.parentNodeBox.getX() - this.parentNodeBox.getWidth() / 2 + this.getWidth() / 2
      } else {
        const brother = this.parentNodeBox.childrenPipelines?.[this.indexInNodeBox - 1]!
        x = brother.getX() + brother.getWidth() / 2 + this.getWidth() / 2
      }
    }
    return x
  };

  public getY = (): number => {
    let y = 0;
    if (this.parentNodeBox) {
      y = this.parentNodeBox.getY() - this.parentNodeBox.getHeight() / 2 + this.getHeight() / 2 + NodeBox.nodeSelfSize.height
    } else {
      // 屏幕的上中点是center 所以需要初始高度
      y = this.getHeight() / 2
    }
    return y
  };

  public getWidth = (): number => {
    if (this.childrenNodeBoxs && this.childrenNodeBoxs.length) {
      return this.childrenNodeBoxs.reduce((sum, next) => Math.max(sum, next.getWidth()), 0)
    } else {
      return this.nodeBoxConfig.nodeSelfWidth
    }
  };

  public getHeight = (): number => {
    if (this.childrenNodeBoxs && this.childrenNodeBoxs.length) {
      return this.childrenNodeBoxs.reduce((sum, next) => sum + next.getHeight(), 0)
    } else {
      return 0
    }
  };

  public getBrotherMaxHeight = (): number => {
    if (this.parentNodeBox?.childrenPipelines) {
      return this.parentNodeBox?.childrenPipelines.reduce((sum, next) => Math.max(sum, next.getHeight()), 0)
    } else {
      return this.nodeBoxConfig.nodeSelfHieght
    }
  };

  public drawBox = () => {
    return <g>
      <rect
        key={`rect_${getUniqId()}`}
        x={this.getX() - this.getWidth() / 2 + this.rootPipeline.getWidth() / 2}
        y={this.getY() - this.getHeight() / 2}
        width={this.getWidth()}
        height={this.getBrotherMaxHeight()}
        strokeWidth="1"
        stroke='#00f'
        strokeDasharray={'1 2'}
        fill='#f00'
        opacity={0.1}
      />
      {this.childrenNodeBoxs?.map(nodeBox => nodeBox.drawBox())}
    </g>
  }

  public drawLine() {
    const x = this.getX() + this.rootPipeline.getWidth() / 2;
    const y = this.getY();
    const width = this.getWidth()
    const height = this.getHeight()
    const brotherMaxHeight = this.getBrotherMaxHeight()
    const points = {
      top: { x, y: y - height / 2 },
      divTop: { x, y: y - height / 2 },
      divBottom: { x, y: y + height / 2 },
      bottom: { x, y: y + height / 2 },
      boxBottom: {x, y: y - height/2 + brotherMaxHeight}
    }
    return <g>
      {/* <DrawLine start={points.top} end={points.divTop} />
      <DrawLine start={points.divBottom} end={points.bottom} /> */}
      {/* <DrawLine start={points.top} end={points.bottom} /> */}
      {/* <DrawLine start={{x:10,y:10}} end={points.bottom} /> */}
      {this.parentNodeBox?.childrenPipelines?.length && <DrawLine start={points.bottom} end={points.boxBottom} />}
      {this.childrenNodeBoxs?.map(nodeBox => nodeBox.drawLine())}
    </g>
  }

  public render() {
    return this.childrenNodeBoxs?.map(nodeBox => {
      return nodeBox.render()
    })
  }
}

export { PipelineBox }