import React from 'react'
import { Node } from '../Node'
import { IDictionary, ISpacing, PointPosition } from "../../types";
import { DrawerLine } from '../Line';
import { PipelineBox } from '../PipelineBox';
import useGlobalModel, { ModelTypes } from '../../context'
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
  }

  public parentPipeline: PipelineBox;
  public parentNodeBox?: NodeBox;
  public childrenPipelines: PipelineBox[] = [];
  public isBranch: boolean;
  public isGroup: boolean;
  public isBranchOrGroup: boolean;
  public hasEnd: boolean;
  public nodeBoxConfig: ISpacing;

  public rootPipeline?: PipelineBox;

  /**
   * 业务数据
   */
  public nodeData: IDictionary;

  /**
   * 业务数据
   */
  public typeConfig: IDictionary;

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
        return this.childrenPipelines.reduce((sum, next) => sum + next.getWidth(), 0) || this.node.virtualWidth
      } else {
        return this.childrenPipelines.reduce((max, next) => Math.max(max, next.getWidth()), 0) || this.node.virtualWidth
      }
    }
  };

  public getHeight = (): number => {
    if (!this.childrenPipelines || this.childrenPipelines.length === 0) {
      return this.node.virtualHeight
    } else {
      if (this.isBranch) {
        if (this.hasEnd) {
          return this.childrenPipelines.reduce((max, next) => Math.max(max, next.getHeight()), 0) + this.node.virtualHeight * 2
        } else {
          return this.childrenPipelines.reduce((max, next) => Math.max(max, next.getHeight()), 0) + this.node.virtualHeight
        }
      } else if (this.isGroup) {
        if (this.hasEnd) {
          return this.childrenPipelines.reduce((sum, next) => sum + next.getHeight(), 0) + this.node.virtualHeight * 2
        } else {
          return this.childrenPipelines.reduce((sum, next) => sum + next.getHeight(), 0) + this.node.virtualHeight
        }
      } else {
        return this.childrenPipelines.reduce((sum, next) => sum + next.getHeight(), 0) + this.node.virtualHeight
      }
    }
  };

  public getVirtualWidth = () => this.getWidth() + this.nodeBoxConfig.transverseSpacing
  public getVirtualHeight = () => this.getHeight() + this.nodeBoxConfig.longitudinalSpacing

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

  public relativeNodeBox = {
    youngerBrother: () => this.parentPipeline.childrenNodeBoxs[this.indexInPipeline + 1],
    olderBrother: () => this.parentPipeline.childrenNodeBoxs[this.indexInPipeline + 1],
    youngerUncle: () => this.parentNodeBox?.parentPipeline.childrenNodeBoxs[this.parentNodeBox?.indexInPipeline + 1],
    olderUncle: () => this.parentNodeBox?.parentPipeline.childrenNodeBoxs[this.parentNodeBox?.indexInPipeline + 1],
  }

  public drawerBox = () => {
    return <g>
      <rect
        key={`rect_${getUniqId()}`}
        x={this.getX() - this.getWidth() / 2 + this.parentPipeline.rootPipeline.getWidth() / 2}
        y={this.getY() - this.getHeight() / 2}
        width={this.getWidth()}
        height={this.getHeight()}
        strokeWidth="1"
        fill='#00f'
        opacity={0.1}
      />
      {this.node.drawerBox()}
      {this.childrenPipelines.map(item => item.drawerBox())}
    </g>
  }

  public drawerLine = () => {

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
