import React from 'react'
import { IDictionary } from '../../types';
import { NodeBox } from '../NodeBox';
import { TRANSVERSE_SPACING, LONGITUDINAL_SPACING } from '../../constant';

/**
 * 节点
 */
export class Node {
  constructor(parameters: { nodeBox: NodeBox, businessData: IDictionary }) {
    this.nodeBox = parameters.nodeBox
    this.businessData = parameters.businessData
  }
  /**
   * 业务数据
   */
  public businessData: IDictionary;
  private nodeBox: NodeBox;
  private x: number = 0;
  private y: number = 0;
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

  public getPositionCoordinate = (position: 'top' | 'bottom' = 'top') => {
    let result: { x: number; y: number }
    switch (position) {
      case 'top':
        result = { x: this.getX() + this.virtualWidth / 2, y: this.getY() }
        break;
      case 'bottom':
        result = { x: this.getX() + this.virtualWidth / 2, y: this.getY() + this.height }
        break;
    }
    return result
  }

  public render() {
    return <>
      <div
        data-position={JSON.stringify(this.getPositionCoordinate())}
        data-root={JSON.stringify(this.nodeBox.rootNodeBox.getHeight())}
        style={{
          width: this.width + 'px',
          height: this.height + 'px',
          position: 'absolute',
          left: this.getX() + TRANSVERSE_SPACING / 2 + 'px',
          top: this.getY() + 'px',
          border: '1px solid #f00'
        }}
      >{this.businessData.type}</div>
    </>
  }
}