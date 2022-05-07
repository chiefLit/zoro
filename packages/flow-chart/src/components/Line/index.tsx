import React from "react";

interface PointPosition { x: number; y: number }
interface LineProps {
  /**
   * 起点
   */
  start: PointPosition;
  /**
   * 终点
   */
  end: PointPosition;
  /**
   * 拐点靠近
   */
  inflection?: 'start' | 'end'
  /**
   * 箭头结尾
   */
  endArrow?: boolean
}

/**
 * 划svg线，起点终点
 * 拐点贴近起点/终点
 */
const DrawLine: React.FC<LineProps> = (props: LineProps) => {
  const { start, end, endArrow } = props;
  const width = Math.abs(end.x - start.x) + 4;
  const height = Math.abs(end.y - start.y) + 3;
  // const inflectionY = inflection === 'start' ? start.y + 20 : end.y - 20
  const points = `
    ${start.x},${start.y}
    ${end.x},${end.y}
  `
  // const points = `
  //   ${start.x},${start.y}
  //   ${start.x},${inflectionY}
  //   ${end.x},${inflectionY}
  //   ${end.x},${end.y}
  // `
  return (
    <>
      <defs>
        <marker id="Triangle" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" />
        </marker>
      </defs>
      <polyline points={points} fill="none" stroke="black" strokeWidth="1" markerEnd={endArrow ? `url(#Triangle)` : ''} />
    </>
  )
}

export { DrawLine }