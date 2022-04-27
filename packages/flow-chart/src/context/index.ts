import React from 'react'
import { getUniqId } from '../utils'
import { createModel } from 'hox'
import { IDictionary, INodeConfig, ISpacing } from '../types';

export interface ModelTypes {
  typeConfigs: { [key: string]: IDictionary };
  stageDomId: string;
  sceneDomId: string;
  nodeConfig: INodeConfig;
  setNodeConfig: (data: INodeConfig) => void;
  sceneZoomPercentage: number;
  setSceneZoomPercentage: (data: number) => void;
  scenePositionX: number;
  setScenePositionX: (data: number) => void;
  scenePositionY: number;
  setScenePositionY: (data: number) => void;
}

const initNodeConfig = {
  width: 200,
  transverseSpacing: 40,
  height: 30,
  longitudinalSpacing: 40
}
const initNodeBoxConfig = {
  transverseSpacing: 0,
  longitudinalSpacing: 60
}
const initPipelineBoxConfig = {
  transverseSpacing: 0,
  longitudinalSpacing: 60
}

const useGlobal = () => {
  const [sceneZoomPercentage, setSceneZoomPercentage] = React.useState(100)
  const [scenePositionX, setScenePositionX] = React.useState(0);
  const [scenePositionY, setScenePositionY] = React.useState(0);
  const [nodeConfig, setNodeConfig] = React.useState<INodeConfig>(initNodeConfig)
  const [nodeBoxConfig, setNodeBoxConfig] = React.useState<ISpacing>(initNodeBoxConfig)
  const [pipelineBoxConfig, setPipelineBoxConfig] = React.useState<ISpacing>(initPipelineBoxConfig)

  const typeConfigs = {
    branch: {
      branch: {
        hasEnd: false
      }
    },
    group: {
      group: {
        hasEnd: false
      }
    },
  }

  return {
    typeConfigs,
    stageDomId: `stage_${Date.now().toString(36)}`,
    sceneDomId: `scene_${Date.now().toString(36)}`,
    sceneZoomPercentage, setSceneZoomPercentage,
    scenePositionX, setScenePositionX,
    scenePositionY, setScenePositionY,
    nodeConfig, setNodeConfig,
    nodeBoxConfig, setNodeBoxConfig,
    pipelineBoxConfig, setPipelineBoxConfig
  }
}

export default createModel(useGlobal)