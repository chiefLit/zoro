import { ConditionType, FlowTableData, NodeType } from '@/types'

export const mock1: FlowTableData = {
  nodeId: '1',
  type: 'normal' as NodeType,
  content: '节点1',
  properties: {
    title: '123'
  }
}
export const mock2: FlowTableData = {
  nodeId: '1',
  type: 'normal' as NodeType,
  content: '节点1',
  properties: {
    title: '123'
  },
  childNode: {
    nodeId: '2',
    type: 'normal' as NodeType,
    content: '节点2',
    prevId: '1',
    properties: {
      title: '123'
    },
    conditionType: ConditionType.condition,
    conditionNodes: [
      {
        nodeId: '4',
        type: 'normal' as NodeType,
        content: '节点4',
        prevId: '2',
        properties: {
          title: '123'
        },
      },
      {
        nodeId: '5',
        type: 'normal' as NodeType,
        content: '节点5',
        prevId: '2',
        properties: {
          title: '123'
        },
        childNode: {
          prevId: '5',
          nodeId: '9',
          type: 'normal' as NodeType,
          content: '节点9',
          properties: {
            title: '123'
          },
        },
        conditionType: ConditionType.condition,
        conditionNodes: [
          {
            nodeId: '6',
            type: 'normal' as NodeType,
            content: '节点6',
            prevId: '5',
            properties: {
              title: '123'
            },
          },
          {
            nodeId: '7',
            type: 'normal' as NodeType,
            content: '节点7',
            prevId: '5',
            properties: {
              title: '123'
            },
          }
        ],
      },
      {
        nodeId: '8',
        type: 'normal' as NodeType,
        content: '节点8',
        prevId: '1',
        properties: {
          title: '123'
        },
      },
    ],
    childNode: {
      nodeId: '3',
      type: 'normal' as NodeType,
      content: '节点3',
      prevId: '2',
      properties: {
        title: '123'
      },
    }
  }
}