import React from 'react'
import { ConditionType, FlowTableData, NodeTypeItem, NodeType, CommonProperties, FlowTableProps } from '@/types';
import { getUniqId } from '@/utils';
import { message } from 'antd';

/**
 * 流程相关的状态管理
 */
interface FlowContextProps {
  flowData: FlowTableData;
  nodeTypes: NodeTypeItem[];
  /**
   * 点击添加节点按钮事件，如果绑定该事件默认的逻辑将不执行。
   */
  onAddNode: (params: { previousNode: FlowTableData, nodeType: NodeType }) => void;
  /**
   * 点击删除节点按钮事件，如果绑定该事件默认的逻辑将不执行。
   */
  onDeleteNode: (params: { targetNode: FlowTableData }) => void;
  /**
   * 点击添加分支按钮事件，如果绑定该事件默认的逻辑将不执行。
   */
  onAddBranch: (params: { targetNode: FlowTableData }) => void;
  /**
   * 点击删除分支按钮事件，如果绑定该事件默认的逻辑将不执行。
   */
  onDeleteBranch: (params: { targetBranch: FlowTableData }) => void;
  editingNode: FlowTableData | undefined;
  setEditingNode: React.Dispatch<React.SetStateAction<FlowTableData | undefined>>
  updateNodeProperties: (params: { targetNode: FlowTableData, newProperties: CommonProperties & Record<string, unknown> }) => void
  getNodeById: (id: string) => FlowTableData
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
  { title: '条件分支', type: NodeType.condition },
  { title: '分流合流', type: NodeType.interflow }
]

interface FlowProviderProps extends FlowTableProps {
  children: React.ReactNode;
}

const FlowProvider: React.FC<FlowProviderProps> = (props) => {
  const { children, value, ...events } = props
  const [flowData, setFlowData] = React.useState<FlowTableData>(value);
  const [flowMap, setFlowMap] = React.useState<Record<string, FlowTableData>>();
  const [editingNode, setEditingNode] = React.useState<FlowTableData>()

  React.useEffect(() => {
    const fMap = linkedListToMap(flowData)
    setFlowMap(fMap)
    events.onChange?.(flowData)
  }, [flowData])

  /**
   * 添加节点
   * @param newSon 新增节点
   * @param father 目标节点
   */
  const onAddNode = React.useMemo(() => (params: { previousNode: FlowTableData, nodeType: NodeType }) => {
    const { previousNode, nodeType } = params
    events.beforeAddNode?.({ previousNode, nodeType })
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
      childNode: previousNode.childNode,
      isInBranch: previousNode.isInBranch,
      prevId: previousNode.nodeId,
    }
    if (nodeType === NodeType.interflow) {
      newSon.conditionType = typeData.type as unknown as ConditionType
      newSon.conditionNodes = [
        { nodeId: getUniqId(), type: typeData.type, condition: true, properties: { title: '分支' }, isInBranch: true, prevId: newSon.nodeId },
        { nodeId: getUniqId(), type: typeData.type, condition: true, properties: { title: '分支' }, isInBranch: true, prevId: newSon.nodeId },
      ]
    }
    if (nodeType === NodeType.condition) {
      newSon.conditionType = typeData.type as unknown as ConditionType
      newSon.conditionNodes = [
        { nodeId: getUniqId(), type: typeData.type, condition: true, properties: { title: '条件' }, isInBranch: true, prevId: newSon.nodeId },
        { nodeId: getUniqId(), type: typeData.type, condition: true, properties: { title: '条件' }, isInBranch: true, prevId: newSon.nodeId },
      ]
    }
    if (previousNode.childNode) {
      previousNode.childNode.prevId = newSon.nodeId
    }
    previousNode.childNode = newSon;
    setFlowData({ ...flowData })
    events.afterAddNode?.({ previousNode, targetNode: newSon })
  }, [flowData])


  /**
   * 删除节点
   * @param targetNode 待删除的节点
   */
  const onDeleteNode = React.useMemo(() => ({ targetNode }: { targetNode: FlowTableData }) => {
    events.beforeDeleteNode?.({ targetNode })
    if (!flowMap || !targetNode.prevId) return
    if (targetNode.nodeId === flowData.nodeId) {
      console.error('不能删除起始节点')
      return
    }
    const previousNode = flowMap[targetNode.prevId]
    if (targetNode.childNode?.nodeId) {
      targetNode.childNode.prevId = previousNode?.nodeId;
      previousNode.childNode = targetNode.childNode;
    } else {
      previousNode.childNode = undefined
    }
    setFlowData({ ...flowData })
    events.afterDeleteNode?.({ targetNode })
  }, [flowData, flowMap])

  /**
   * 添加分支
   * @param targetNode 需要添加分支的节点
   */
  const onAddBranch = ({ targetNode }: { targetNode: FlowTableData }) => {
    events.beforeAddBranch?.({ targetNode })
    targetNode.conditionNodes?.push({
      nodeId: getUniqId(),
      type: targetNode.type,
      condition: true,
      properties: { title: targetNode.type === NodeType.interflow ? '分支' : '条件' },
      isInBranch: true,
      prevId: targetNode.nodeId
    })
    setFlowData({ ...flowData })
    events.afterAddBranch?.({ targetNode })
  }

  /**
   * 删除分支
   * @param targetNode 需要删除的节点
   */
  const onDeleteBranch = React.useMemo(() => ({ targetBranch }: { targetBranch: FlowTableData }) => {
    events.beforeDeleteBranch?.({ targetBranch })
    if (!flowMap || !targetBranch.prevId) return
    const previousNode = flowMap[targetBranch.prevId]
    if (previousNode.conditionNodes?.length! > 2) {
      previousNode.conditionNodes = previousNode.conditionNodes?.filter(item => item.nodeId !== targetBranch.nodeId)
    } else {
      onDeleteNode({ targetNode: previousNode })
    }
    setFlowData({ ...flowData })
    events.afterDeleteBranch?.({ targetBranch })
  }, [flowData, flowMap])

  const updateNodeProperties = (params: { targetNode: FlowTableData, newProperties: CommonProperties & Record<string, unknown> }) => {
    const { targetNode, newProperties } = params
    targetNode.properties = newProperties
    setFlowData({ ...flowData })
  }

  const getNodeById = (id: string) => {
    if (!flowMap || !id) return
    const node = flowMap[id]
    if (!node) message.error(`未找到ID为 ${id} 的节点`);
    return node
  }

  // 前进
  const forward = () => { }
  // 撤回
  const revoke = () => { }

  const providerValue = React.useMemo(() => {
    return {
      flowData,
      nodeTypes,
      onAddNode: events.onAddNode || onAddNode,
      onDeleteNode: events.onDeleteNode || onDeleteNode,
      onAddBranch: events.onAddBranch || onAddBranch,
      onDeleteBranch: events.onDeleteBranch || onDeleteBranch,
      editingNode,
      setEditingNode,
      updateNodeProperties,
      getNodeById
    }
  }, [flowData, flowMap, editingNode, setEditingNode])

  return <FlowContext.Provider value={providerValue}>
    {children}
  </FlowContext.Provider>
}

export { FlowContext, FlowProvider }