import React from 'react'
import { IDictionary, INodeBoxConfig, INodeConfig, ISizeConfig } from '../../types';
import { NodeBox } from '../NodeBox';
import { DrawLine } from '../Line';
import { getUniqId } from '../../utils';
import { Point } from '../Point';

interface NodeProps {
  nodeBox: NodeBox;
  nodeData: IDictionary;
  sizeConfig: ISizeConfig
}
/**
 * 节点
 */
export class Node extends React.Component<NodeProps> {
  constructor(props: NodeProps) {
    super(props);
    const { sizeConfig } = props
    this.nodeConfig = sizeConfig.nodeConfig
    this.nodeBoxConfig = sizeConfig.nodeBoxConfig
    this.width = sizeConfig.nodeConfig.width
    this.virtualWidth = this.width + sizeConfig.nodeConfig.transverseSpacing
    this.height = sizeConfig.nodeConfig.height
    this.virtualHeight = this.height + sizeConfig.nodeConfig.longitudinalSpacing
  }
  // 业务数据
  public nodeData: IDictionary = this.props.nodeData;

  // 节点盒子
  private nodeBox: NodeBox = this.props.nodeBox;

  // 节点宽度
  public width: number;

  // 节点高度
  public height: number;

  // 虚拟宽度
  public virtualWidth: number;

  // 虚拟高度
  public virtualHeight: number;

  // 节点配置
  public nodeConfig: INodeConfig;
  // 
  public nodeBoxConfig: INodeBoxConfig;

  public getCenterX = () => {
    return this.nodeBox.getCenterX()
  }

  public getCenterY = () => {
    return this.nodeBox.getCenterY()
  }

  public getPoint = (isSvg?: boolean) => {
    const rootPipeline = this.nodeBox.parentPipeline.rootPipeline;
    const rootPipelineWidth = rootPipeline?.getWidth()
    const centerX = isSvg ? this.getCenterX() + rootPipelineWidth / 2 : this.getCenterX()
    const centerY = this.getCenterY()
    const nodeBoxHeight = this.nodeBox.getHeight()
    return {
      startNode: {
        virtualTopLeft: {
          x: centerX - this.virtualWidth / 2,
          y: centerY - nodeBoxHeight / 2 + this.nodeBox.nodeBoxConfig.longitudinalSpacing / 2
        },
        virtualTopCenter: {
          x: centerX,
          y: centerY - nodeBoxHeight / 2 + this.nodeBox.nodeBoxConfig.longitudinalSpacing / 2
        },
        topCenter: {
          x: centerX,
          y: centerY - nodeBoxHeight / 2 + this.nodeBox.nodeBoxConfig.longitudinalSpacing / 2 + this.nodeConfig.longitudinalSpacing / 2
        },
        bottomCenter: {
          x: centerX,
          y: centerY - nodeBoxHeight / 2 - this.nodeBox.nodeBoxConfig.longitudinalSpacing / 2 + this.nodeBoxConfig.nodeSelfHieght - this.nodeConfig.longitudinalSpacing / 2
        },
        virtualBottomCenter: {
          x: centerX,
          y: centerY - nodeBoxHeight / 2 - this.nodeBox.nodeBoxConfig.longitudinalSpacing / 2 + this.nodeBoxConfig.nodeSelfHieght
        },
      },
      endNode: this.nodeBox.isBranchOrGroup && this.nodeBox.hasEnd
        ? {
          virtualTopLeft: {
            x: centerX - this.virtualWidth / 2,
            y: centerY + nodeBoxHeight / 2 - this.nodeBox.nodeBoxConfig.nodeSelfHieght + this.nodeBox.nodeBoxConfig.longitudinalSpacing / 2
          },
          virtualTopCenter: {
            x: centerX,
            y: centerY + nodeBoxHeight / 2 - this.nodeBoxConfig.nodeSelfHieght + this.nodeBox.nodeBoxConfig.longitudinalSpacing / 2
          },
          topCenter: {
            x: centerX,
            y: centerY + nodeBoxHeight / 2 - this.nodeBoxConfig.nodeSelfHieght + this.nodeBox.nodeBoxConfig.longitudinalSpacing / 2 + this.nodeConfig.longitudinalSpacing / 2
          },
          bottomCenter: {
            x: centerX,
            y: centerY + nodeBoxHeight / 2 - this.nodeBox.nodeBoxConfig.longitudinalSpacing / 2 - this.nodeConfig.longitudinalSpacing / 2
          },
          virtualBottomCenter: {
            x: centerX,
            y: centerY + nodeBoxHeight / 2 - this.nodeBox.nodeBoxConfig.longitudinalSpacing / 2
          },
        }
        : null
    }
  }

