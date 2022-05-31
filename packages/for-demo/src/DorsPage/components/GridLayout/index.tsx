import React from 'react'
import _ from 'lodash';
import { WidthProvider, Responsive } from "react-grid-layout";
import type { Layout } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

type CustomLayout = Layout & {
  component?: string
}

interface GridLayoutPorps {
  layouts: CustomLayout[];
}

const customItems = [
  { w: 2, h: 2, x: 0, y: 0, i: "10" },
  { w: 2, h: 2, x: 2, y: 0, i: "11" },
  { w: 2, h: 2, x: 4, y: 0, i: "12" },
]

const GridLayout = React.forwardRef<any, GridLayoutPorps>((props, ref) => {
  const { layouts: propsLayouts } = props
  const [items, setItems] = React.useState<CustomLayout[]>(propsLayouts!)

  return (
    <ResponsiveReactGridLayout
      // onLayoutChange={handleLayoutChange}
      // onBreakpointChange={handleBreakpointChange}
      // onDrag={handleDrag}
      // isDroppable={true}
      droppingItem={{ w: 2, h: 2, i: "10" }}
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