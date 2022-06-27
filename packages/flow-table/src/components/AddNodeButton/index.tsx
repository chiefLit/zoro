import React from 'react'
import { Button, Popover } from 'antd';
import { FlowTableData, NodeTypeItem } from '@/types'
import { PlusOutlined } from '@ant-design/icons';
import { FlowContext } from '@/context'
import './style.less'

interface NodeBoxProps {
  data: FlowTableData
}

export default (props: NodeBoxProps) => {
  const { data } = props;
  const { addNode, nodeTypes } = React.useContext(FlowContext)


  const handleClick = (typeData: NodeTypeItem) => {
    addNode(typeData.type, data)
  }

  const content = nodeTypes?.map((nodeType, index) => {
    return (
      <Button key={nodeType.type + index} onClick={() => {
        handleClick(nodeType)
      }}>{nodeType.title}</Button>
    )
  })

  return (
    <div className='add-node-button'>
      <Popover placement="right" content={content} trigger="click">
        <Button icon={<PlusOutlined />} type='primary' shape='circle' />
      </Popover>
    </div>
  )
}