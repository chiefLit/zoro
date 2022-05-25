import React from 'react'
import { IDictionary, ISizeConfig, NodeDataProps } from '../types';
import { NodeBox, PipelineBox } from '../components';
import { nodeType } from '../types/enums';
import { getUniqId } from '../utils';

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

interface GlobalContextProps {
  typeConfigs: IDictionary;

  flowData: IDictionary[];
  setFlowData: React.Dispatch<React.SetStateAction<IDictionary[]>>

  sceneZoomPercentage: number;
  setSceneZoomPercentage: React.Dispatch<React.SetStateAction<number>>;
  scenePositionX: number,
  setScenePositionX: React.Dispatch<React.SetStateAction<number>>;
  scenePositionY: number,
  setScenePositionY: React.Dispatch<React.SetStateAction<number>>;

  sizeConfig: ISizeConfig,
  setSizeConfig: React.Dispatch<React.SetStateAction<ISizeConfig>>;

  addNode: (params: { data: NodeDataProps }) => void;
  deldeteNode: (params: { nodeBox: NodeBox }) => void;
  addNodeVisible: boolean;
  setAddNodeVisible: React.Dispatch<React.SetStateAction<boolean>>

  fromNodeBox?: NodeBox;
  setFromNodeBox: React.Dispatch<React.SetStateAction<NodeBox | undefined>>;
  belongPipelineBox?: PipelineBox;
  setBelongPipelineBox: React.Dispatch<React.SetStateAction<PipelineBox | undefined>>
}

const GlobalContext = React.createContext<GlobalContextProps>({} as GlobalContextProps)

const GlobalProvider: React.FC<{ data: any }> = ({ children, data }) => {
  // 数据和历史记录
  const [flowData, setFlowData] = React.useState<IDictionary[]>(data);
  const [historyRecords, setHistoryRecords] = React.useState<Array<IDictionary[]>>([data]);
  // 定位大小等信息
  const [sceneZoomPercentage, setSceneZoomPercentage] = React.useState(100)
  const [scenePositionX, setScenePositionX] = React.useState(0);
  const [scenePositionY, setScenePositionY] = React.useState(0);
  const [sizeConfig, setSizeConfig] = React.useState<ISizeConfig>({ nodeConfig: initNodeConfig, nodeBoxConfig: initNodeBoxConfig, pipelineBoxConfig: initPipelineBoxConfig })
  // 添加节点时存放的数据
  const [fromNodeBox, setFromNodeBox] = React.useState<NodeBox>()
  const [belongPipelineBox, setBelongPipelineBox] = React.useState<PipelineBox>()
  const [addNodeVisible, setAddNodeVisible] = React.useState<boolean>(false)

  const handleSetFlowData = (data: IDictionary[]) => {
    if (historyRecords[historyRecords.length - 1] === data) return
    setHistoryRecords([...historyRecords, data])
    setFlowData([...data])
  }

  // 添加节点
  const addNode = (params: { data: NodeDataProps }) => {
    const { data } = params;
    let newNodeData: NodeDataProps = { ...data, id: getUniqId() }
    // 特殊类型做补充基础配置
    switch (newNodeData.type) {
      case nodeType.branch:
        newNodeData = { ...newNodeData, config: { branches: [{ pipeline: [] }] } }
        break;
      case nodeType.group:
        newNodeData = { ...newNodeData, config: { group: { pipeline: [] } } }
        break;
      default:
        break;
    }

    if (fromNodeBox) {
      // 当前NodeBox下一个
      let targetPipeline: IDictionary[] | IDictionary = flowData;
      let pathList = fromNodeBox!.path
      const lastIndex = pathList.pop() as number
      pathList.forEach(i => {
        targetPipeline = targetPipeline[i]
      })
      if (targetPipeline) {
        targetPipeline.splice(lastIndex + 1, 0, newNodeData)
      }
      handleSetFlowData(flowData)
    } else {
      // 当前pipeline第一个
      let targetPipeline: IDictionary[] | IDictionary = flowData;
      belongPipelineBox!.path.forEach(i => {
        targetPipeline = targetPipeline[i]
      })
      if (targetPipeline) {
        (targetPipeline as IDictionary).pipeline = (targetPipeline as any)?.pipeline || [];
        (targetPipeline as IDictionary).pipeline = [newNodeData, ...(targetPipeline as any)?.pipeline];
      }
      handleSetFlowData(flowData)
    }
    setAddNodeVisible(false)
  }
  // 删除节点
  const deldeteNode = (params: { nodeBox: NodeBox }) => {
    const { nodeBox } = params;
    let pathList = nodeBox.path
    const lastIndex = pathList.pop() as number
    let targetPipeline: IDictionary[] | IDictionary = flowData;
    pathList.forEach(i => {
      targetPipeline = targetPipeline[i]
    })
    if (targetPipeline) {
      targetPipeline = targetPipeline.filter((nodeData: any) => nodeData.id !== nodeBox.nodeData.id)
    }
    handleSetFlowData(flowData)
  }

  // 添加分支
  const addBranch = () => { }
  // 删除分支
  const removeBranch = () => { }

  // 前进
  const forward = () => { }
  // 撤回
  const revoke = () => { }

  const providerValue = {
    typeConfigs,
    sceneZoomPercentage, setSceneZoomPercentage,
    scenePositionX, setScenePositionX,
    scenePositionY, setScenePositionY,
    sizeConfig, setSizeConfig,
    addNode,
    deldeteNode,
    fromNodeBox, setFromNodeBox,
    belongPipelineBox, setBelongPipelineBox,
    addNodeVisible, setAddNodeVisible,
    flowData, setFlowData: handleSetFlowData(flowData)
  }

  return <GlobalContext.Provider value={providerValue}>
    {children}
  </GlobalContext.Provider>
}

export { initNodeConfig, initNodeBoxConfig, initPipelineBoxConfig, typeConfigs }
export { GlobalContext, GlobalProvider }