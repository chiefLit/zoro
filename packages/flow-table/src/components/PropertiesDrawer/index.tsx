import React from 'react'
import { Drawer, DrawerProps, Form } from 'antd'
import { FlowContext } from '@/context'
import EditableText from '../EditableText'

interface PropertiesDrawerProps extends DrawerProps {

}

const PropertiesDrawer: React.FC<PropertiesDrawerProps> = (props) => {
  const { visible } = props
  const { editingNode, setEditingNode } = React.useContext(FlowContext)
  const properties = editingNode?.properties

  const handleClose = () => {
    setEditingNode(undefined)
  }

  const hanldeChangeTitle = (value:string) => {
    
  }

  return (
    <Drawer 
      visible={!!editingNode} 
      onClose={handleClose} 
      title={<EditableText value={properties?.title!} onChange={hanldeChangeTitle}/>}
      width='800'>
      <Form>

      </Form>
    </Drawer>
  )
}

export { PropertiesDrawer }