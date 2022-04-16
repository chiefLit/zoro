import React from 'react'
import { MoveStageInstance } from '../components'
import { getUniqId } from '../utils'
import { createModel } from 'hox'

interface INodeConfig {
  width: number;
  height: number;
  transverseSpacing: number;
  longitudinalSpacing: number
}

const useGlobal = () => {
  const [nodeConfig, setNodeConfig] = React.useState<INodeConfig>({
    width: 200,
    height: 100,
    transverseSpacing: 40,
    longitudinalSpacing: 40
  })

  return {
    nodeConfig,
    setNodeConfig,
  }
}

const GlobalContext = createModel(useGlobal)

export { GlobalContext }