import React from 'react';

export default function Grid({ children, columns = "1fr 1fr", gap = "4", ...props }) {
    return (
      <div
        className={`grid grid-cols-${columns} gap-${gap} ${props.className}`}
        style={{ ...props.style }}
      >
        {children}
      </div>
    );
  }