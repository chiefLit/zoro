import React from 'react'
import { FlowTableData } from '@/types'
import NodeBox from '../NodeBox';
import AddNodeButton from '../AddNodeButton';
import AddBranchButton from '../AddBranchButton';
import './style.less'

interface NodeBoxProps {
  data: FlowTableData;
}

export default (props: NodeBoxProps) => {
  const { data } = props;

  return (
    <div className='branch-box-wrapper'>
      <div className='branch-box-content'>
        {
          data.conditionNodes?.map(item => {
            return <div className='row-box' key={item.nodeId}>
              <NodeBox data={item} />
              <div className='center-line' />
            </div>
          })
        }
      </div>
      <AddBranchButton data={data} />
      <AddNodeButton data={data} />
    </div>
  )
}