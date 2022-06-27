import React from 'react'
import { FlowTableData } from '@/types'
import EditableText from '@/commonComponents/EditableText'
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { FlowContext } from '@/context';

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
  const [nodeData, setNodeData] = React.useState<FlowTableData>(data)
  const { deleteNode } = React.useContext(FlowContext)

  const hanldeChangeTitle = (title: string) => {
    setNodeData({ ...data, properties: { ...data?.properties, title } })
  }

  const handleClose = () => {
    deleteNode(data)
  }

  return (
    <section className='node-card-wrapper'>
      <header className='node-card-title'>
        <EditableText value={data?.properties?.title} onChange={hanldeChangeTitle} disabled={readonly} />
        <Button size='small' className='node-card-close-button' onClick={handleClose} type='primary' icon={<CloseOutlined />} />
      </header>
      <article className='node-card-content'>{data?.content}</article>
    </section>
  )
}