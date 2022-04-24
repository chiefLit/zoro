import React from 'react'
import { PointPosition } from '../../types';
import { DrawerLine } from '../Line';
import { NodeBox, NodeBoxProps } from '../NodeBox';

interface GroupNodeBoxProps extends NodeBoxProps { }

export class GroupNodeBox extends NodeBox {
  constructor(props: GroupNodeBoxProps) {
    super(props)
  }
  /**
   * 上级找到下级开始划线
   * @returns 
   */
  public renderLine() {
    this.rootPipeline = this.parentPipeline.parentNodeBox?.rootPipeline ? this.parentPipeline.parentNodeBox.rootPipeline! : this.parentPipeline!;
    let lineList: { start: PointPosition; end: PointPosition; inflection?: 'start' | 'end' }[] = []
    const youngerBrother = this.relativeNodeBox.youngerBrother()
    if (youngerBrother) {
      // 分支节点
      // 头连子
      this.childrenPipelines.forEach(pipeline => {
        const firstChildNodeBox = pipeline.childrenNodeBoxs[0]
        if (!firstChildNodeBox) return
        lineList.push({
          start: this.node.getPositionCoordinate()[0].bottom,
          end: firstChildNodeBox.node.getPositionCoordinate()[0].top,
        })
      })
      if (this.hasEnd) {
        // 分支节点 有头有尾 有弟弟
        // 子连尾
        this.childrenPipelines.forEach(pipeline => {
          const lastChildNodeBox = pipeline.childrenNodeBoxs[pipeline.childrenNodeBoxs.length - 1]
          if (!lastChildNodeBox) return
          lineList.push({
            start: lastChildNodeBox.node.getPositionCoordinate()[0].bottom,
            end: this.node.getPositionCoordinate()[1].top,
            inflection: 'end'
          })
        })
        // 尾连弟
        lineList.push({
          start: this.node.getPositionCoordinate()[1].bottom,
          end: youngerBrother.node.getPositionCoordinate()[0].top,
        })
      } else {
        // 分支节点 有头无尾 有弟弟
        // 子连弟
        this.childrenPipelines.forEach(pipeline => {
          const lastChildNodeBox = pipeline.childrenNodeBoxs[pipeline.childrenNodeBoxs.length - 1]
          if (!lastChildNodeBox) return
          lineList.push({
            start: lastChildNodeBox.node.getPositionCoordinate()[0].bottom,
            end: youngerBrother.node.getPositionCoordinate()[0].top,
            inflection: 'end'
          })
        })
      }
    }
    return <g>
      {
        lineList.map(line => {
          const { start, end, inflection = 'start' } = line
          return <DrawerLine
            start={{ x: start?.x! + this.rootPipeline?.getWidth()! / 2, y: start?.y! }}
            end={{ x: end?.x! + this.rootPipeline?.getWidth()! / 2, y: end?.y! }}
            inflection={inflection}
          />
        })
      }
      <rect
        x={this.getX() - this.getWidth() / 2 + this.rootPipeline?.getWidth()! / 2 + this.node.nodeConfig.transverseSpacing / 2}
        y={this.getY() - this.getHeight() / 2 + this.node.nodeConfig.transverseSpacing / 2}
        width={this.getWidth() - this.node.nodeConfig.transverseSpacing}
        height={this.getHeight() - this.node.nodeConfig.transverseSpacing}
        strokeWidth="1"
        fill='#eee'
        opacity={0.5}
      />
      {this.childrenPipelines.map(item => item.childrenNodeBoxs.map(box => box.renderLine()))}
    </g>
  }
}