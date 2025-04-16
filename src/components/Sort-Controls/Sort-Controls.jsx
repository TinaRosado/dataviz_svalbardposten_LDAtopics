import React from "react";

export default function SortControls({ methods, current, onChange }) {
  return (
    <div style={{ display: "flex", gap: 20, marginTop: 30, marginBottom: 8 }}>
      {methods.map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          style={{
            background: "none",
            color: m === current ? "red" : "black",
            border: "none",
            cursor: "pointer",
            fontSize: "12px",
            outline: "none",
          }}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
