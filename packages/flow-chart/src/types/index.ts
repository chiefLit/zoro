export interface FlowProps {
  id?: string;
  name?: string;
  type?: string;
  pipeline?: PipelineProps;
  [key: React.Key]: any;
}

export type PipelineProps = NodeProps[]

export interface NodeProps {
  id?: string;
  type?: string;
  displayName?: string;
  description?: string;
  config: NodeConfigProps[];
  [key: React.Key]: any;
}

export interface NodeConfigProps {
  pipeline?: PipelineProps;
  [key: React.Key]: any;
}

export interface TypeConfigProps {
  [key: React.Key]: any;
}

export interface IDictionary {
  [key: React.Key]: any;
}

export interface PointPosition {
  x: number;
  y: number;
}