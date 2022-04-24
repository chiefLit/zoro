import React from "react";
import { IDictionary } from "../../types";
import { NodeBox } from "../NodeBox";
import { GroupNodeBox } from "../GroupNodeBox";
import useGlobalModel from '../../context'

interface PipelineProps {
  parentNodeBox?: NodeBox;
  pipelineData: IDictionary[];
  indexInNodeBox?: number;
}
/**
 * 管道
 * 根据 数据 决定定位
 * 根据 childrenNodeBoxs 决定宽高
 */
class Pipeline extends React.Component<PipelineProps> {
  constructor(props: PipelineProps) {
    super(props);
    if (props.pipelineData) {
      const { typeConfigs } = useGlobalModel()
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

  public indexInNodeBox: number = this.props.indexInNodeBox || 0;
  public parentNodeBox?: NodeBox = this.props.parentNodeBox;
  public parentPipeline?: Pipeline = this.props.parentNodeBox?.parentPipeline;
  public childrenNodeBoxs: NodeBox[] = [];
  public pipelineData: IDictionary[] = this.props.pipelineData;

  public getX = (): number => {
    if (this.parentNodeBox) {
      if (this.indexInNodeBox === 0) {
        return this.parentNodeBox.getX() - this.parentNodeBox.getWidth() / 2 + this.getWidth() / 2
      } else {
        const brother = this.parentNodeBox.childrenPipelines?.[this.indexInNodeBox - 1]!
        return brother.getX() + brother.getWidth() / 2 + this.getWidth() / 2
      }
    } else {
      return 0
    }
  };

  public getY = (): number => {
    if (this.parentNodeBox) {
      return this.parentNodeBox.getY() - this.parentNodeBox.getHeight() / 2 + this.getHeight() / 2 + this.parentNodeBox.node.virtualHeight
    } else {
      // 屏幕的上中点是center 所以需要初始高度
      return this.getHeight() / 2
    }
  };

  public getWidth = (): number => {
    return this.childrenNodeBoxs.reduce((sum, next) => Math.max(sum, next.getWidth()), 0)
  };

  public getHeight = (): number => {
    return this.childrenNodeBoxs.reduce((sum, next) => sum + next.getHeight(), 0)
  };

  public renderLine() {
    return this.childrenNodeBoxs.map(nodeBox => {
      return nodeBox.renderLine()
    })
  }

  public render() {
    return this.childrenNodeBoxs.map(nodeBox => {
      return nodeBox.render()
    })
  }
}

export { Pipeline }