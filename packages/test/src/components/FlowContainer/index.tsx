import React from 'react'
import { GlobalContext } from '../../context'
import { getUniqId } from '../../utils'
import styles from './index.module.less'
import { NodeContainer } from '../NodeContainer'
import { PipelineProps } from '../../types'

const mockData = [
  {
    "id": "aHty2D",
    "type": "query",
    "displayName": "findAll",
    "config": {
      "outputParameter": {
        "path": "listA",
        "model": "basicapp_TestContextModel",
        "type": "ModelArray",
        "isQueryModel": false
      }
    }
  },
  {
    "id": "IHrGmK",
    "type": "function",
    "displayName": "ownerADataPermissionFunc",
    "config": {
      "logicFunctionKey": "basicapp_OwnerADataPermissionFunc",
      "logicFunction": {
        "anonymousAccess": false,
        "builtInFunction": false,
        "dataPermissionEnabled": false,
        "key": "basicapp_OwnerADataPermissionFunc"
      },
      "inputParameters": {
        "testContextModel": {
          "path": "testContextModel",
          "model": "basicapp_TestContextModel",
          "type": "QueryModel",
          "isQueryModel": true
        }
      },
      "outputParameter": {
        "path": "list",
        "model": "basicapp_TestContextModel",
        "type": "ModelArray",
        "isQueryModel": false
      }
    }
  },
  {
    "id": "fRUmMS",
    "type": "end",
    "displayName": "END",
    "config": {
      "type": "END",
      "outputParameter": {
        "path": "listA",
        "model": "basicapp_TestContextModel",
        "type": "ModelArray",
        "isQueryModel": false
      }
    }
  }
]

/**
 * 逻辑流
 * @returns Element
 */
const FlowContainer: React.FC<PipelineProps> = (props) => {
  const newList = mockData.map(item => {
    return {
      ...item,
    }
  })
  return (
    <div>
      {
        mockData.map((item, index) => {
          return (
            <NodeContainer id={item.id} type={item.type} displayName={item.displayName} key={index} config={[]} />
          )
        })
      }
      123123
      {/* <svg id="svg" width='auto' height='auto'>
        {
          mockData.map((item, index) => {
            return (
              <rect key={index} width={'100'} height={'100'} x={0} y={100 * index} style={{ cursor: 'pointer' }} fill="red"></rect>
            )
          })
        }
      </svg> */}
      12312
    </div>
  )
}

export { FlowContainer }