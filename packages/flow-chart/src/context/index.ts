import React from 'react'
import { getUniqId } from '../utils'
import { createModel } from 'hox'
import { IDictionary, INodeBoxConfig, INodeConfig, IPipelineConfig, NodeDataProps } from '../types';
import { Node, NodeBox, PipelineBox } from '../components';
import { nodeType } from '../types/enums';

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

const useGlobal = () => {
  const [flowData, setFlowData] = React.useState<IDictionary[]>();
  const [sceneZoomPercentage, setSceneZoomPercentage] = React.useState(100)
  const [scenePositionX, setScenePositionX] = React.useState(0);
  const [scenePositionY, setScenePositionY] = React.useState(0);
  const [nodeConfig, setNodeConfig] = React.useState<INodeConfig>(initNodeConfig)
  const [nodeBoxConfig, setNodeBoxConfig] = React.useState<INodeBoxConfig>(initNodeBoxConfig)
  const [pipelineBoxConfig, setPipelineBoxConfig] = React.useState<IPipelineConfig>(initPipelineBoxConfig)
  const [fromNodeBox, setFromNodeBox] = React.useState<NodeBox>()
  const [belongPipelineBox, setBelongPipelineBox] = React.useState<PipelineBox>()
  const [addNodeVisible, setAddNodeVisible] = React.useState<boolean>(false)

  React.useEffect(() => {
    console.log('%cindex.ts line:61 flowData', 'color: #007acc;', flowData);
  }, [flowData])

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

  const addNode = (params: { data: NodeDataProps }) => {
    const { data } = params;
    console.log('%cindex.ts line:75 flowData', 'color: #007acc;', flowData);
    console.log('%cindex.ts line:75 data', 'color: #007acc;', data);
    console.log('%cindex.ts line:75 fromNodeBox', 'color: #007acc;', fromNodeBox);
    console.log('%cindex.ts line:75 belongPipelineBox', 'color: #007acc;', belongPipelineBox);
    if (fromNodeBox) {
      
    } else {
      console.log('%cindex.ts line:82 belongPipelineBox?.path', 'color: #007acc;', belongPipelineBox?.path);
    }
    setFlowData(flowData?.map((item, index) => {
      if (index === 0) {
        item.displayName = '12312312'
      }
      return item
    }))
    setAddNodeVisible(false)
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
    pipelineBoxConfig, setPipelineBoxConfig,
    addNode,
    fromNodeBox, setFromNodeBox,
    belongPipelineBox, setBelongPipelineBox,
    addNodeVisible, setAddNodeVisible,
    flowData, setFlowData
  }
}

export default createModel(useGlobal)