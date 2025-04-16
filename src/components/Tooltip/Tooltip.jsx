import React from "react";
import styles from "./tooltip.module.css";

export default function Tooltip({ interactionData }) {
  if (!interactionData) return null;

  const { xPos, yPos, content } = interactionData;
  return (
    <div
      className={styles.tooltip}
      style={{
        left: xPos,
        top: yPos,
      }}
    >
      {content}
    </div>
  );
}
