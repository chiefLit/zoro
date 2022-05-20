import React from 'react'
import { Button, Drawer, DrawerProps, Form, FormInstance, Input, Select, Space } from 'antd'
import { nodeType } from '../../types/enums'
import { getUniqId } from '../../utils'
import { NodeDataProps } from '../../types'
import { GlobalContext } from '../../context'

interface AddNodeDrawerProps extends DrawerProps {
  businessProps?: {}
}

const AddNodeDrawer: React.FC<AddNodeDrawerProps> = (props) => {
  const { businessProps, ...drawerProps } = props;
  const formRef = React.useRef<FormInstance<NodeDataProps>>(null)
  const { addNode, setAddNodeVisible } = React.useContext(GlobalContext)
  const handleOk = () => {
    const id = getUniqId()
    formRef.current?.validateFields().then(data => {
      addNode({ data: { ...data, id } })
    })
  }

  const options = Object.keys(nodeType).map(key => ({ label: key, value: nodeType[key as keyof typeof nodeType] }))

  return (
    <Drawer
      title='添加节点'
      {...drawerProps}
      onClose={() => setAddNodeVisible(false)}
      destroyOnClose
      footer={
        <Space>
          <Button onClick={() => setAddNodeVisible(false)}>取消</Button>
          <Button onClick={handleOk} type="primary">确定</Button>
        </Space>
      }
    >
      <Form<NodeDataProps> ref={formRef} layout="vertical" hideRequiredMark>
        <Form.Item
          name="name"
          label="Node Name"
          rules={[{ required: true, message: '请输入节点名称' }]}
        >
          <Input placeholder="请输入节点名称" />
        </Form.Item>
        <Form.Item
          name="type"
          label="Node Type"
          rules={[{ required: true, message: '请选择节点类型' }]}
        >
          <Select options={options} placeholder="请选择节点类型" />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export { AddNodeDrawer }