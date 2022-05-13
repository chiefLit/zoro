import React from 'react'
import { Drawer, Form, Input } from 'antd'
import useGlobalModel from '../../context'

const Config: React.FC = () => {
  const { nodeConfig, setNodeConfig } = useGlobalModel()
  // console.log('%cindex.tsx line:8 GlobalContext', 'color: #007acc;', GlobalContext);

  const handleClose = () => { }
  return (
    <Drawer title="配置信息" placement="right" onClose={handleClose} visible={true} mask={false} size='default'>
      <Form layout='vertical' hideRequiredMark size='small'>
        <Form.Item
          name="with"
          label="节点宽度"
          initialValue={nodeConfig.width}
          rules={[{ required: true, message: 'Please enter node width' }]}
        >
          <Input placeholder="Please enter node width" />
        </Form.Item>
        <Form.Item
          name="height"
          label="节点高度"
          initialValue={nodeConfig.height}
          rules={[{ required: true, message: 'Please enter node height' }]}
        >
          <Input placeholder="Please enter node height" />
        </Form.Item>
        <Form.Item
          name="transverseSpacing"
          label="节点横向间距"
          initialValue={nodeConfig.transverseSpacing}
          rules={[{ required: true, message: 'Please enter node transverse spacing' }]}
        >
          <Input placeholder="Please enter node transverse spacing" />
        </Form.Item>
        <Form.Item
          name="longitudinalSpacing"
          label="节点纵向间距"
          initialValue={nodeConfig.longitudinalSpacing}
          rules={[{ required: true, message: 'Please enter user longitudinal spacing' }]}
        >
          <Input placeholder="Please enter user longitudinal spacing" />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export { Config } 