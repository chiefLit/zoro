import React from 'react'
import { Button, message, Divider, Popover } from 'antd'
import styles from './index.module.less'
import { FullscreenExitOutlined, FullscreenOutlined, UndoOutlined, RedoOutlined, ColumnWidthOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { GlobalContext } from '../../context'

interface ToolbarProps { }

/**
 * 顶部工具栏
 * @param props 
 * @returns 
 */
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { } = props;
  const [fullscreened, setFullscreened] = React.useState(false);
  const { moveStageRef, sceneZoom, sceneZoomRef } = GlobalContext.useContainer();
  console.log('%cindex.tsx line:18 moveStageRef.current', 'color: #007acc;', moveStageRef.current);

  React.useEffect(() => {
    const left = document.querySelector('#_toolbar_left')
    left?.addEventListener('mousedown', e => e.stopPropagation())
    left?.addEventListener('wheel', e => e.stopPropagation())
  }, [])

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullscreened(false)
    }
  }

  const launchFullscreen = () => {
    const element = document.querySelector(`#${moveStageRef.current?.stageDomId}`)!
    if (element.requestFullscreen) {
      element.requestFullscreen();
      setFullscreened(true)
    } else {
      message.error('找不到主节点')
    }
  }

  return (
    <div className={styles.toolbarWrapper}>
      <div className={styles.left} id='_toolbar_left'>
        <div className={styles.item}>大叔大婶</div>
        <div className={styles.item}>
          <UndoOutlined />
          <Divider type='vertical' />
          <RedoOutlined />
        </div>
        <div className={styles.item}>
          <Popover content='复位'>
            <ColumnWidthOutlined onClick={() => moveStageRef.current?.reset()} />
          </Popover>
          <Divider type='vertical' />
          <PlusOutlined />
          <MinusOutlined />
          <span>{moveStageRef.current?.sceneZoom}%</span>
          <span>{sceneZoom?.centerX}</span>
          <span>{sceneZoomRef?.current.value}</span>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.item} onClick={fullscreened ? exitFullscreen : launchFullscreen}>
          {fullscreened ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        </div>
      </div>
    </div>
  );
}

export { Toolbar };