  public getPositionCoordinate = () => {
    const x = this.getCenterX()
    const y = this.getCenterY()
    const nodeBoxHeight = this.nodeBox.getHeight()
    const startPosition = {
      top: { x: x + this.width / 2, y },
      bottom: { x: x + this.width / 2, y: y + this.height }
    }

    return this.nodeBox.isBranch
      ? [
        startPosition,
        {
          top: { x: x + this.width / 2, y: y + nodeBoxHeight - this.virtualHeight },
          bottom: { x: x + this.width / 2, y: y + nodeBoxHeight - this.virtualHeight + this.height }
        }
      ]
      : this.nodeBox.isGroup ? [
        {
          top: startPosition.top,
          bottom: { x: x + this.width / 2, y: y + nodeBoxHeight - this.virtualHeight + this.height }
        }
      ]
        : [startPosition]
  }

  public drawBox = () => {
    const { startNode, endNode } = this.getPoint(true)
    return <g>
      <rect
        key={`rect_node_start_${getUniqId()}`}
        x={startNode.virtualTopLeft.x}
        y={startNode.virtualTopLeft.y}
        width={this.virtualWidth}
        height={this.virtualHeight}
        strokeWidth="1"
        fill='#000'
        opacity={0.1}
      />
      {
        endNode
          ? <rect
            key={`rect_node_end_${getUniqId()}`}
            x={endNode.virtualTopLeft.x}
            y={endNode.virtualTopLeft.y}
            width={this.virtualWidth}
            height={this.virtualHeight}
            strokeWidth="1"
            fill='#000'
            opacity={0.1}
          />
          : null
      }
    </g>
  }

  public drawLine = () => {
    const { startNode, endNode } = this.getPoint(true)
    return <g>
      <DrawLine start={startNode.virtualTopCenter} end={startNode.topCenter} endArrow />
      <DrawLine start={startNode.bottomCenter} end={startNode.virtualBottomCenter} />
      {endNode && <DrawLine start={endNode.virtualTopCenter} end={endNode.topCenter} endArrow />}
      {endNode && <DrawLine start={endNode.bottomCenter} end={endNode.virtualBottomCenter} />}
    </g>
  }

  public render() {
    const uniqId = getUniqId()
    const { startNode } = this.getPoint()
    return <>
      <div
        style={{
          width: this.virtualWidth + 'px',
          height: this.virtualHeight + 'px',
          position: 'absolute',
          left: startNode.virtualTopLeft.x + 'px',
          top: startNode.virtualTopLeft.y + 'px',
          border: '1px solid #f00',
        }}
      >
        <div style={{
          width: this.width + 'px',
          height: this.height + 'px',
          margin: `${this.nodeConfig.longitudinalSpacing / 2}px ${this.nodeConfig.transverseSpacing / 2}px`,
          border: '1px solid #f00'
        }}>
          {this.nodeData.displayName}<br />
          {this.nodeData.type}<br />
          {this.nodeBox.path}<br />
          {this.nodeBox.parentPipeline.path}<br />
        </div>
      </div>
      {
        this.nodeBox.typeConfig?.branch?.hasEnd || this.nodeBox.typeConfig?.group?.hasEnd
          ? <div
            style={{
              width: this.virtualWidth + 'px',
              height: this.virtualHeight + 'px',
              position: 'absolute',
              left: startNode.virtualTopLeft.x + 'px',
              top: startNode.virtualTopLeft.y + this.nodeBox.getHeight() - this.nodeBox.nodeBoxConfig.nodeSelfHieght + 'px',
              border: '1px solid #f00',
            }}
          >
            <div style={{
              width: this.width + 'px',
              height: this.height + 'px',
              margin: `${this.nodeConfig.longitudinalSpacing / 2}px ${this.nodeConfig.transverseSpacing / 2}px`,
              border: '1px solid #f00'
            }}>
              {this.nodeData.type} end
            </div>
          </div>
          : null
      }
    </>
  }
}