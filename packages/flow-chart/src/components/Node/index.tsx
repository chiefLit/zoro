import React from 'react'
import { IDictionary, INodeConfig } from '../../types';
import { NodeBox } from '../NodeBox';
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
    const { nodeConfig } = useGlobalModel()
    this.nodeConfig = nodeConfig
    this.width = nodeConfig.width
    this.virtualWidth = this.width + nodeConfig.transverseSpacing
    this.height = nodeConfig.height
    this.virtualHeight = this.height + nodeConfig.longitudinalSpacing
  }
  /**
   * 业务数据
   */
  public nodeData: IDictionary = this.props.nodeData;
  private nodeBox: NodeBox = this.props.nodeBox;
  public width: number;
  public height: number;
  public virtualWidth: number;
  public virtualHeight: number;
  public nodeConfig: INodeConfig;

  public getX = () => {
    return this.nodeBox.getX() - this.width / 2
  }

  public getY = () => {
    return this.nodeBox.getY() - this.nodeBox.getHeight() / 2 + this.nodeConfig.longitudinalSpacing / 2
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
          bottom: { x: x + this.width / 2, y: y  + nodeBoxHeight - this.virtualHeight + this.height }
        }
      ]
        : [startPosition]
  }

  public render() {
    const uniqId = getUniqId()
    return <>
      <div
        data-position={JSON.stringify(this.getPositionCoordinate())}
        data-root={JSON.stringify(this.nodeBox.parentPipeline?.getHeight())}
        style={{
          width: this.width + 'px',
          height: this.height + 'px',
          position: 'absolute',
          left: this.getX() + 'px',
          top: this.getY() + 'px',
          border: '1px solid #f00',
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
              left: this.getX() + 'px',
              top: this.getY() + this.nodeBox.getHeight() - this.virtualHeight + 'px',
              border: '1px solid #f00',
            }}
          >{this.nodeData.type} end {uniqId} </div>
          : null
      }
    </>
  }
}