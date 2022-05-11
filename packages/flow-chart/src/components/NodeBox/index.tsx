import React from 'react'
import { Node } from '../Node'
import { IDictionary, INodeBoxConfig } from "../../types";
import { DrawLine } from '../Line';
import { PipelineBox } from '../PipelineBox';
import useGlobalModel from '../../context'
import { getUniqId } from '../../utils'
import { Point } from '../Point';

export interface NodeBoxProps {
  nodeData: IDictionary,
  parentPipeline: PipelineBox;
  indexInPipeline: number;
}

/**
 * 节点盒子
 */
export class NodeBox extends React.Component<NodeBoxProps> {
  constructor(props: NodeBoxProps) {
    super(props);
    const { nodeData, parentPipeline, indexInPipeline } = props
    this.node = new Node({ nodeBox: this, nodeData })
    this.nodeData = nodeData;
    const { typeConfigs, nodeBoxConfig } = useGlobalModel()
    this.nodeBoxConfig = nodeBoxConfig
    this.typeConfig = typeConfigs[nodeData.type as keyof typeof typeConfigs]
    this.parentPipeline = parentPipeline
    this.parentNodeBox = parentPipeline?.parentNodeBox
    this.indexInPipeline = indexInPipeline
    if (this.typeConfig?.branch) {
      this.childrenPipelines = this.nodeData.config?.branches?.map((item: any, index: number) => {
        return new PipelineBox({
          parentNodeBox: this,
          pipelineData: item.pipeline,
          indexInNodeBox: index
        })
      })
    } else if (this.typeConfig?.group) {
      const pipeline = new PipelineBox({
        parentNodeBox: this,
        pipelineData: this.nodeData.config?.group?.pipeline,
        indexInNodeBox: 0
      })
      this.childrenPipelines = [pipeline]
    }
    this.isBranch = this.nodeData.type === 'branch'
    this.isGroup = this.nodeData.type === 'group'
    this.isBranchOrGroup = this.isBranch || this.isGroup
    this.hasEnd = (this.isBranch && this.typeConfig.branch?.hasEnd)
      || (this.isGroup && this.typeConfig.group?.hasEnd);


    NodeBox.nodeSelfSize = {
      width: this.node.virtualWidth + this.nodeBoxConfig.transverseSpacing,
      height: this.node.virtualHeight + this.nodeBoxConfig.longitudinalSpacing
    };
  }

  public parentPipeline: PipelineBox;
  public parentNodeBox?: NodeBox;
  public childrenPipelines: PipelineBox[] = [];
  public isBranch: boolean;
  public isGroup: boolean;
  public isBranchOrGroup: boolean;
  public hasEnd: boolean;
  public nodeBoxConfig: INodeBoxConfig;

  public rootPipeline?: PipelineBox;

  // 业务数据
  public nodeData: IDictionary;

  // 节点配置
  public typeConfig: IDictionary;

  // 在父级的索引
  public indexInPipeline: number = 0;

  // 节点实例
  public node: Node;

  // 本体大小
  static nodeSelfSize: { width: number; height: number }

  public getCenterX = (): number => {
    return this.parentPipeline.getCenterX()
  }

  public getCenterY = (): number => {
    let y = 0;
    if (this.indexInPipeline === 0) {
      // 初始的时候加上间隔高度
      y = this.parentPipeline.getPoint().topCenter.y + this.getHeight() / 2
    } else {
      const brother = this.parentPipeline?.childrenNodeBoxs?.[this.indexInPipeline - 1]!
      y = brother.getCenterY() + brother.getHeight() / 2 + this.getHeight() / 2
      if (this.isBranchOrGroup) {
        y = y
      }
    }
    return y
  }

  public getWidth = (): number => {
    if (!this.childrenPipelines || this.childrenPipelines.length === 0) {
      return this.nodeBoxConfig.nodeSelfWidth
    } else {
      if (this.typeConfig?.branch) {
        return this.childrenPipelines.reduce((sum, next) => sum + next.getWidth(), 0) || this.nodeBoxConfig.nodeSelfWidth
      } else {
        return this.childrenPipelines.reduce((max, next) => Math.max(max, next.getWidth()), 0) || this.nodeBoxConfig.nodeSelfWidth
      }
    }
  };

  public getHeight = (): number => {
    if (!this.childrenPipelines || this.childrenPipelines.length === 0) {
      return this.nodeBoxConfig.nodeSelfHieght
    } else {
      if (this.isBranch) {
        // 子Pipeline的最大高度
        const maxChildPipelineHeight = this.childrenPipelines.reduce((max, next) => Math.max(max, next.getHeight()), 0)
        if (this.hasEnd) {
          return maxChildPipelineHeight + this.nodeBoxConfig.nodeSelfHieght * 2
        } else {
          return maxChildPipelineHeight + this.nodeBoxConfig.nodeSelfHieght
        }
      } else {
        // 子Pipeline的高度和
        const sumChildrenPipelinesHeight = this.childrenPipelines.reduce((sum, next) => sum + next.getHeight(), 0)
        if (this.isGroup) {
          if (this.hasEnd) {
            return sumChildrenPipelinesHeight + this.nodeBoxConfig.nodeSelfHieght * 2
          } else {
            return sumChildrenPipelinesHeight + this.nodeBoxConfig.nodeSelfHieght
          }
        } else {
          return sumChildrenPipelinesHeight + this.nodeBoxConfig.nodeSelfHieght
        }
      }
    }
  };

