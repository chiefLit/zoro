import React from 'react';
import styles from './index.module.less'
import { PointPosition } from '../../types'

export interface MoveStageProps {
  header: React.ReactNode;
  children?: React.ReactNode;
  sceneZoomPercentage: number
}

interface IMoveStageState {
  stageWidth: number;
  stageHeight: number;

  scenePositionX: number;
  scenePositionY: number;
  sceneZoomCenter: PointPosition;
  sceneZoomPercentage: number;
}

class MoveStage extends React.Component<MoveStageProps, any> {
  constructor(props: MoveStageProps) {
    super(props)
    this.state = {
      stageWidth: 0,
      stageHeight: 0,

      scenePositionX: 0,
      scenePositionY: 0,
      sceneZoomCenter: { x: 0, y: 0 },
      sceneZoomPercentage: this.props.sceneZoomPercentage,
    }
  }

  // 舞台
  private stageDomId = `stage_${Date.now().toString(36)}`;
  private stageDom?: HTMLElement;

  // 屏幕
  private sceneDomId = `scene_${Date.now().toString(36)}`;

  public componentDidMount() {
    this.stageDom = document.querySelector(`#${this.stageDomId}`) as HTMLElement;
    this.setState({
      stageWidth: this.stageDom.getBoundingClientRect().width,
      stageHeight: this.stageDom.getBoundingClientRect().height,
    })

    this.stageDom.addEventListener('wheel', this.stageEvents.bindWheel)
    this.stageDom.addEventListener('mousedown', this.stageEvents.bindMouseDown)
    this.stageDom.addEventListener('mouseup', this.stageEvents.bindMouseUp)
    this.stageDom.addEventListener('mouseleave', this.stageEvents.bindMouseUp)
  }

  componentDidUpdate() {
    if (this.props.sceneZoomPercentage !== this.state.sceneZoomPercentage) {
      this.setState({ sceneZoomPercentage: this.props.sceneZoomPercentage })
    }
    // this.childRef.current?.setAttribute('style', `
    //   left: ${this.state.scenePositionX};
    //   top: ${this.state.scenePositionY};
    //   margin: 0 0 0 ${this.state.stageWidth / 2}px;
    //   transform: translate(-${this.state.sceneZoomPercentage * 0.5}%, 64px) scale(${this.state.sceneZoomPercentage / 100});
    //   transformOrigin: ${this.state.sceneZoomCenter.x}px ${this.state.sceneZoomCenter.y}px;
    // `)
  }

  public resetStage = () => {
    // this.setState({
    //   scenePositionX: 0,
    //   scenePositionY: 0,
    //   sceneZoomPercentage: 100,
    // })
    this.setScenePosition({ x: 0, y: 0 })
    if (this.stageDom) {
      this.stageDom.addEventListener('wheel', this.stageEvents.bindWheel)
      this.stageDom.addEventListener('mousedown', this.stageEvents.bindMouseDown)
      this.stageDom.addEventListener('mouseup', this.stageEvents.bindMouseUp)
      this.stageDom.addEventListener('mouseleave', this.stageEvents.bindMouseUp)
    }
  }

