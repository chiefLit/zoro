import React from 'react';
import styles from './index.module.less'

export interface MoveStageProps {
  header: React.ReactNode;
  children?: React.ReactNode;
}

export interface MoveStageInstance {
  stageDomId: string;
  sceneDomId: string;
  reset: () => void;
  sceneZoom: { centerX: number; centerY: number; value: number };
  getSceneZoom: () => number;
  sceneZoomRef: React.MutableRefObject<{
    centerX: number;
    centerY: number;
    value: number;
  }>
}

/**
 * 移动舞台
 * 滚轮移动和鼠标移动
 */
const MoveStage = React.forwardRef<MoveStageInstance, MoveStageProps>((props, ref) => {
  const { header, children } = props;
  const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0)
  // 唯一标识
  const [stageDomId] = React.useState(`stage_${Date.now().toString(36)}`);
  const [sceneDomId] = React.useState(`scene_${Date.now().toString(36)}`);
  const [stagewh, setStagewh] = React.useState<number[]>();
  const stageDomRef = React.useRef<HTMLElement>(document.querySelector(`#${stageDomId}`) as HTMLElement)
  // 场景定位
  const scenePositionRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const sceneZoomRef = React.useRef<{ centerX: number; centerY: number; value: number }>({ centerX: 0, centerY: 0, value: 1 });

  React.useImperativeHandle(ref, () => ({
    stageDomId,
    sceneDomId,
    ...command,
    sceneZoomRef,
    sceneZoom: sceneZoomRef.current,
    getSceneZoom: () => {
      console.log('%cindex.tsx line:32 sceneZoomRef.current?.value', 'color: #007acc;', sceneZoomRef.current?.value);
      return Math.floor(sceneZoomRef.current?.value)
    }
  }))

  React.useEffect(() => {
    const stage = document.querySelector(`#${stageDomId}`) as HTMLElement;
    stageDomRef.current = stage
    const stageWidth = stage.getBoundingClientRect().width;
    const stageHeight = stage.getBoundingClientRect().height;
    setStagewh([stageWidth, stageHeight])
    stage.addEventListener('wheel', stageEvents.bindWheel)
    stage.addEventListener('mousedown', stageEvents.bindMouseDown)
    stage.addEventListener('mouseup', stageEvents.bindMouseUp)
    stage.addEventListener('mouseleave', stageEvents.bindMouseUp)
  }, [])

  /**
   * 命令
   */
  const command = {
    zoomPlus: () => {
      sceneZoomRef.current.value
    },
    zoomMinus: () => { },
    reset: () => {
      scenePositionRef.current = { x: 0, y: 0 }
      sceneZoomRef.current = { centerX: 0, centerY: 0, value: 1 }
      stageDomRef.current.addEventListener('wheel', stageEvents.bindWheel)
      stageDomRef.current.addEventListener('mousedown', stageEvents.bindMouseDown)
      stageDomRef.current.addEventListener('mouseup', stageEvents.bindMouseUp)
      stageDomRef.current.addEventListener('mouseleave', stageEvents.bindMouseUp)
      forceUpdate()
    }
  }

  /**
   * 舞台事件
   */
  const stageEvents = {
    // 场景定位[mouseup时才会更新move变化] 区别于 scenePositionRef.current[实时用于渲染]。
    scenePosition: { x: 0, y: 0 },
    // mousedown定位
    mouseDownPosition: { x: 0, y: 0 },

    zoom: { centerX: 0, centerY: 0, value: 1 },

    bindWheel: (e: WheelEvent) => {
      e.preventDefault();
      // 还有一个神奇的判断判断是双指缩放还是移动
      const t = (e as any).wheelDeltaY ? (e as any).wheelDeltaY === -3 * e.deltaY : 0 === e.deltaMode;
      if (t) {
        // 计算方式：获取滚动时每一个step的delta值（左下为负值）去定位scene的position
        stageEvents.scenePosition.x -= e.deltaX;
        stageEvents.scenePosition.y -= e.deltaY;
        scenePositionRef.current = { x: stageEvents.scenePosition.x, y: stageEvents.scenePosition.y }
      } else {
        if (
          (e.deltaY >= 0 && stageEvents.zoom.value < 0.5)
          || (e.deltaY < 0 && stageEvents.zoom.value > 2)
        ) return
        stageEvents.zoom.value = e.deltaY < 0 ? (stageEvents.zoom.value + .1) : (stageEvents.zoom.value - .1)
        sceneZoomRef.current = stageEvents.zoom
      }
      forceUpdate()
    },

    bindMouseDown: (e: MouseEvent) => {
      e.stopPropagation()
      stageEvents.mouseDownPosition = { x: e.x, y: e.y }
      stageDomRef.current?.addEventListener('mousemove', stageEvents.bindMouseMove as EventListenerOrEventListenerObject)
    },

    bindMouseMove: (e: MouseEvent) => {
      e.stopPropagation()
      // 这是过程的delta，并非想wheel事件中按每个step来的，所以一次性操作，mouseup时再去记录。
      const deltaX = stageEvents.mouseDownPosition.x - e.x
      const deltaY = stageEvents.mouseDownPosition.y - e.y
      scenePositionRef.current = { x: stageEvents.scenePosition.x - deltaX, y: stageEvents.scenePosition.y - deltaY }
      forceUpdate()
    },

    bindMouseUp: (e: MouseEvent) => {
      e.stopPropagation()
      stageEvents.scenePosition = { x: scenePositionRef.current.x, y: scenePositionRef.current.y }
      stageDomRef.current?.removeEventListener('mousemove', stageEvents.bindMouseMove as EventListenerOrEventListenerObject)
    }
  }

  return (
    <div className={styles.stageWrapper} id={stageDomId}>
      <header>{header}</header>
      {
        stagewh
          ? <div className={styles.sceneContainer} id={sceneDomId} style={{
            left: scenePositionRef.current.x,
            top: scenePositionRef.current.y,
            margin: `0 0 0 ${stagewh[0] / 2}px`,
            transform: `translate(-${sceneZoomRef.current.value * 50}%, 64px) 
            scale(${sceneZoomRef.current.value})`,
            transformOrigin: `${sceneZoomRef.current.centerX}px ${sceneZoomRef.current.centerY}px`
          }} >
            {children}
          </div>
          : null
      }

    </div>
  )
})
export { MoveStage }