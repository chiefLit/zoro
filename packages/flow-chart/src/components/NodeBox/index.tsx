import React from 'react'
import { Node } from '../Node'
import { IDictionary, PointPosition } from "../../types";
import { DrawerLine } from '../Line';
import { Pipeline } from '../Pipeline';

interface NodeBoxProps {
  nodeData: IDictionary,
  typeConfigs: any;
  parentPipeline: Pipeline;
  indexInPipeline: number;
}

/**
 * 节点盒子
 */
export class NodeBox {
  constructor(params: NodeBoxProps) {
    const { nodeData, typeConfigs, parentPipeline, indexInPipeline } = params
    this.node = new Node({ nodeBox: this, nodeData })
    this.nodeData = nodeData;
    this.typeConfig = typeConfigs[nodeData.type]
    this.typeConfigs = typeConfigs
    this.parentPipeline = parentPipeline
    this.indexInPipeline = indexInPipeline
    if (this.typeConfig?.branch) {
      this.childrenPipelines = this.nodeData.config?.branches?.map((item, index) => {
        return new Pipeline({
          parentNodeBox: this,
          pipelineData: item.pipeline,
          typeConfigs: this.typeConfigs,
          indexInNodeBox: index
        })
      })
    } else if (this.typeConfig?.group) {
      const pipeline = new Pipeline({
        parentNodeBox: this,
        pipelineData: this.nodeData.config?.group?.pipeline,
        typeConfigs: this.typeConfigs,
        indexInNodeBox: 0
      })
      this.childrenPipelines = [pipeline]
    }
  }

  public parentPipeline: Pipeline;
  public childrenPipelines: Pipeline[] = [];

  private rootPipeline?: Pipeline;

  /**
   * 业务数据
   */
  private nodeData: IDictionary;

  /**
   * 业务数据
   */
  public typeConfig: IDictionary;
  public typeConfigs: IDictionary[];

  /**
   * 在父级的索引
   */
  public indexInPipeline: number = 0;

  /**
   * 节点实例
   */
  public node: Node;

  public getWidth = (): number => {
    if (!this.childrenPipelines || this.childrenPipelines.length === 0) {
      return this.node.virtualWidth
    } else {
      if (this.typeConfig?.branch) {
        return this.childrenPipelines.reduce((sum, next) => sum + next.getWidth(), 0)
      } else {
        return this.childrenPipelines.reduce((max, next) => Math.max(max, next.getWidth()), 0)
      }
    }
  };

  public getHeight = (): number => {
    if (!this.childrenPipelines || this.childrenPipelines.length === 0) {
      return this.node.virtualHeight
    } else {
      if (this.typeConfig?.branch) {
        return this.childrenPipelines.reduce((max, next) => Math.max(max, next.getHeight()), 0) + this.node.virtualHeight * 2
      } else if (this.typeConfig?.group) {
        return this.childrenPipelines.reduce((sum, next) => sum + next.getHeight(), 0) + this.node.virtualHeight * 2
      } else {
        return this.childrenPipelines.reduce((sum, next) => sum + next.getHeight(), 0) + this.node.virtualHeight
      }
    }
  };

  public getX = (): number => {
    return this.parentPipeline.getX()
  }

  public getY = (): number => {
    if (this.indexInPipeline === 0) {
      return this.parentPipeline.getY() - this.parentPipeline.getHeight() / 2 + this.getHeight() / 2
    } else {
      const brother = this.parentPipeline?.childrenNodeBoxs[this.indexInPipeline - 1]!
      return brother.getY() + brother.getHeight() / 2 + this.getHeight() / 2
    }
  }

  public renderLine() {
    this.rootPipeline = this.parentPipeline.parentNodeBox ? this.parentPipeline.parentNodeBox.rootPipeline! : this.parentPipeline!;
    // const start = this.node.getPositionCoordinate()[0]?.top!
    // const end = this.node.getPositionCoordinate()[0]?.bottom!
    // if (this.parentNodeBox === this) {
    //   // 我是我爹，我没有爸爸
    //   if (this.myIndex !== 0) {
    //     // 我不是老大
    //     const branch = this.parentNodeBox.children[this.myIndex - 1];
    //     if (branch.typeConfig.branch || branch.typeConfig.group) {
    //       // 我哥不是单一节点
    //     } else {
    //       // 我哥是单一节点
    //     }
    //   }
    // } else {
    let start: PointPosition;
    let end: PointPosition = this.node.getPositionCoordinate()[0]?.top!
    if (this.indexInPipeline === 0) {
      // 我是老大，找爹的开始节点
      // if (this.parentNodeBox === this) return
      start = this.parentPipeline.parentNodeBox?.node.getPositionCoordinate()[0]?.bottom!;
    } else {
      // 我不是老大
      const branch = this.parentPipeline.childrenNodeBoxs[this.indexInPipeline - 1];
      if (branch.typeConfig?.branch || branch.typeConfig?.group) {
        // 我哥不是单一节点
        start = branch.node.getPositionCoordinate()[1]?.bottom!;
      } else {
        // 我哥是单一节点
        start = branch.node.getPositionCoordinate()[0]?.bottom!;
      }
    }
    // }
    return <>
      <DrawerLine
        start={{ x: start?.x! + this.rootPipeline.getWidth() / 2, y: start?.y! }}
        end={{ x: end?.x! + this.rootPipeline.getWidth() / 2, y: end?.y! }}
      />
      {this.childrenPipelines.map(item => <>{item.childrenNodeBoxs.map(box => box.renderLine())}</>)}
    </>
  }

  public render() {
    return <div key={this.nodeData.id}>
      {this.node.render()}
      {this.childrenPipelines?.map(item => item.render())}
    </div>
  }
}
