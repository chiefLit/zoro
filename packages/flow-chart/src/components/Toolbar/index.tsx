import React from 'react'
import { Button, message, Divider, Popover } from 'antd'
import { FullscreenExitOutlined, FullscreenOutlined, UndoOutlined, RedoOutlined, ColumnWidthOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import useGlobalModel from '../../context'
import styles from './index.module.less'

interface ToolbarProps { }

/**
 * 顶部工具栏
 * @param props 
 * @returns 
 */
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { } = props;
  const [fullscreened, setFullscreened] = React.useState(false);
  const { sceneZoomPercentage, setSceneZoomPercentage, stageDomId } = useGlobalModel()

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
    const element = document.querySelector(`#${stageDomId}`)!
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
        <div className={styles.item}>新流程图</div>
        <div className={styles.item}>
          <UndoOutlined />
          <Divider type='vertical' />
          <RedoOutlined />
        </div>
        <div className={styles.item}>
          <Popover content='复位'>
            <ColumnWidthOutlined onClick={() => { }} />
          </Popover>
          <Divider type='vertical' />
          <PlusOutlined onClick={() => setSceneZoomPercentage(sceneZoomPercentage + 10 > 200 ? 200 : sceneZoomPercentage + 10)} />
          <MinusOutlined onClick={() => setSceneZoomPercentage(sceneZoomPercentage - 10 < 50 ? 50 : sceneZoomPercentage - 10)} />
          <span>{Math.floor(sceneZoomPercentage)}%</span>
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