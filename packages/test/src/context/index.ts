import React from 'react'
import { createContainer } from 'unstated-next'
import { MoveStageInstance } from '../components'
import { getUniqId } from '../utils'

interface IInitialState { moveStageRef: React.RefObject<MoveStageInstance> }

const useGlobal = (initialState?: IInitialState) => {
  const { moveStageRef } = initialState!
  return {
    ...moveStageRef.current,
    moveStageRef
  }
}

const GlobalContext = createContainer(useGlobal)

export { GlobalContext }