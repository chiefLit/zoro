import React from "react";
import { IDictionary } from "../../types";
import { NodeBox } from "../NodeBox";

interface PipelineProps {
  parentNodeBox?: NodeBox;
  pipelineData: IDictionary[];
  typeConfigs: any;
  indexInNodeBox?: number;
}
/**
 * 管道
 * 根据 数据 决定定位
 * 根据 childrenNodeBoxs 决定宽高
 */
class Pipeline {
  constructor(params: PipelineProps) {
    this.pipelineData = params.pipelineData;
    this.indexInNodeBox = params.indexInNodeBox || 0;
    if (this.pipelineData) {
      this.childrenNodeBoxs = this.pipelineData.map((item, index) => {
        const nodeBox = new NodeBox({ nodeData: item, typeConfigs: params.typeConfigs, parentPipeline: this, indexInPipeline: index });
        return nodeBox
      })
    }
    this.parentNodeBox = params.parentNodeBox;
  }
  public indexInNodeBox: number = 0;
  public parentNodeBox?: NodeBox;
  public childrenNodeBoxs: NodeBox[] = [];
  public pipelineData: IDictionary[];

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

  public render() {
    return this.childrenNodeBoxs.map(nodeBox => {
      return nodeBox.render()
    })
  }
}

export { Pipeline }