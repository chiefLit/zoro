import React from 'react'
import { ConditionType, FlowTableData, NodeTypeItem, NodeType } from '@/types';
import { getUniqId } from '@/utils';

/**
 * 流程相关的状态管理
 */
interface FlowContextProps {
  flowData: FlowTableData;
  nodeTypes: NodeTypeItem[];
  findNodeByNodeId: (nodeId: string, resuceNode: FlowTableData) => FlowTableData | undefined;
  addNode: (nodeType: NodeType, father: FlowTableData) => void;
  deleteNode: (targetNode: FlowTableData) => void;
  addBranch: (targetNode: FlowTableData) => void;
  removeBranch: (targetNode: FlowTableData) => void;
}

const FlowContext = React.createContext({} as FlowContextProps)

/**
 * 链表数据转map
 * @param data 
 * @returns 
 */
const linkedListToMap = (data: FlowTableData) => {
  const result: Record<string, FlowTableData> = {}
  result[data.nodeId] = data;
  if (data?.childNode) {
    Object.assign(result, linkedListToMap(data?.childNode))
  }
  if (data?.conditionNodes) {
    data?.conditionNodes.forEach(node => {
      Object.assign(result, linkedListToMap(node))
    })
  }
  return result
}

const nodeTypes = [
  { title: '普通节点', type: NodeType.normal },
  { title: '子流程', type: NodeType.subflow },
  { title: '条件分支', type: NodeType.condition },
  { title: '分流合流', type: NodeType.interflow }
]

const FlowProvider: React.FC<{ children: React.ReactNode; data: FlowTableData }> = ({ children, data }) => {

  const [flowData, setFlowData] = React.useState<FlowTableData>(data);
  const [flowMap, setFlowMap] = React.useState<Record<string, FlowTableData>>()

  React.useEffect(() => {
    // 一次性转map
    const fMap = linkedListToMap(flowData)
    setFlowMap(fMap)
  }, [flowData])

  /**
   * 添加节点
   * @param newSon 新增节点
   * @param father 目标节点
   */
  const addNode = React.useMemo(() => (nodeType: NodeType, father: FlowTableData) => {
    const typeData = nodeTypes.find(item => item.type === nodeType)

    if (!typeData) {
      console.error(`没找到当前 nodeType: ${nodeType}`)
      return
    }

    const newSon: FlowTableData = {
      nodeId: getUniqId(),
      type: typeData.type,
      properties: {
        title: typeData.title
      },
      childNode: father.childNode,
      isInBranch: father.isInBranch,
      prevId: father.nodeId,
    }
    if (nodeType === NodeType.interflow || nodeType === NodeType.condition) {
      newSon.conditionType = typeData.type as unknown as ConditionType
      newSon.conditionNodes = [
        { nodeId: getUniqId(), type: typeData.type, condition: true, properties: { title: '分支' }, isInBranch: true, prevId: newSon.nodeId },
        { nodeId: getUniqId(), type: typeData.type, condition: true, properties: { title: '分支' }, isInBranch: true, prevId: newSon.nodeId },
      ]
    }
    if (father.childNode) {
      father.childNode.prevId = newSon.nodeId
    }
    father.childNode = newSon;
    setFlowData({ ...flowData })
  }, [flowData])


  /**
   * 删除节点
   * @param targetNode 待删除的节点
   */
  const deleteNode = React.useMemo(() => (targetNode: FlowTableData) => {
    console.log('%cindex.tsx line:100 targetNode', 'color: #007acc;', targetNode);
    if (!flowMap || !targetNode.prevId) return
    if (targetNode.nodeId === flowData.nodeId) {
      console.error('不能删除起始节点')
      return
    }
    const fatherNode = flowMap[targetNode.prevId]
    if (targetNode.childNode?.nodeId) {
      targetNode.childNode.prevId = fatherNode?.nodeId;
      fatherNode.childNode = targetNode.childNode;
    } else {
      fatherNode.childNode = undefined
    }
    setFlowData({ ...flowData })
  }, [flowData, flowMap])

  /**
   * 添加分支
   * @param targetNode 
   */
  const addBranch = (targetNode: FlowTableData) => {
    targetNode.conditionNodes?.push({
      nodeId: getUniqId(),
      type: targetNode.type,
      condition: true,
      properties: { title: '分支' },
      isInBranch: true,
      prevId: targetNode.nodeId
    })
    setFlowData({ ...flowData })
  }

  /**
   * 删除分支
   * @param targetNode 
   */
  const removeBranch = React.useMemo(() => (targetCondition: FlowTableData) => {
    console.log('%cindex.tsx line:136 targetCondition', 'color: #007acc;', targetCondition);
    if (!flowMap || !targetCondition.prevId) return
    const father = flowMap[targetCondition.prevId]
    if (father.conditionNodes?.length! > 2) {
      father.conditionNodes = father.conditionNodes?.filter(item => item.nodeId !== targetCondition.nodeId)
    } else {
      deleteNode(father)
    }
    setFlowData({ ...flowData })
  }, [flowData, flowMap])

  // 前进
  const forward = () => { }
  // 撤回
  const revoke = () => { }

  const providerValue = React.useMemo(() => {
    return {
      flowData,
      nodeTypes,
      addNode,
      deleteNode,
      addBranch,
      removeBranch,
    }
  }, [flowData, flowMap])

  return <FlowContext.Provider value={providerValue}>
    {children}
  </FlowContext.Provider>
}

export { FlowContext, FlowProvider }