  private stageEvents = {
    // 临时记录场景定位[mouseup或者mouseleave时才会更新move变化]
    scenePositionX: 0,
    scenePositionY: 0,
    // mousedown定位
    mouseDownPositionX: 0,
    mouseDownPositionY: 0,

    bindWheel: (e: WheelEvent) => {
      e.preventDefault();
      // 还有一个神奇的判断判断是双指缩放还是移动
      const t = (e as any).wheelDeltaY ? (e as any).wheelDeltaY === -3 * e.deltaY : 0 === e.deltaMode;
      if (t) {
        // 计算方式：获取滚动时每一个step的delta值（左下为负值）去定位scene的position
        this.stageEvents.scenePositionX -= e.deltaX;
        this.stageEvents.scenePositionY -= e.deltaY;
        const positionX = Number(this.getScenePosition().scenePositionX?.slice(0, this.getScenePosition().scenePositionX?.length! - 2));
        const positionY = Number(this.getScenePosition().scenePositionY?.slice(0, this.getScenePosition().scenePositionY?.length! - 2));
        const scenePositionX = positionX - e.deltaX;
        const scenePositionY = positionY - e.deltaY;
        // this.setState({ scenePositionX, scenePositionY })
        this.setScenePosition({ x: scenePositionX, y: scenePositionY })
      } else {
        // 效果不理想
        return
        if (
          (e.deltaY >= 0 && this.state.sceneZoomPercentage < 50)
          || (e.deltaY < 0 && this.state.sceneZoomPercentage > 200)
        ) return
        const sceneZoomPercentage = e.deltaY < 0 ? (this.state.sceneZoomPercentage + 10) : (this.state.sceneZoomPercentage - 10)
        this.setState({ sceneZoomPercentage })
      }
    },

    bindMouseDown: (e: MouseEvent) => {
      e.stopPropagation()
      this.stageEvents.mouseDownPositionX = e.x
      this.stageEvents.mouseDownPositionY = e.y
      this.stageDom?.addEventListener('mousemove', this.stageEvents.bindMouseMove as EventListenerOrEventListenerObject)
    },

    bindMouseMove: (e: MouseEvent) => {
      e.stopPropagation()
      // 这是过程的delta，并非想wheel事件中按每个step来的，所以一次性操作，mouseup时再去记录。
      const deltaX = this.stageEvents.mouseDownPositionX - e.x
      const deltaY = this.stageEvents.mouseDownPositionY - e.y
      const scenePositionX = this.stageEvents.scenePositionX - deltaX
      const scenePositionY = this.stageEvents.scenePositionY - deltaY
      // this.setState({ scenePositionX, scenePositionY })
      this.setScenePosition({ x: scenePositionX, y: scenePositionY })
    },

    bindMouseUp: (e: MouseEvent) => {
      e.stopPropagation()
      // this.stageEvents.scenePositionX = this.state.scenePositionX
      // this.stageEvents.scenePositionY = this.state.scenePositionY
      this.stageEvents.scenePositionX = Number(this.getScenePosition().scenePositionX?.slice(0, this.getScenePosition().scenePositionX?.length! - 2));
      this.stageEvents.scenePositionY = Number(this.getScenePosition().scenePositionY?.slice(0, this.getScenePosition().scenePositionY?.length! - 2));
      this.stageDom?.removeEventListener('mousemove', this.stageEvents.bindMouseMove as EventListenerOrEventListenerObject)
    }
  }

  private sceneRef = React.createRef<HTMLDivElement>()

  private setScenePosition = ({ x, y }: { x: number; y: number }) => {
    if (this.sceneRef.current) {
      this.sceneRef.current.style.left = `${x}px`;
      this.sceneRef.current.style.top = `${y}px`;
    }
  }

  private getScenePosition = () => {
    return {
      scenePositionX: this.sceneRef.current?.style.left,
      scenePositionY: this.sceneRef.current?.style.top
    }
  }

  public render() {
    console.log('%cindex.tsx line:140 2312', 'color: #007acc;', 2312);
    return (
      <div className={styles.stageWrapper} id={this.stageDomId}>
        <header>{this.props.header}</header>
        <div ref={this.sceneRef} className={styles.sceneContainer} id={this.sceneDomId} style={{
          // left: this.state.scenePositionX,
          // top: this.state.scenePositionY,
          margin: `0 0 0 ${this.state.stageWidth / 2}px`,
          transform: `translate(-${this.state.sceneZoomPercentage * 0.5}%, 64px) 
            scale(${this.state.sceneZoomPercentage / 100})`,
          transformOrigin: `${this.state.sceneZoomCenter.x}px ${this.state.sceneZoomCenter.y}px`
        }} >
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default MoveStage