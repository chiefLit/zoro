import React from 'react'
import { Button, Drawer, DrawerProps, Form, Space } from 'antd'
import { FlowContext } from '@/context'
import EditableText from '../EditableText'

interface PropertiesDrawerProps extends DrawerProps {

}

const PropertiesDrawer: React.FC<PropertiesDrawerProps> = (props) => {
  const { editingNode, setEditingNode, updateNodeProperties } = React.useContext(FlowContext)
  if (!editingNode) return null
  const [properties, setProperties] = React.useState({ ...editingNode?.properties })

  const handleClose = () => {
    setEditingNode(undefined)
  }

  const hanldeChangeTitle = (value: string) => {
    setProperties({ ...properties, title: value })
  }

  const handleSubmit = () => {
    updateNodeProperties({ targetNode: editingNode, newProperties: properties })
    setEditingNode(undefined)
  }

  return (
    <Drawer
      visible={!!editingNode}
      onClose={handleClose}
      title={<EditableText value={properties?.title!} onChange={hanldeChangeTitle} />}
      width='800'
      footer={
        <Space>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSubmit} type="primary">提交</Button>
        </Space>
      }
    >
      <Form>

      </Form>
    </Drawer>
  )
}

export { PropertiesDrawer }