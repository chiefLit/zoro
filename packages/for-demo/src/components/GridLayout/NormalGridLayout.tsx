import React from 'react'
import _ from 'lodash';
import ReactGridLayout, { Layout, ReactGridLayoutProps, ItemCallback } from "react-grid-layout";
import { WidthProvider, Responsive } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface GridLayoutPorps {
  items?: {
    layout: Layout[]
  }
}

type ItemCallbackProps = {
  layout: Layout[],
  oldItem: Layout,
  newItem: Layout,
  placeholder: Layout,
  event: MouseEvent,
  element: HTMLElement,
}

const customItems = [
  { w: 2, h: 2, x: 0, y: 0, i: "10" },
  { w: 2, h: 2, x: 2, y: 0, i: "11" },
  { w: 2, h: 2, x: 4, y: 0, i: "12" },
]
const GridLayout = React.forwardRef<any, GridLayoutPorps>((props, ref) => {
  const { items: propsItems } = props
  const [items, setItems] = React.useState<Layout[]>(customItems)

  const handleLayoutChange = () => { }

  const handleBreakpointChange = () => { }

  const handleOver = (...arg) => {
    console.log(arg)
  }

  return (
    <ResponsiveReactGridLayout
      onLayoutChange={handleLayoutChange}
      onBreakpointChange={handleBreakpointChange}
      onDrag={handleDrag}
      isDroppable={true}
    >
      {
        items.map((item) => {
          return (
            <div
              key={item.i}
              data-grid={item}
              onDragStart={e => e.dataTransfer.setData("text/plain", "")}
              draggable={true}
            >
              <span className="text">{item.i}</span>
            </div>
          )
        })
      }
    </ResponsiveReactGridLayout>
  )
})

export { GridLayout }