import React from 'react'
import ReactGridLayout, { Layout, ReactGridLayoutProps, ItemCallback } from "react-grid-layout";

interface GridLayoutPorps {
  items?: React.ReactElement[]
}

type ItemCallbackProps = {
  layout: Layout[],
  oldItem: Layout,
  newItem: Layout,
  placeholder: Layout,
  event: MouseEvent,
  element: HTMLElement,
}

const CustomReactGridLayout = (props: ReactGridLayoutProps) => <>{new ReactGridLayout(props).render()}</>

const layoutData = [
  { w: 2, h: 4, x: 4, y: 0, i: "0", moved: false, static: false },
  { w: 2, h: 5, x: 4, y: 4, i: "1", moved: false, static: false },
  { w: 2, h: 4, x: 6, y: 0, i: "2", moved: false, static: false },
  { w: 12, h: 3, x: 6, y: 4, i: "3", moved: false, type: 'tabs', static: false },
  // { w: 2, h: 5, x: 0, y: 0, i: "4", moved: false, static: false },
  // { w: 2, h: 5, x: 0, y: 5, i: "5", moved: false, static: false },
  // { w: 2, h: 5, x: 4, y: 16, i: "6", moved: false, static: false },
  // { w: 2, h: 5, x: 10, y: 0, i: "7", moved: false, static: false },
  // { w: 2, h: 2, x: 4, y: 9, i: "8", moved: false, static: false },
  // { w: 2, h: 3, x: 4, y: 13, i: "9", moved: false, static: false },
  // { w: 2, h: 2, x: 4, y: 11, i: "10", moved: false, static: false },
  // { w: 2, h: 5, x: 0, y: 10, i: "11", moved: false, static: false },
  // { w: 2, h: 4, x: 10, y: 5, i: "12", moved: false, static: false },
  // { w: 2, h: 5, x: 2, y: 0, i: "13", moved: false, static: false },
  // { w: 2, h: 4, x: 4, y: 24, i: "14", moved: false, static: false },
  // { w: 2, h: 2, x: 6, y: 7, i: "15", moved: false, static: false },
  // { w: 2, h: 3, x: 4, y: 21, i: "16", moved: false, static: false },
  // { w: 2, h: 3, x: 0, y: 15, i: "17", moved: false, static: false },
  // { w: 2, h: 2, x: 8, y: 0, i: "18", moved: false, static: false },
  // { w: 2, h: 5, x: 2, y: 9, i: "19", moved: false, static: false },
  // { w: 2, h: 4, x: 2, y: 5, i: "20", moved: false, static: false },
  // { w: 2, h: 5, x: 8, y: 2, i: "21", moved: false, static: false },
  // { w: 2, h: 5, x: 10, y: 9, i: "22", moved: false, static: false },
  // { w: 2, h: 4, x: 0, y: 20, i: "23", moved: false, static: false },
  // { w: 2, h: 2, x: 0, y: 18, i: "24", moved: false, static: false }
]

const subLayoutData = [
  { w: 2, h: 4, x: 4, y: 0, i: "s0", moved: false, static: false },
  { w: 2, h: 5, x: 4, y: 4, i: "s1", moved: false, static: false },
  { w: 2, h: 4, x: 6, y: 0, i: "s2", moved: false, static: false },
]

const GridLayout = React.forwardRef<any, GridLayoutPorps>((props, ref) => {
  const { items } = props
  const [layout, setLayout] = React.useState<Layout[]>(layoutData);
  const [subLayout, setSubLayout] = React.useState<Layout[]>(subLayoutData)

  return (
    <ReactGridLayout
      className="layout"
      layout={layout}
      onLayoutChange={(layout) => {
        console.log('%cindex.tsx line:48 layout', 'color: #007acc;', layout);
      }}
      onDrag={(
        layout: Layout[],
        oldItem: Layout,
        newItem: Layout,
        placeholder: Layout,
        event: MouseEvent,
        element: HTMLElement,
      ) => {
        console.log('%cindex.tsx line:73 oldItem', 'color: #007acc;', oldItem);
        const tabsDiv = window.document.querySelector('#tabs-components');
        if (!tabsDiv) return
        const transform = window.getComputedStyle(tabsDiv, null).getPropertyValue('transform')
        const transformData = transform.substring(7).split(',')
        const transformX = parseFloat(transformData[4])
        const transformY = parseFloat(transformData[5])
        const tlx = tabsDiv?.clientLeft + transformX
        const tly = tabsDiv?.clientTop + transformY
        const brx = tabsDiv?.clientLeft! + tabsDiv?.clientWidth! + transformX
        const bry = tabsDiv?.clientTop! + tabsDiv?.clientHeight! + transformY
        if (
          event.clientX > tlx
          && event.clientX < brx
          && event.clientY > tly
          && event.clientY < bry
        ) {
          console.log('入');
          setLayout(layout.map(item => ({...item, display: item.i !== oldItem.i})))
          // setSubLayout([...subLayout, oldItem])
        } else {
          console.log('出');
          // setLayout([...layout.filter(item => item !== oldItem)])
          // setSubLayout([...subLayout, oldItem])
        }
      }}
      cols={12}
      rowHeight={30}
      width={window.document.querySelector('#root')?.clientWidth}
      style={{ background: '#ccc', width: '100%' }}
    >
      {
        layout.map(item => {
          if (item.type === "tabs") {
            return <div key={item.i} id="tabs-components">
              <ReactGridLayout
                style={{ height: '100%', width: '100%' }}
                key={item.i}
                cols={12}
                rowHeight={30}
                layout={subLayout}
                width={1500}
                onDragStart={(...itemCallbackProps) => {
                  itemCallbackProps[4].stopPropagation()
                }}
                onLayoutChange={(layout) => {
                  console.log('%cindex.tsx line:48 layout', 'color: #007acc;', layout);
                }}
              >
                {
                  subLayout.map(subItem => {
                    return <div key={subItem.i}>{subItem.i}</div>
                  })
                }
              </ReactGridLayout>
            </div>
          } else {
            return <div key={item.i}>{item.i}</div>
          }
        })
      }
    </ReactGridLayout>
  )
})

export { GridLayout }