// src/components/Chart/Chart.jsx
import React, { useMemo, useState } from "react";
import {
  sortMonthly,
  sortWeekly,
  sortDaily,
} from "../../utils/sorting-functions";
import {
  createTimeScale,
  createRankScale,
  createSizeScales,
} from "../../utils/data-scales";
import Rectangle from "../Rectangle/Rectangle";
import Tooltip from "../Tooltip/Tooltip";
import InteractiveLegend from "../Interactive-Legend/Interactive-Legend";
import { range as d3Range } from "d3";

export default function Chart({
  data,
  width = 1200,
  height = 4000,
  sortMethod,
  selectedTopic,
  selectedCluster,
}) {
  const margin = { top: 40, right: 80, bottom: 20, left: 100 };
  const [hoverInfo, setHoverInfo] = useState(null);

  // 1) preprocess
  const processed = useMemo(
    () =>
      data
        .map((d) => ({ ...d, dateObj: new Date(d.published) }))
        .filter((d) => d.dateObj.getFullYear() >= 2006 && d.word_count > 0),
    [data]
  );

  // 2) sort
  const sorted = useMemo(() => {
    switch (sortMethod) {
      case "weekly":
        return sortWeekly(processed);
      case "daily":
        return sortDaily(processed);
      default:
        return sortMonthly(processed);
    }
  }, [processed, sortMethod]);

  // 3) month‑years
  const monthYears = useMemo(() => {
    const s = new Set(
      processed.map(
        (d) =>
          `${d.dateObj.getFullYear()}-${String(
            d.dateObj.getMonth() + 1
          ).padStart(2, "0")}`
      )
    );
    return Array.from(s).sort();
  }, [processed]);

  // 4) scales
  const timeScale = useMemo(
    () => createTimeScale(monthYears, { marginTop: margin.top, height }),
    [monthYears]
  );
  const rankScale = useMemo(
    () => createRankScale(sorted, { marginLeft: margin.left, width }),
    [sorted]
  );
  const { widthScale, heightScale } = useMemo(
    () => createSizeScales(processed),
    [processed]
  );

  // x‑axis ticks every 60
  const maxRank = Math.max(...sorted.map((d) => d.sequentialRank), 60);
  const xTicks = d3Range(60, maxRank + 1, 60);

  // tooltip handlers
  function handleMouseEnter(d, e) {
    if (hoverInfo?.id === d.id) return;
    setHoverInfo({
      xPos: e.pageX + 10,
      yPos: e.pageY - 10,
      id: d.id,
      content: (
        <>
          <b>{d.title}</b>
          <br />
          <b>Topic:</b> {d.dominant_topic_label}
          <br />
          <b>Cluster:</b> {d.dominant_cluster}
          <br />
          <b>Date:</b>{" "}
          {d.dateObj.toLocaleDateString(undefined, {
            month: "numeric",
            day: "numeric",
            year: "numeric",
          })}
          <br />
          <b>Words:</b> {d.word_count}
        </>
      ),
    });
  }
  function handleMouseLeave() {
    setHoverInfo(null);
  }

  // multipliers
  const multiWidth = 0.005;
  const multiHeight = 4;

  return (
    <>
      <svg width={width} height={height} className="bg-white">
        {/* y‑axis labels */}
        {monthYears.map((ym) => {
          const [yr, mo] = ym.split("-");
          if (mo === "01") {
            return (
              <text
                key={ym}
                x={margin.left - 10}
                y={timeScale(ym)}
                textAnchor="end"
                fontSize={12}
              >
                {new Date(+yr, 0).toLocaleString("default", {
                  month: "short",
                  year: "numeric",
                })}
              </text>
            );
          }
          return null;
        })}

        {/* grid lines & x‑ticks */}
        {xTicks.map((t) => (
          <g key={t}>
            <line
              x1={rankScale(t)}
              x2={rankScale(t)}
              y1={margin.top}
              y2={height - margin.bottom}
              stroke="#ccc"
              strokeWidth={0.5}
            />
            <text
              x={rankScale(t)}
              y={margin.top - 6}
              textAnchor="middle"
              fontSize={10}
            >
              Article {t}
            </text>
          </g>
        ))}

        {/* rectangles */}
        {sorted.map((d) => {
          const ym = `${d.dateObj.getFullYear()}-${String(
            d.dateObj.getMonth() + 1
          ).padStart(2, "0")}`;

          const isSelected =
            (selectedTopic !== "All Topics" &&
              d.dominant_topic_label === selectedTopic) ||
            (selectedCluster !== "All Clusters" &&
              d.dominant_cluster === selectedCluster);

          return (
            <Rectangle
              key={d.id}
              x={rankScale(d.sequentialRank)}
              y={timeScale(ym)}
              width={widthScale(d.word_count * multiWidth)}
              height={heightScale(d.word_count * multiHeight)}
              fill={isSelected ? "red" : "black"}
              stroke={
                hoverInfo?.id === d.id ? (isSelected ? "red" : "black") : "none"
              }
              strokeWidth={hoverInfo?.id === d.id ? 2 : 0}
              onMouseEnter={(e) => handleMouseEnter(d, e)}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}
        <InteractiveLegend
          processed={processed}
          selectedTopic={selectedTopic}
          selectedCluster={selectedCluster}
          width={width}
          margin={margin}
          widthScale={widthScale}
          heightScale={heightScale}
          multiWidth={multiWidth}
          multiHeight={multiHeight}
        />
      </svg>

      {/* Tooltip */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width,
          height,
          pointerEvents: "none",
        }}
      >
        <Tooltip interactionData={hoverInfo} />
      </div>
    </>
  );
}
