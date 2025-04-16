import React from "react";

export default function FilterControls({
  topics,
  clusters,
  selectedTopic,
  selectedCluster,
  onTopicChange,
  onClusterChange,
  onReset,
}) {
  return (
    <div
      className="filter-controls"
      style={{
        margin: "15px 0",
        display: "flex",
        gap: "20px",
        alignItems: "center",
      }}
    >
      <div>
        <label htmlFor="topic-filter" style={{ marginRight: 5 }}>
          Highlight Topic:
        </label>
        <select
          id="topic-filter"
          value={selectedTopic}
          onChange={(e) => onTopicChange(e.target.value)}
        >
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="cluster-filter" style={{ marginRight: 5 }}>
          Highlight Cluster:
        </label>
        <select
          id="cluster-filter"
          value={selectedCluster}
          onChange={(e) => onClusterChange(e.target.value)}
        >
          {clusters.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={onReset}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: 4,
          backgroundColor: "#f8f8f8",
          cursor: "pointer",
        }}
      >
        Reset Highlighting
      </button>
    </div>
  );
}
