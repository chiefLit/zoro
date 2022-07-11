import React from 'react'
import { Button } from 'antd';
import { ConditionType, FlowTableData } from '@/types'
import './style.less'
import { FlowContext } from '@/context';

interface AddBranchButtonProps {
  data: FlowTableData
}

export default (props: AddBranchButtonProps) => {
  const { data } = props;
  const { onAddBranch } = React.useContext(FlowContext)


  const handleClick = () => {
    onAddBranch?.({ targetNode: data })
  }

  return (
    <Button className='add-branch-button' onClick={handleClick}>{
      data.conditionType === ConditionType.condition
        ? '添加条件'
        : '添加分支'
    }</Button>
  )
}