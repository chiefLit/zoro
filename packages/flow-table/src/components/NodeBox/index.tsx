import React from 'react'
import { FlowTableData } from '@/types'
import AddNodeButton from '../AddNodeButton'
import { BranchBox, NodeBox } from '..'
import NodeCard from '../NodeCard'
import ConditionCard from '../ConditionCard'
import './style.less'

interface NodeBoxProps {
  data: FlowTableData;
}

export default (props: NodeBoxProps) => {
  const { data } = props;

  return (
    <>
      {
        data?.conditionNodes && data?.conditionType
          ? <BranchBox data={data} />
          : <div className='node-box-wrapper'>
            {
              data.condition
                ? <ConditionCard data={data} />
                : <NodeCard data={data} />
            }
            <AddNodeButton data={data} />
          </div>
      }
      {
        data?.childNode
          ? <NodeBox data={data?.childNode} />
          : !data.isInBranch
            ? <div className='end-node-wrapper'>流程结束</div>
            : null
      }
    </>
  )
}