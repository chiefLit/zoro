import React from 'react'
import { getUniqId } from '../utils'
import { createModel } from 'hox'
import { IDictionary, INodeConfig } from '../types';

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
  height: 100,
  transverseSpacing: 40,
  longitudinalSpacing: 40
}

const useGlobal = () => {
  const [sceneZoomPercentage, setSceneZoomPercentage] = React.useState(100)
  const [scenePositionX, setScenePositionX] = React.useState(0);
  const [scenePositionY, setScenePositionY] = React.useState(0);
  const [nodeConfig, setNodeConfig] = React.useState<INodeConfig>(initNodeConfig)

  const typeConfigs = {
    branch: {
      branch: {}
    },
    group: {
      group: {}
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
  }
}

export default createModel(useGlobal)