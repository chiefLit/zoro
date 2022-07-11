import React from 'react'
import { FlowTableData } from '@/types'
import EditableText from '@/components/EditableText'
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { FlowContext } from '@/context';
import './style.less'

interface NodeCardProps {
  data: FlowTableData;
  onChange?: (value: FlowTableData) => void;
  readonly?: boolean;
}

/**
 * 节点卡片
 */
export default (props: NodeCardProps) => {
  const { data, readonly } = props;
  const { onDeleteNode, setEditingNode,updateNodeProperties } = React.useContext(FlowContext)

  const hanldeChangeTitle = (title: string) => {
    updateNodeProperties({ targetNode: data, newProperties: { ...data?.properties, title } })
  }

  const handleClose = () => {
    onDeleteNode?.({ targetNode: data })
  }

  return (
    <section className='node-card-wrapper'>
      <header className='node-card-title'>
        <EditableText value={data?.properties?.title} onChange={hanldeChangeTitle} disabled={readonly} />
        <Button size='small' className='node-card-close-button' onClick={handleClose} type='primary' icon={<CloseOutlined />} />
      </header>
      <article className='node-card-content' onClick={() => setEditingNode(data)}>{data.nodeId}<br />{data?.content}</article>
    </section>
  )
}