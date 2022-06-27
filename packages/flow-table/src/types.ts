/**
 * 流程表入参
 */
export interface FlowTableProps {
  /**
   * 流程数据
   */
  data: FlowTableData;
}

/**
 * 流程数据
 * 采用链表的结构  LinkedList 
 */
export type FlowTableData = {

  /**
   * 节点id
   */
  nodeId: string;

  /**
   * 父级节点id
   */
  prevId?: string;

  /**
   * 节点类型
   */
  type: NodeType;

  /**
   * 节点内容区域展示
   */
  content?: string;

  /**
   * 节点的业务属性，及显示在侧滑窗里面的内容
   */
  properties: CommonProperties & Record<string, unknown>;

  /**
   * 子节点
   */
  childNode?: FlowTableData;

  /**
   * 条件类型
   */
  conditionType?: ConditionType;

  /**
   * 条件节点
   */
  conditionNodes?: FlowTableData[];

  [key: string]: unknown
}

/**
 * 节点类型
 */
export enum NodeType {
  'normal' = 'normal',
  'subflow' = 'subflow',
  'condition' = 'condition',
  'interflow' = 'interflow'
}

/**
 * 条件类型
 */
export enum ConditionType {
  "condition" = 'condition',
  "interflow" = 'interflow'
}

/**
 * 节点显示内容
 */
export type CommonProperties = {
  /**
   * 标题信息
   */
  title: string;
}

/**
 * 获取节点信息方法的单个项
 */
export type NodeTypeItem = { 
  title: string; 
  type: NodeType
}