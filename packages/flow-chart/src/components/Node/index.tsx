import React from 'react'
import { IDictionary, INodeBoxConfig, INodeConfig } from '../../types';
import { NodeBox } from '../NodeBox';
import { DrawLine } from '../Line';
import { getUniqId } from '../../utils';
import useGlobalModel from '../../context'

interface NodeProps {
  nodeBox: NodeBox;
  nodeData: IDictionary;
}
/**
 * 节点
 */
export class Node extends React.Component<NodeProps> {
  constructor(props: NodeProps) {
    super(props);
    const { nodeConfig, nodeBoxConfig } = useGlobalModel()
    this.nodeConfig = nodeConfig
    this.nodeBoxConfig = nodeBoxConfig
    this.width = nodeConfig.width
    this.virtualWidth = this.width + nodeConfig.transverseSpacing
    this.height = nodeConfig.height
    this.virtualHeight = this.height + nodeConfig.longitudinalSpacing
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

  public getX = () => {
    return this.nodeBox.getX() - this.virtualWidth / 2
  }

  public getY = () => {
    return this.nodeBox.getY() - this.nodeBox.getHeight() / 2
  }

  public getPositionCoordinate = () => {
    const x = this.getX()
    const y = this.getY()
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
    const rootPipeline = this.nodeBox.parentPipeline.rootPipeline;
    return <rect
      key={`rect_${getUniqId()}`}
      x={this.getX() + rootPipeline?.getWidth() / 2}
      y={this.getY()}
      width={this.virtualWidth}
      height={this.virtualHeight}
      strokeWidth="1"
      fill='#0f0'
      opacity={0.1}
    />
  }

  public drawLine = () => {
    const x = this.getX() + this.nodeBox.parentPipeline.rootPipeline.getWidth() / 2 + this.virtualWidth / 2;
    const y = this.getY();
    const points = {
      top: { x, y: y },
      divTop: { x, y: y + this.nodeConfig.longitudinalSpacing / 2 },
      divBottom: { x, y: y + this.virtualHeight - this.nodeConfig.longitudinalSpacing / 2 },
      bottom: { x, y: y + this.virtualHeight },
    }
    return <g>
      <DrawLine start={points.top} end={points.divTop} endArrow />
      <DrawLine start={points.divBottom} end={points.bottom} />
    </g>
  }

  public render() {
    const uniqId = getUniqId()
    const x = this.getX()
    const y = this.getY()
    return <>
      <div
        data-position={JSON.stringify(this.getPositionCoordinate())}
        data-root={JSON.stringify(this.nodeBox.parentPipeline?.getHeight())}
        style={{
          width: this.width + 'px',
          height: this.height + 'px',
          position: 'absolute',
          left: x + 'px',
          top: y + 'px',
          border: '1px solid #f00',
          transform: `translate(${this.nodeConfig.transverseSpacing / 2}px, ${this.nodeConfig.longitudinalSpacing / 2}px)`
        }}
      >{this.nodeData.type}</div>
      {
        this.nodeBox.typeConfig?.branch?.hasEnd || this.nodeBox.typeConfig?.group?.hasEnd
          ? <div
            data-position={JSON.stringify(this.getPositionCoordinate())}
            style={{
              width: this.width + 'px',
              height: this.height + 'px',
              position: 'absolute',
              left: x + 'px',
              top: y + this.nodeBox.getHeight() - this.nodeBoxConfig.longitudinalSpacing - this.nodeConfig.height - this.nodeConfig.longitudinalSpacing / 2 +  'px',
              border: '1px solid #f00',
              transform: `translate(${this.nodeConfig.transverseSpacing / 2}px, ${this.nodeConfig.longitudinalSpacing / 2}px)`
            }}
          >{this.nodeData.type} end</div>
          : null
      }
    </>
  }
}