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
    return this.nodeBox.getX()
  }

  public getY = () => {
    return this.nodeBox.getY() - this.nodeBox.getHeight() / 2
  }

  public getPositionCoordinate = () => {
    const x = this.getX() + this.virtualWidth / 2;
    return [
      {
        top: { x, y: this.getY() },
        bottom: { x, y: this.getY() + this.height }
      },
      this.nodeBox.typeConfig?.branch || this.nodeBox.typeConfig?.group
        ? {
          top: { x, y: this.getY() + this.nodeBox.getHeight() - this.virtualHeight },
          bottom: { x, y: this.getY() + this.nodeBox.getHeight() - this.virtualHeight + this.height }
        }
        : undefined
    ]
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
          left: this.getX() + TRANSVERSE_SPACING / 2 + 'px',
          top: this.getY() + 'px',
          border: '1px solid #f00'
        }}
      >{this.nodeData.type}</div>
      {
        this.nodeBox.typeConfig?.branch || this.nodeBox.typeConfig?.group
          ? <div
            data-position={JSON.stringify(this.getPositionCoordinate())}
            // data-root={JSON.stringify(this.nodeBox.rootNodeBox.getHeight())}
            style={{
              width: this.width + 'px',
              height: this.height + 'px',
              position: 'absolute',
              left: this.getX() + TRANSVERSE_SPACING / 2 + 'px',
              top: this.getY() + this.nodeBox.getHeight() - this.virtualHeight + 'px',
              border: '1px solid #f00'
            }}
          >{this.nodeData.type} end {uniqId} </div>
          : null
      }
    </>
  }
}