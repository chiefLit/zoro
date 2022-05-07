import React from 'react'
import { Node } from '../Node'
import { IDictionary, INodeBoxConfig } from "../../types";
import { DrawLine } from '../Line';
import { PipelineBox } from '../PipelineBox';
import useGlobalModel from '../../context'
import { getUniqId } from '../../utils'

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

  public getX = (): number => {
    return this.parentPipeline.getX()
  }

  public getY = (): number => {
    let y = 0;
    if (this.indexInPipeline === 0) {
      // 初始的时候加上间隔高度
      y = this.parentPipeline.getY() - this.parentPipeline.getHeight() / 2 + this.getHeight() / 2 + this.nodeBoxConfig.longitudinalSpacing / 2
    } else {
      const brother = this.parentPipeline?.childrenNodeBoxs?.[this.indexInPipeline - 1]!
      y = brother.getY() + brother.getHeight() / 2 + this.getHeight() / 2
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
          return maxChildPipelineHeight + this.nodeBoxConfig.nodeSelfHieght * 2 + this.nodeBoxConfig.longitudinalSpacing
        } else {
          return maxChildPipelineHeight + this.nodeBoxConfig.nodeSelfHieght + this.nodeBoxConfig.longitudinalSpacing
        }
      } else {
        // 子Pipeline的高度和
        const sumChildrenPipelinesHeight = this.childrenPipelines.reduce((sum, next) => sum + next.getHeight(), 0)
        if (this.isGroup) {
          if (this.hasEnd) {
            return sumChildrenPipelinesHeight + this.nodeBoxConfig.nodeSelfHieght * 2 + this.nodeBoxConfig.longitudinalSpacing
          } else {
            return sumChildrenPipelinesHeight + this.nodeBoxConfig.nodeSelfHieght + this.nodeBoxConfig.longitudinalSpacing
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
    olderUncle: () => this.parentNodeBox?.parentPipeline.childrenNodeBoxs?.[this.parentNodeBox?.indexInPipeline + 1],
  }

  public drawBox = () => {
    return <g>
      <rect
        key={`rect_${getUniqId()}`}
        x={this.getX() - this.getWidth() / 2 + this.parentPipeline.rootPipeline.getWidth() / 2}
        y={this.getY() - this.getHeight() / 2 - this.nodeBoxConfig.longitudinalSpacing / 2}
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

  public drawLine = () => {
    const x = this.getX() + this.parentPipeline.rootPipeline.getWidth() / 2;
    const y = this.getY();
    const width = this.getWidth()
    const height = this.getHeight()
    const points = {
      top: { x, y: y - height / 2 },
      divTop: { x, y: y - height / 2 - this.nodeBoxConfig.longitudinalSpacing / 2 },
      divBottom: { x, y: y + height / 2 - this.nodeBoxConfig.longitudinalSpacing },
      bottom: { x, y: y + height / 2 - this.nodeBoxConfig.longitudinalSpacing / 2 },
    }
    const boxSelfBottom = { x, y: y - height / 2 + this.nodeBoxConfig.nodeSelfHieght - this.nodeBoxConfig.longitudinalSpacing }

    return <g>
      {/* 间距产生的线段 */}
      <DrawLine start={points.top} end={points.divTop} />
      <DrawLine start={points.divBottom} end={points.bottom} />
      {/* 分支组产生的线段 */}
      {
        this.childrenPipelines && this.childrenPipelines.length &&
        this.childrenPipelines.map(pipeline => {
          const pipelineX = pipeline.getX() + this.parentPipeline.rootPipeline.getWidth() / 2;
          const pipelineY = pipeline.getY()
          const endY = y + height / 2 - this.nodeBoxConfig.longitudinalSpacing - this.node.height;
          return <>
            <DrawLine start={boxSelfBottom} end={{ x: pipelineX, y: pipelineY - pipeline.getHeight() / 2 }} />
            <DrawLine start={{ x: pipelineX, y: pipelineY - pipeline.getHeight() / 2 + pipeline.getBrotherMaxHeight() }} end={{ x, y: this.hasEnd ? endY : endY + this.node.height }} />
          </>
        })
      }
      {this.node.drawLine()}
      {this.childrenPipelines.map(pipeline => pipeline.drawLine())}
    </g>
  }

  /**
   * 上级找到下级开始划线
   * @returns 
   */
  // public renderLine() {
  //   let lineList: { start: PointPosition; end: PointPosition; inflection?: 'start' | 'end' }[] = []
  //   const youngerBrother = this.relativeNodeBox.youngerBrother()
  //   if (youngerBrother) {
  //     if (this.isBranchOrGroup) {
  //       // 分支节点
  //       // 头连子
  //       this.childrenPipelines.forEach(pipeline => {
  //         const firstChildNodeBox = pipeline.childrenNodeBoxs[0]
  //         if (!firstChildNodeBox) return
  //         lineList.push({
  //           start: this.node.getPositionCoordinate()[0].bottom,
  //           end: firstChildNodeBox.node.getPositionCoordinate()[0].top,
  //         })
  //       })
  //       if (this.hasEnd) {
  //         // 分支节点 有头有尾 有弟弟
  //         // 子连尾
  //         this.childrenPipelines.forEach(pipeline => {
  //           const lastChildNodeBox = pipeline.childrenNodeBoxs[pipeline.childrenNodeBoxs.length - 1]
  //           if (!lastChildNodeBox) return
  //           lineList.push({
  //             start: lastChildNodeBox.node.getPositionCoordinate()[0].bottom,
  //             end: this.node.getPositionCoordinate()[1].top,
  //             inflection: 'end'
  //           })
  //         })
  //         // 尾连弟
  //         lineList.push({
  //           start: this.node.getPositionCoordinate()[1].bottom,
  //           end: youngerBrother.node.getPositionCoordinate()[0].top,
  //         })
  //       } else {
  //         // 分支节点 有头无尾 有弟弟
  //         // 子连弟
  //         this.childrenPipelines.forEach(pipeline => {
  //           const lastChildNodeBox = pipeline.childrenNodeBoxs[pipeline.childrenNodeBoxs.length - 1]
  //           if (!lastChildNodeBox) return
  //           lineList.push({
  //             start: lastChildNodeBox.node.getPositionCoordinate()[0].bottom,
  //             end: youngerBrother.node.getPositionCoordinate()[0].top,
  //             inflection: 'end'
  //           })
  //         })
  //       }
  //     } else {
  //       // 正常节点 有弟弟
  //       lineList.push({
  //         start: this.node.getPositionCoordinate()[0].bottom,
  //         end: youngerBrother.node.getPositionCoordinate()[0].top
  //       })
  //     }
  //   }
  //   return <g>
  //     {
  //       lineList.map(line => {
  //         const { start, end, inflection = 'start' } = line
  //         return <DrawerLine
  //           key={`line_${getUniqId()}`}
  //           start={{ x: start?.x! + this.rootPipeline?.getWidth()! / 2, y: start?.y! }}
  //           end={{ x: end?.x! + this.rootPipeline?.getWidth()! / 2, y: end?.y! }}
  //           inflection={inflection}
  //         />
  //       })
  //     }
  //     {
  //       this.isBranch
  //         ? <rect
  //           key={`rect_${getUniqId()}`}
  //           x={this.getX() - this.getWidth() / 2 + this.rootPipeline?.getWidth()! / 2 + this.node.nodeConfig.transverseSpacing / 2}
  //           y={this.getY() - this.getHeight() / 2 + this.node.nodeConfig.transverseSpacing / 2}
  //           width={this.getWidth() - this.node.nodeConfig.transverseSpacing}
  //           height={this.getHeight() - this.node.nodeConfig.transverseSpacing}
  //           strokeWidth="1"
  //           fill='#111'
  //           opacity={0.5}
  //         />
  //         : null
  //     }
  //     {this.childrenPipelines.map(item => item.childrenNodeBoxs.map(box => box.renderLine()))}
  //   </g>
  // }



  public render() {
    return <div key={this.nodeData.id}>
      {this.node.render()}
      {this.childrenPipelines?.map(item => item.render())}
    </div>
  }
}
