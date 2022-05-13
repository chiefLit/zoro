import React from "react";
import { IDictionary, INodeBoxConfig, IPipelineConfig } from "../../types";
import { NodeBox } from "../NodeBox";
import useGlobalModel from '../../context'
import { getUniqId } from "../../utils";
import { DrawLine } from "../Line";
import { AddNodeButton } from "../AddNodeButton";
import { Point } from "../Point";

interface PipelineBoxProps {
  parentNodeBox?: NodeBox;
  pipelineData: IDictionary[];
  indexInNodeBox?: number;
  path?: Array<number | string>
}
/**
 * 管道
 * 根据 数据 决定定位
 * 根据 childrenNodeBoxs 决定宽高
 */
class PipelineBox extends React.Component<PipelineBoxProps> {
  constructor(props: PipelineBoxProps) {
    super(props);
    const { typeConfigs, nodeBoxConfig, pipelineBoxConfig } = useGlobalModel()
    this.nodeBoxConfig = nodeBoxConfig
    this.pipelineBoxConfig = pipelineBoxConfig
    if (props.pipelineData) {
      this.childrenNodeBoxs = props.pipelineData.map((item, index) => {
        let nodeBox: NodeBox;
        const path = props.path ? [...props.path, 'pipeline', index] : [index]
        nodeBox = new NodeBox({ nodeData: item, parentPipeline: this, indexInPipeline: index, path });
        return nodeBox
      })
    }
  }

  public path: Array<number | string> = this.props.path || []
  // 业务数据
  public pipelineData: IDictionary[] = this.props.pipelineData;
  // NodeBox配置
  public nodeBoxConfig: INodeBoxConfig;
  public pipelineBoxConfig: IPipelineConfig;
  // 在NodeBox中的索引
  public indexInNodeBox: number = this.props.indexInNodeBox || 0;
  // 父级NodeBox
  public parentNodeBox?: NodeBox = this.props.parentNodeBox;
  // 父级Pipeline
  public parentPipeline?: PipelineBox = this.props.parentNodeBox?.parentPipeline;
  // 子NodeBox
  public childrenNodeBoxs?: NodeBox[] = [];
  // 根Pipeline
  public rootPipeline: PipelineBox = this.props.parentNodeBox ? this.props.parentNodeBox.parentPipeline.rootPipeline : this;

  public setPipelineData = (pipelineData: IDictionary[]) => {
    this.pipelineData = pipelineData
    this.childrenNodeBoxs = pipelineData.map((item, index) => {
      let nodeBox: NodeBox;
      nodeBox = new NodeBox({ nodeData: item, parentPipeline: this, indexInPipeline: index, path: [index] });
      return nodeBox
    })
  }

  public getCenterX = (): number => {
    let x = 0;
    if (this.parentNodeBox) {
      if (this.indexInNodeBox === 0 || this.indexInNodeBox === -1) {
        x = this.parentNodeBox.getCenterX() - this.parentNodeBox.getWidth() / 2 + this.getWidth() / 2
      } else {
        const brother = this.parentNodeBox.childrenPipelines?.[this.indexInNodeBox - 1]!
        x = brother.getCenterX() + brother.getWidth() / 2 + this.getWidth() / 2
      }
    }
    return x
  };

  public getCenterY = (): number => {
    let y = 0;
    if (this.parentNodeBox) {
      y = this.parentNodeBox.getCenterY() - this.parentNodeBox.getHeight() / 2 + this.getHeight() / 2 + NodeBox.nodeSelfSize.height
    } else {
      // 屏幕的上中点是center 所以需要初始高度
      y = this.getHeight() / 2
    }
    return y
  };

  public getWidth = (): number => {
    if (this.childrenNodeBoxs && this.childrenNodeBoxs.length) {
      return this.childrenNodeBoxs.reduce((sum, next) => Math.max(sum, next.getWidth()), 0)
    } else {
      return this.nodeBoxConfig.nodeSelfWidth
    }
  };

  public getHeight = (): number => {
    if (this.childrenNodeBoxs && this.childrenNodeBoxs.length) {
      return this.childrenNodeBoxs.reduce((sum, next) => sum + next.getHeight(), 0) + this.pipelineBoxConfig.longitudinalSpacing
    } else {
      return 0 + this.pipelineBoxConfig.longitudinalSpacing
    }
  };

  public getBrotherMaxHeight = (): number => {
    if (this.parentNodeBox?.childrenPipelines) {
      return this.parentNodeBox?.childrenPipelines.reduce((sum, next) => Math.max(sum, next.getHeight()), 0)
    } else {
      return this.getHeight()
    }
  };

  public getPoint = (isSvg?: boolean) => {
    const rootPipelineWidth = this.rootPipeline.getWidth()
    const centerX = isSvg ? this.getCenterX() + rootPipelineWidth / 2 : this.getCenterX();
    const centerY = this.getCenterY();
    const width = this.getWidth();
    const height = this.getHeight();
    const brotherMaxHeight = this.getBrotherMaxHeight()
    return {
      topLeft: {
        x: centerX - width / 2,
        y: centerY - height / 2
      },
      center: {
        x: centerX,
        y: centerY
      },
      virtualTopCenter: {
        x: centerX,
        y: centerY - height / 2
      },
      topCenter: {
        x: centerX,
        y: centerY - height / 2 + this.pipelineBoxConfig.longitudinalSpacing / 2
      },
      bottomCenter: {
        x: centerX,
        y: centerY + height / 2 - this.pipelineBoxConfig.longitudinalSpacing / 2
      },
      virtualBottomCenter: {
        x: centerX,
        y: centerY + height / 2
      },
      maxBottomCenter: {
        x: centerX,
        y: centerY - height / 2 + brotherMaxHeight
      },
    }
  }

  public drawBox = (): React.SVGProps<SVGRectElement> => {
    const { topLeft } = this.getPoint(true)
    const uniqId = getUniqId()
    return <>
      <rect
        key={`rect_pipeline_${uniqId}`}
        x={topLeft.x}
        y={topLeft.y}
        width={this.getWidth()}
        height={this.getBrotherMaxHeight()}
        strokeWidth="1"
        stroke='#00f'
        strokeDasharray={'1 2'}
        fill='#f00'
        opacity={0.1}
      />
      {this.childrenNodeBoxs?.map(nodeBox => nodeBox.drawBox())}
    </>
  }

  public drawAddNodeButton = (): React.SVGProps<SVGRectElement> => {
    return <>
      <AddNodeButton belongPipelineBox={this} />
      {this.childrenNodeBoxs?.map(nodeBox => nodeBox.drawAddNodeButton())}
    </>
  }

  public drawLine = (): React.SVGProps<SVGRectElement> => {
    const { topCenter, bottomCenter, virtualTopCenter, maxBottomCenter } = this.getPoint(true)
    return <>
      <DrawLine start={virtualTopCenter} end={topCenter} />
      {this.parentNodeBox?.childrenPipelines?.length && <DrawLine start={bottomCenter} end={maxBottomCenter} />}
      {this.childrenNodeBoxs?.map(nodeBox => nodeBox.drawLine())}
    </>
  }

  public render() {
    return <>
      {
        this.childrenNodeBoxs?.map(nodeBox => {
          return nodeBox.render()
        })
      }
    </>
  }
}

export { PipelineBox }