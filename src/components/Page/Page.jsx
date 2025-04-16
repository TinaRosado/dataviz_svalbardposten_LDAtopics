// src/components/Page/Page.jsx
import React, { useMemo, useState } from "react";
import SortControls from "../Sort-Controls/Sort-Controls";
import FilterControls from "../Filter-Controls/Filter-Controls";
import Chart from "../Chart/Chart";

export default function Page({ data, width = 1200, height = 4000 }) {
  const [sortMethod, setSortMethod] = useState("monthly");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedCluster, setSelectedCluster] = useState("All Clusters");

  // build the dropdown options
  const topics = useMemo(
    () =>
      [
        "All Topics",
        ...new Set(data.map((d) => d.dominant_topic_label)),
      ].sort(),
    [data]
  );
  const clusters = useMemo(
    () =>
      ["All Clusters", ...new Set(data.map((d) => d.dominant_cluster))].sort(),
    [data]
  );

  const handleReset = () => {
    setSelectedTopic("All Topics");
    setSelectedCluster("All Clusters");
  };

  return (
    <div style={{ position: "relative" }}>
      <h1 className="text-2xl font-bold mb-2">
        Svalbardposten’s Born‑Digital Archive
      </h1>
      <p className="text-md text-gray-600 mb-2">
        This project aims to make accessible the daily news articles published
        in the <a href="https://svalbardposten.no">Svalbardposten’s website</a>.
      </p>
      <p className="text-md text-gray-600 mb-4">
        Arranged Monthly (2006‑2024) <b>+</b>{" "}
        <span style={{ color: "red" }}>Sorted</span> by Article Word Count
        (monthly, weekly, daily)
      </p>

      <FilterControls
        topics={topics}
        clusters={clusters}
        selectedTopic={selectedTopic}
        selectedCluster={selectedCluster}
        onTopicChange={(t) => {
          setSelectedTopic(t);
          if (t !== "All Topics") setSelectedCluster("All Clusters");
        }}
        onClusterChange={(c) => {
          setSelectedCluster(c);
          if (c !== "All Clusters") setSelectedTopic("All Topics");
        }}
        onReset={handleReset}
      />

      <SortControls
        methods={["monthly", "weekly", "daily"]}
        current={sortMethod}
        onChange={setSortMethod}
      />

      <Chart
        data={data}
        width={width}
        height={height}
        sortMethod={sortMethod}
        selectedTopic={selectedTopic}
        selectedCluster={selectedCluster}
      />
    </div>
  );
}
