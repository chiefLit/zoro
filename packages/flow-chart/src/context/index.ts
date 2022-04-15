import React from 'react'
import { createContainer } from 'unstated-next'
import { MoveStageInstance } from '../components'
import { getUniqId } from '../utils'

interface IInitialState { moveStageRef: React.RefObject<MoveStageInstance> }
export interface INodeConfig {
  width: number;
  height: number;
  /**
   * 横向间距
   */
  transverseSpacing: number
  /**
   * 纵向间距
   */
  longitudinalSpacing: number
}

const useGlobal = (initialState?: IInitialState) => {
  const { moveStageRef } = initialState!
  const [nodeConfig, setNodeConfig] = React.useState<INodeConfig>({
    width: 200,
    height: 100,
    transverseSpacing: 40,
    longitudinalSpacing: 40
  })

  return {
    ...moveStageRef.current,
    moveStageRef,
    nodeConfig,
    setNodeConfig,
    typeConfig: {
      branch: {
        branch: {}
      },
      group: {
        group: {}
      },
    }
  }
}

const GlobalContext = createContainer(useGlobal)

export { GlobalContext }