  public relativeNodeBox = {
    youngerBrother: () => this.parentPipeline.childrenNodeBoxs?.[this.indexInPipeline + 1],
    olderBrother: () => this.parentPipeline.childrenNodeBoxs?.[this.indexInPipeline + 1],
    youngerUncle: () => this.parentNodeBox?.parentPipeline.childrenNodeBoxs?.[this.parentNodeBox?.indexInPipeline + 1],
    olderUncle: () => this.parentNodeBox?.parentPipeline.childrenNodeBoxs?.[this.parentNodeBox?.indexInPipeline - 1],
  }

  public drawBox = () => {
    const { topLeft, endNode } = this.getPoint(true)
    const uniqId = getUniqId()
    return <g>
      <rect
        key={`rect_start_${uniqId}`}
        x={topLeft.x}
        y={topLeft.y}
        width={this.getWidth()}
        height={this.getHeight()}
        strokeWidth="1"
        stroke='#000000'
        strokeDasharray={'3 2'}
        fill='#00f'
        opacity={0.1}
      />
      {this.node.drawBox()}
      {this.childrenPipelines.map(item => item.drawBox())}
    </g>
  }

  public getPoint = (isSvg?: boolean) => {
    const rootPipelineWidth = this.parentPipeline.rootPipeline?.getWidth()
    const centerX = isSvg ? this.getCenterX() + rootPipelineWidth / 2 : this.getCenterX();
    const centerY = this.getCenterY();
    const width = this.getWidth()
    const height = this.getHeight();
    return {
      topLeft: {
        x: centerX - width / 2,
        y: centerY - height / 2
      },
      virtualTopCenter: {
        x: centerX,
        y: centerY - height / 2
      },
      topCenter: {
        x: centerX,
        y: centerY - height / 2 + this.nodeBoxConfig.longitudinalSpacing / 2
      },
      bottomCenter: {
        x: centerX,
        y: centerY - height / 2 + this.nodeBoxConfig.nodeSelfHieght - this.nodeBoxConfig.longitudinalSpacing / 2
      },
      virtualBottomCenter: {
        x: centerX,
        y: centerY - height / 2 + this.nodeBoxConfig.nodeSelfHieght
      },
      endNode: this.isBranchOrGroup && this.hasEnd
        ? {
          topLeft: {
            x: centerX - width / 2,
            y: centerY + height / 2 - this.nodeBoxConfig.nodeSelfHieght
          },
          virtualTopCenter: {
            x: centerX,
            y: centerY + height / 2 - this.nodeBoxConfig.nodeSelfHieght
          },
          topCenter: {
            x: centerX,
            y: centerY + height / 2 - this.nodeBoxConfig.nodeSelfHieght + this.nodeBoxConfig.longitudinalSpacing / 2
          },
          bottomCenter: {
            x: centerX,
            y: centerY + height / 2 - this.nodeBoxConfig.longitudinalSpacing / 2
          },
          virtualBottomCenter: {
            x: centerX,
            y: centerY + height / 2
          },
        }
        : null
    }
  }

  public drawLine = () => {
    const { topCenter, bottomCenter, virtualTopCenter, virtualBottomCenter, endNode } = this.getPoint(true)
    return <g>
      {/* 间距产生的线段 */}
      <DrawLine start={virtualTopCenter} end={topCenter} />
      <DrawLine start={bottomCenter} end={virtualBottomCenter} />
      {endNode && <DrawLine start={endNode.virtualTopCenter} end={endNode.topCenter} />}
      {endNode && <DrawLine start={endNode.bottomCenter} end={endNode.virtualBottomCenter} />}
      {/* 分支组产生的线段 */}
      {
        this.childrenPipelines && this.childrenPipelines.length &&
        this.childrenPipelines.map(pipeline => {
          const pipelinePoint = pipeline.getPoint(true)
          return <>
            <DrawLine start={virtualBottomCenter} end={pipelinePoint.virtualTopCenter} />
            {endNode && <DrawLine start={pipelinePoint.maxBottomCenter} end={endNode?.virtualTopCenter} />}
          </>
        })
      }
      {this.node.drawLine()}
      {this.childrenPipelines.map(pipeline => pipeline.drawLine())}
    </g>
  }

  public drawAddNodeButton = () => {
    const x = this.getCenterX() + this.parentPipeline.rootPipeline.getWidth() / 2;
    const y = this.getCenterY() + this.getHeight() / 2 - this.nodeBoxConfig.longitudinalSpacing / 2;
    return <g>
      <circle cx={x} cy={y} r="10" />
      {this.childrenPipelines.map(item => item.drawAddNodeButton())}
    </g>
  }

  public render() {
    return <div key={this.nodeData.id}>
      {this.node.render()}
      {this.childrenPipelines?.map(item => item.render())}
    </div>
  }
}
