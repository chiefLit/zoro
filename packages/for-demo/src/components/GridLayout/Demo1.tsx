import React, { Dispatch, SetStateAction } from 'react'
import _ from 'lodash';
import ReactGridLayout, { Layout, ReactGridLayoutProps, ItemCallback, DragOverEvent } from "react-grid-layout";
import { WidthProvider, Responsive } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface GridLayoutPorps {
  items?: React.ReactElement[]
}

const layoutData1 = [
  { w: 12, h: 2, x: 0, y: 0, i: "10", isDraggable: true, isResizable:false },
  { w: 1, h: 1, x: 2, y: 0, i: "11", move: true, isDraggable: true },
  { w: 1, h: 1, x: 4, y: 0, i: "12", type: 'tabs' },
]

const layoutData2 = [
  { w: 1, h: 1, x: 0, y: 0, i: "20" },
  { w: 1, h: 1, x: 2, y: 0, i: "21" },
  { w: 1, h: 1, x: 4, y: 0, i: "22" },
]

/**
 * 调试两个GridLayout之间的拖动
 */
const Demo1 = React.forwardRef<any, GridLayoutPorps>((props, ref) => {
  const [items1, setItems1] = React.useState<Layout[]>(layoutData1)
  const [items2, setItems2] = React.useState<Layout[]>(layoutData2)
  const [draggingItem, setDraggingItem] = React.useState<Layout>()
  const draggingItemRef = React.useRef<Layout>()

  const handleLayoutChange = () => { }
  const handleBreakpointChange = () => { }


  const handleEvent = {

    dragStart: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: DragEvent, element: HTMLElement) => {
      event.stopPropagation()
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
        event.dataTransfer.effectAllowed = 'move';
      }
      console.log('%cDemo1.tsx line:50 oldItem', 'color: #007acc;', oldItem);
      // console.log('%cDemo1.tsx line:50 newItem', 'color: #007acc;', newItem);
      // setDraggingItem(oldItem)
      draggingItemRef.current = oldItem
    },

    dragStop: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => {
      // let newLayoutItem = { ...oldItem, i: new Date().getTime().toString(36) }
      console.log('%cDemo1.tsx line:59 oldItem', 'color: #007acc;', oldItem);
      console.log('%cDemo1.tsx line:59 newItem', 'color: #007acc;', newItem);
      // console.log('%cDemo1.tsx line:68 draggingItemRef.current', 'color: #007acc;', draggingItemRef.current);
      // if (draggingItemRef.current) {
      //   newLayoutItem.i = draggingItemRef.current.i
      //   draggingItemRef.current = undefined
      // }
      // console.log('%cDemo1.tsx line:72 newLayoutItem', 'color: #007acc;', newLayoutItem);
      // setData([...data, newLayoutItem])
    },

    drop: (layout: Layout[], layoutItem: Layout, _event: Event, data: Layout[], setData: Dispatch<SetStateAction<Layout[]>>) => {
      let newLayoutItem = { ...layoutItem, i: new Date().getTime().toString(36) }
      console.log('%cDemo1.tsx line:70 draggingItemRef.current', 'color: #007acc;', draggingItemRef.current);
      // if (draggingItemRef.current) {
      //   newLayoutItem.i = draggingItemRef.current.i
      //   draggingItemRef.current = undefined
      // }
      setData([...data, newLayoutItem])
    },

    dropDragOver: (event: DragOverEvent) => {
      console.log('%cDemo1.tsx line:80 event', 'color: #007acc;', event);
      return { w: 1, h: 1 }
    }
  }

  const renderItem = (item: Layout) => {
    return (
      <div
        key={item.i}
        data-grid={item}
        // draggable={true}
        onDragStart={e => {
          e.dataTransfer.dropEffect = 'move';
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData("text/plain", '')
        }}
      >{
          item.i === '10'
            ? <ResponsiveReactGridLayout
              key={item.i}
              onLayoutChange={handleLayoutChange}
              onBreakpointChange={handleBreakpointChange}
              isDroppable={true}
              // isDragable={true}
              // droppingItem={{ w: 1, h: 1, i: "new" }}
              onDrop={(...props) => handleEvent.drop(...props, items2, setItems2)}
              onDragStart={handleEvent.dragStart}
            >
              {items2.map((item) => renderItem(item))}
            </ResponsiveReactGridLayout>
            : <span className="text">{item.i}</span>
        }

      </div>
    )
  }

  return (
    <>
      <div
        className="droppable-element"
        draggable={true}
        unselectable="on"
        style={{ width: '200px', height: '200px', background: '#ccc' }}
        onDragStart={e => e.dataTransfer.setData("text/plain", "")}
      >
        Droppable Element (Drag me!)
      </div>

      <ResponsiveReactGridLayout
        onLayoutChange={handleLayoutChange}
        onBreakpointChange={handleBreakpointChange}
        // isBounded={false}
        onDragStart={handleEvent.dragStart}
        onDragStop={handleEvent.dragStop}

        isDroppable={true}
        // droppingItem={{ w: 1, h: 1, i: "new" }}
        onDrop={(...props) => handleEvent.drop(...props, items1, setItems1)}
      // onDragStop={(...props) => handleEvent.dragStop(...props, items1, setItems1)}
      // onDropDragOver={handleEvent.dropDragOver}
      >
        {items1.map((item) => renderItem(item))}
      </ResponsiveReactGridLayout>
      --------
      <ResponsiveReactGridLayout
        onLayoutChange={handleLayoutChange}
        onBreakpointChange={handleBreakpointChange}
        // isDragable={true}
        onDragStart={handleEvent.dragStart}
        isDroppable={true}

        // droppingItem={{ w: 1, h: 1, i: "new" }}
        onDrop={(...props) => handleEvent.drop(...props, items2, setItems2)}
      >
        {items2.map((item) => renderItem(item))}
      </ResponsiveReactGridLayout>
    </>
  )
})

export { Demo1 }