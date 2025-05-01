/* eslint-disable react/prop-types */
import React from "react";

export default function Rectangle({
  x,
  y,
  width,
  height,
  fill,
  opacity = 1,
  stroke = "none",
  strokeWidth = 0,
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      opacity={opacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      rx={2}
      ry={2}
      style={{ cursor: "pointer" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}
