import React from 'react'
import { PointPosition } from "../../types"

const Point = ({ x, y }: PointPosition) => {
  return <div style={{
    width: '3px',
    height: '3px',
    position: 'absolute',
    left: x + 'px',
    top: y + 'px',
    background: 'black'
  }}></div>
}

export { Point }