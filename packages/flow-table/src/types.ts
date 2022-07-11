/**
 * 流程表入参
 */
export interface FlowTableProps {
  /**
   * 值
   */
  value: FlowTableData;
  /**
   * 添加节点前
   */
  onChange?: (data: FlowTableData) => void;

  /**
   * 点击添加节点按钮事件，如果绑定该事件默认的逻辑将不执行。(todo：需要将点击【+】和【normal】做一下区别，)
   */
  onAddNode?: (params: { previousNode: FlowTableData, nodeType: NodeType }) => void;
  /**
   * 点击删除节点按钮事件，如果绑定该事件默认的逻辑将不执行。
   */
  onDeleteNode?: (params: { targetNode: FlowTableData }) => void;
  /**
   * 点击添加分支按钮事件，如果绑定该事件默认的逻辑将不执行。
   */
  onAddBranch?: (params: { targetNode: FlowTableData }) => void;
  /**
   * 点击删除分支按钮事件，如果绑定该事件默认的逻辑将不执行。
   */
  onDeleteBranch?: (params: { targetBranch: FlowTableData }) => void;

  /**
   * 添加节点前回调
   */
  beforeAddNode?: (params: { previousNode: FlowTableData, nodeType: NodeType }) => void;
  /**
   * 添加节点后回调
   */
  afterAddNode?: (parmas: { previousNode: FlowTableData, targetNode: FlowTableData }) => void;
  /**
   * 删除节点前回调
   */
  beforeDeleteNode?: (params: { targetNode: FlowTableData }) => void;
  /**
   * 删除节点后回调
   */
  afterDeleteNode?: (params: { targetNode: FlowTableData }) => void;

  /**
   * 添加分支前回调
   */
  beforeAddBranch?: (params: { targetNode: FlowTableData }) => void;
  /**
   * 添加分支后回调
   */
  afterAddBranch?: (params: { targetNode: FlowTableData }) => void;
  /**
   * 删除分支前回调
   */
  beforeDeleteBranch?: (params: { targetBranch: FlowTableData }) => void;
  /**
   * 删除分支后回调
   */
  afterDeleteBranch?: (params: { targetBranch: FlowTableData }) => void;

  /**
   * 渲染添加节点的类型
   */
  renderAddModel?: () => React.ReactNode;

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
 * 节点类型，特指节点的渲染类型；区别于节点的业务类型。
 */
export enum NodeType {
  'normal' = 'normal',
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