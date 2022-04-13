import React from 'react'
import { Node } from '../Node'
import { Point } from '../Point';
import { IDictionary } from "../../types";
import { DrawerLine } from '../Line';

/**
 * 节点盒子
 */
export class NodeBox {
  constructor({ businessData, typeConfigs }: { businessData: IDictionary, typeConfigs: any }) {
    this.node = new Node({ nodeBox: this, businessData })
    this.businessData = businessData;
    this.typeConfig = typeConfigs[businessData.type]
  }

  /**
   * 业务数据
   */
  private businessData: IDictionary;

  /**
   * 业务数据
   */
  private typeConfig: IDictionary;

  /**
   * 是否为根节点
   */
  private isRoot: boolean = true;

  /**
   * 在父级的索引
   */
  private myIndex: number = 0;

  /**
   * 根节点框实例
   */
  public rootNodeBox: NodeBox = this;

  /**
   * 父节点框实例
   */
  private parentNodeBox: NodeBox = this;

  /**
   * x坐标
   */
  private x: number = 0;

  /**
   * y坐标
   */
  private y: number = 0;

  /**
   * 盒子宽
   */
  private width: number = 0;

  /**
   * 盒子高
   */
  private height: number = 0;

  /**
   * 子节点
   */
  private children: NodeBox[] = [];

  /**
   * 节点实例
   */
  public node: Node;

  public bindRoot = (rootNodeBox: NodeBox) => {
    this.rootNodeBox = rootNodeBox;
  }

  public bindParent = (parentNodeBox: NodeBox) => {
    this.parentNodeBox = parentNodeBox;
    this.myIndex = this.parentNodeBox.children.findIndex(item => item === this)
    this.isRoot = false
  }

  public setChildren = (children: NodeBox[]) => {
    this.children = children
    this.children.forEach(item => {
      item.bindRoot(this.rootNodeBox)
      item.bindParent(this)
    })
  }

  public getWidth = (): number => {
    if (!this.children || this.children.length === 0) {
      return this.node.virtualWidth
    } else {
      if (this.typeConfig?.branch) {
        return this.children.reduce((sum, next) => sum + next.getWidth(), 0)
      } else {
        return this.children.reduce((max, next) => Math.max(max, next.getWidth()), 0)
      }
    }
  };

  public getHeight = (): number => {
    if (!this.children || this.children.length === 0) {
      return this.node.virtualHeight
    } else {
      if (this.typeConfig?.branch) {
        return this.children.reduce((max, next) => Math.max(max, next.getHeight()), 0) + this.node.virtualHeight
      } else {
        return this.children.reduce((sum, next) => sum + next.getHeight(), 0) + this.node.virtualHeight
      }
    }
  };

  public getX = (): number => {
    if (this.isRoot) return -this.node.virtualWidth / 2
    if (this.parentNodeBox.typeConfig?.branch) {
      if (this.myIndex === 0) {
        return this.parentNodeBox.getX() - this.parentNodeBox.getWidth() / 2 + this.getWidth() / 2
      } else {
        const brother = this.parentNodeBox.children[this.myIndex - 1]
        return brother.getX() + brother.getWidth() / 2 + this.getWidth() / 2
      }
    } else {
      return this.parentNodeBox.getX()
    }
  }

  public getY = (): number => {
    if (this.isRoot) return this.getHeight() / 2
    if (this.parentNodeBox.typeConfig?.branch || this.myIndex === 0) {
      return this.parentNodeBox.getY() - this.parentNodeBox.getHeight() / 2 + this.parentNodeBox.node.virtualHeight + this.getHeight() / 2
    } else {
      const brother = this.parentNodeBox.children[this.myIndex - 1]
      return brother.getY() + brother.getHeight() / 2 + this.getHeight() / 2
    }
  }

  public render() {
    return <div key={this.businessData.id}>
      {!this.isRoot ? this.node.render() : null}
      {this.children.map(item => item.render())}
    </div>
  }
}
