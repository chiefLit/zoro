import React from 'react'
import { IDictionary } from '../../types';
import { NodeBox } from '../NodeBox';
import { TRANSVERSE_SPACING, LONGITUDINAL_SPACING } from '../../constant';
import { getUniqId } from '../../utils';

/**
 * 节点
 */
export class Node {
  constructor(parameters: { nodeBox: NodeBox, nodeData: IDictionary }) {
    this.nodeBox = parameters.nodeBox
    this.nodeData = parameters.nodeData
  }
  /**
   * 业务数据
   */
  public nodeData: IDictionary;
  private nodeBox: NodeBox;
  public width: number = 200;
  public height: number = 100;
  public virtualWidth: number = this.width + TRANSVERSE_SPACING;
  public virtualHeight: number = this.height + LONGITUDINAL_SPACING;

  public getX = () => {
    return this.nodeBox.getX() - this.width / 2
  }

  public getY = () => {
    return this.nodeBox.getY() - this.nodeBox.getHeight() / 2 + LONGITUDINAL_SPACING / 2
  }

  public getPositionCoordinate = () => {
    const x = this.getX()
    const y = this.getY()
    const nodeBoxHeight = this.nodeBox.getHeight()
    const startPosition = {
      top: { x, y },
      bottom: { x, y: y + this.height }
    }

    return this.nodeBox.typeConfig?.branch || this.nodeBox.typeConfig?.group
      ? [
        startPosition,
        {
          top: { x, y: y + nodeBoxHeight - this.virtualHeight },
          bottom: { x, y: y + nodeBoxHeight - this.virtualHeight + this.height }
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
        this.nodeBox.typeConfig?.branch || this.nodeBox.typeConfig?.group
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