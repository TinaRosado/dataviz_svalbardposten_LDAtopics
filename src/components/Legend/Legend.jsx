import React from "react";

export default function Legend({ title, x, y, items }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={-10} fontSize={12}>
        {title}
      </text>
      {items.map((item, i) => (
        <g key={i} transform={`translate(0, ${i * 25})`}>
          <rect
            x={0}
            y={0}
            width={item.width}
            height={item.height}
            fill={item.color}
            opacity={item.opacity ?? 1}
            rx={2}
            ry={2}
          />
          <text
            x={item.width + 8}
            y={(item.height || 15) / 2 + 4}
            fontSize={10}
          >
            {item.label}
          </text>
        </g>
      ))}
    </g>
  );
}
