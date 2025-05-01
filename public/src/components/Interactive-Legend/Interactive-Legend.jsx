// src/components/Chart/Legends.jsx
import React from "react";
import Legend from "../Legend/Legend";

export default function InteractiveLegend({
  processed,
  selectedTopic,
  selectedCluster,
  width,
  margin,
  widthScale,
  heightScale,
  multiWidth,
  multiHeight,
}) {
  const counts = processed.map((d) => d.word_count);
  const min = Math.min(...counts);
  const mean = Math.round(counts.reduce((a, b) => a + b, 0) / counts.length);
  const max = Math.max(...counts);

  const wordCountItems = [
    {
      width: widthScale(min * multiWidth),
      height: heightScale(min * multiHeight),
      label: `${min} words`,
      color: "black",
    },
    {
      width: widthScale(mean * multiWidth),
      height: heightScale(mean * multiHeight),
      label: `Mean words`,
      color: "black",
    },
    {
      width: widthScale(max * multiWidth),
      height: heightScale(max * multiHeight),
      label: `${max} words`,
      color: "black",
    },
  ];

  const selectionItems = [
    {
      width: 15,
      height: 15,
      label: selectedTopic !== "All Topics" ? selectedTopic : selectedCluster,
      color: "red",
    },
    {
      width: 15,
      height: 15,
      label: "Other articles",
      color: "black",
      opacity: 0.5,
    },
  ];

  return (
    <>
      <Legend
        title="Word Count Legend"
        x={width - margin.right - 200}
        y={margin.top + 60}
        items={wordCountItems}
      />
      {(selectedTopic !== "All Topics" ||
        selectedCluster !== "All Clusters") && (
        <Legend
          title="Selection Legend"
          x={width - margin.right - 200}
          y={margin.top + 160}
          items={selectionItems}
        />
      )}
    </>
  );
}
