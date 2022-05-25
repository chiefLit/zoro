import React from 'react'
import { IDictionary, ISizeConfig } from '../types';
import { nodeType } from '../types/enums';

/**
 * 节点定位配置
 */
const initNodeConfig = {
  width: 200,
  transverseSpacing: 40,
  height: 100,
  longitudinalSpacing: 40
}
/**
 * 节点盒子定位配置
 */
const NodeBoxTransverseSpacing = 0
const NodeBoxLongitudinalSpacing = 20
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
  longitudinalSpacing: 60
}


const typeConfigs = {
  [nodeType.branch]: {
    branch: {
      hasEnd: true
    }
  },
  [nodeType.group]: {
    group: {
      hasEnd: true
    }
  },
}

interface ConfigContextProps {
  typeConfigs: IDictionary;

  sceneZoomPercentage: number;
  setSceneZoomPercentage: React.Dispatch<React.SetStateAction<number>>;
  scenePositionX: number,
  setScenePositionX: React.Dispatch<React.SetStateAction<number>>;
  scenePositionY: number,
  setScenePositionY: React.Dispatch<React.SetStateAction<number>>;

  sizeConfig: ISizeConfig,
  setSizeConfig: React.Dispatch<React.SetStateAction<ISizeConfig>>;
}

const ConfigContext = React.createContext<ConfigContextProps>({} as ConfigContextProps)

const ConfigProvider: React.FC = ({ children }) => {
  // 定位大小等信息
  const [sceneZoomPercentage, setSceneZoomPercentage] = React.useState(100)
  const [scenePositionX, setScenePositionX] = React.useState(0);
  const [scenePositionY, setScenePositionY] = React.useState(0);
  const [sizeConfig, setSizeConfig] = React.useState<ISizeConfig>({ nodeConfig: initNodeConfig, nodeBoxConfig: initNodeBoxConfig, pipelineBoxConfig: initPipelineBoxConfig })
  const [mode, setMode] = React.useState();

  const providerValue = {
    typeConfigs,
    sceneZoomPercentage, setSceneZoomPercentage,
    scenePositionX, setScenePositionX,
    scenePositionY, setScenePositionY,
    sizeConfig, setSizeConfig,
  }

  return <ConfigContext.Provider value={providerValue}>
    {children}
  </ConfigContext.Provider>
}

export { initNodeConfig, initNodeBoxConfig, initPipelineBoxConfig, typeConfigs }
export { ConfigContext, ConfigProvider }