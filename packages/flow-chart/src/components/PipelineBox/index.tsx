import React from "react";
import { IDictionary, ISpacing } from "../../types";
import { NodeBox } from "../NodeBox";
import { GroupNodeBox } from "../GroupNodeBox";
import useGlobalModel from '../../context'
import { getUniqId } from "../../utils";

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
    const { typeConfigs, pipelineBoxConfig } = useGlobalModel()
    this.pipelineBoxConfig = pipelineBoxConfig
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

  public pipelineBoxConfig: ISpacing;
  public indexInNodeBox: number = this.props.indexInNodeBox || 0;
  public parentNodeBox?: NodeBox = this.props.parentNodeBox;
  public parentPipeline?: PipelineBox = this.props.parentNodeBox?.parentPipeline;
  public childrenNodeBoxs: NodeBox[] = [];
  public pipelineData: IDictionary[] = this.props.pipelineData;
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
    } else {
      x = 0
    }
    return x 
  };

  public getY = (): number => {
    let y = 0;
    if (this.parentNodeBox) {
      y = this.parentNodeBox.getY() - this.parentNodeBox.getHeight() / 2 + this.getHeight() / 2 + this.parentNodeBox.nodeSelfSize.height
    } else {
      // 屏幕的上中点是center 所以需要初始高度
      y = this.getHeight() / 2 + this.pipelineBoxConfig.longitudinalSpacing / 2
    }
    return y
  };

  public getWidth = (): number => {
    return this.childrenNodeBoxs.reduce((sum, next) => Math.max(sum, next.getWidth()), 0) + this.pipelineBoxConfig.transverseSpacing
  };

  public getHeight = (): number => {
    return this.childrenNodeBoxs.reduce((sum, next) => sum + next.getHeight(), 0) + this.pipelineBoxConfig.longitudinalSpacing
  };

  public drawerBox = () => {
    return <g>
      <rect
        key={`rect_${getUniqId()}`}
        x={this.getX() - this.getWidth() / 2 + this.rootPipeline.getWidth() / 2}
        y={this.getY() - this.getHeight() / 2 - this.pipelineBoxConfig.longitudinalSpacing / 2}
        width={this.getWidth()}
        height={this.getHeight()}
        strokeWidth="1"
        fill='#f00'
        opacity={0.1}
      />
      {this.childrenNodeBoxs.map(nodeBox => nodeBox.drawerBox())}
    </g>
  }

  // public renderLine() {
  //   return this.childrenNodeBoxs.map(nodeBox => {
  //     return nodeBox.renderLine()
  //   })
  // }

  public render() {
    return this.childrenNodeBoxs.map(nodeBox => {
      return nodeBox.render()
    })
  }
}

export { PipelineBox }