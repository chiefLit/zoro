import React from 'react'
import { FlowTableData } from '@/types'
import EditableText from '@/components/EditableText'
import './style.less'
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
  const { data } = props;
  const [nodeData, setNodeData] = React.useState<FlowTableData>(data)
  const { removeBranch, setEditingNode } = React.useContext(FlowContext)

  const hanldeChangeTitle = (title: string) => {
    setNodeData({ ...data, properties: { ...data?.properties, title } })
  }

  const handleClickClose = () => {
    removeBranch(data)
  }

  return (
    <section className='node-card-wrapper condition-card-wrapper'>
      <header className='node-card-title'>
        <EditableText value={nodeData?.properties?.title} onChange={hanldeChangeTitle} disabled={true} />
        <Button size='small' className='node-card-close-button' onClick={handleClickClose} icon={<CloseOutlined />} />
      </header>
      <article className='node-card-content' onClick={() => setEditingNode(data)}>{data.nodeId}<br />{data?.content}</article>
    </section>
  )
}