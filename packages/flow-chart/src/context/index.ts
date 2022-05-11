import React from 'react'
import { getUniqId } from '../utils'
import { createModel } from 'hox'
import { IDictionary, INodeBoxConfig, INodeConfig, IPipelineConfig } from '../types';

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
/**
 * 节点定位配置
 */
const initNodeConfig = {
  width: 200,
  transverseSpacing: 40,
  height: 30,
  longitudinalSpacing: 40
}
/**
 * 节点盒子定位配置
 */
const NodeBoxTransverseSpacing = 0
const NodeBoxLongitudinalSpacing = 50
const initNodeBoxConfig = {
  nodeSelfWidth: initNodeConfig.width + initNodeConfig.transverseSpacing + NodeBoxTransverseSpacing,
  nodeSelfHieght: initNodeConfig.height + initNodeConfig.longitudinalSpacing + NodeBoxLongitudinalSpacing,
  transverseSpacing: NodeBoxTransverseSpacing,
  longitudinalSpacing: NodeBoxLongitudinalSpacing
}
/**
 * 管道定位配置
 */
const initPipelineBoxConfig = {
  longitudinalSpacing: 20
}

const useGlobal = () => {
  const [sceneZoomPercentage, setSceneZoomPercentage] = React.useState(100)
  const [scenePositionX, setScenePositionX] = React.useState(0);
  const [scenePositionY, setScenePositionY] = React.useState(0);
  const [nodeConfig, setNodeConfig] = React.useState<INodeConfig>(initNodeConfig)
  const [nodeBoxConfig, setNodeBoxConfig] = React.useState<INodeBoxConfig>(initNodeBoxConfig)
  const [pipelineBoxConfig, setPipelineBoxConfig] = React.useState<IPipelineConfig>(initPipelineBoxConfig)

  const typeConfigs = {
    branch: {
      branch: {
        hasEnd: true
      }
    },
    group: {
      group: {
        hasEnd: true
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