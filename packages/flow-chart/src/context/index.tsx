import React from 'react'
import { IDictionary, ISizeConfig, NodeDataProps } from '../types';
import { NodeBox, PipelineBox } from '../components';
import { nodeType } from '../types/enums';
import { getUniqId } from '../utils';
import { Modal } from 'antd';

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
  setBelongPipelineBox: React.Dispatch<React.SetStateAction<PipelineBox | undefined>>;

  heightLightNodes: NodeDataProps[];
  setHeightLightNodes: React.Dispatch<React.SetStateAction<NodeDataProps[]>>;
}

const GlobalContext = React.createContext<GlobalContextProps>({} as GlobalContextProps)

const GlobalProvider: React.FC<{ data: any }> = ({ children, data }) => {
  // 数据和历史记录
  const [flowData, setFlowData] = React.useState<IDictionary[]>(data);
  const [heightLightNodes, setHeightLightNodes] = React.useState<NodeDataProps[]>([])
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
      const path = fromNodeBox!.path.map((item, index) => {
        return index === fromNodeBox!.path.length - 1 ? (item as number) + 1 : item
      })
      const newData = addNodeByPath(flowData, path, newNodeData)
      setFlowData([...newData])
    } else {
      // 当前pipeline第一个
      const path = [...belongPipelineBox!.path, 'pipeline', 0]
      const newData = addNodeByPath(flowData, path, newNodeData)
      setFlowData([...newData])
    }
    setHeightLightNodes([newNodeData])
    setAddNodeVisible(false)
  }
  // 删除节点
  const deldeteNode = (params: { nodeBox: NodeBox }) => {
    const { nodeBox } = params;
    Modal.confirm({
      title: '提示',
      content: `确认删除节点 ${nodeBox.nodeData.displayName}`,
      onOk: () => {
        const newData = deleteNodeByPath(flowData, nodeBox.path)
        console.log('%cindex.tsx line:143 newData', 'color: #007acc;', newData);
        setFlowData([...newData])
      }
    })
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
    flowData, setFlowData,
    heightLightNodes, setHeightLightNodes
  }

  return <GlobalContext.Provider value={providerValue}>
    {children}
  </GlobalContext.Provider>
}

export { initNodeConfig, initNodeBoxConfig, initPipelineBoxConfig, typeConfigs }
export { GlobalContext, GlobalProvider }

/**
 * 指定位置添加节点
 * @param source 原始数据
 * @param path 操作路径
 * @param node 新增节点
 * @returns 
 */
function addNodeByPath(source: any, path: Array<number | string>, node: any) {
  const k = path.shift();
  if (typeof k === "undefined") return source;
  if (path.length === 0) {
    if (typeof k === "number") {
      source = source || []
      source.splice(k, 0, node);
    } else {
      source[k] = node;
    }
  } else {
    source[k] = addNodeByPath(source[k], path, node);
  }
  return source;
}

/**
 * 指定位置删除节点
 * @param source 原始数据
 * @param path 操作路径
 * @returns 
 */
function deleteNodeByPath(source: any, path: Array<number | string>) {
  const k = path.shift();
  if (typeof k === "undefined") return source;
  if (path.length === 0) {
    if (typeof k === "number") {
      source.splice(k, 1);
    } else {
      delete source[k];
    }
  } else {
    source[k] = deleteNodeByPath(source[k], path);
  }
  return source;
}