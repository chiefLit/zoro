import React from 'react'
import { Card } from 'antd'
import styles from './index.module.less'
import { NodeProps } from '../../types'

/**
 * 逻辑流节点 - 区分[功能节点]和[逻辑节点]
 * 渲染区分 normal节点 group节点 branch节点
 * 逻辑区分 条件判断 并行 循环
 * 除必要判断之外，节点配置都是业务自定义，与组件无关。
 * @param props 
 * @returns 
 */
const NodeContainer: React.FC<NodeProps> = (props) => {
  const { id, type, displayName, description } = props
  return (
    <div className={styles.containerWapper} key={id}>
      <Card title={displayName} style={{ width: 300 }}>
        <p>{type}</p>
        <p>Card content</p>
        <p>{description}</p>
      </Card>
    </div>
  );
}

export { NodeContainer };