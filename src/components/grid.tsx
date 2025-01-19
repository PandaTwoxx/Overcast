import React from 'react';

interface GridProps {
  children: React.ReactNode;
  columns?: string; // Or a more specific type if you have restrictions
  gap?: string; // Or a more specific type like number or a specific set of strings
  className?: string;
  style?: React.CSSProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow other props to be passed through
}

export default function Grid({ children, columns = "1fr 1fr", gap = "4", className, style, ...props }: GridProps) {
    return (
      <div
        className={`grid grid-cols-${columns} gap-${gap} ${className}`}
        style={style}
        {...props} // Spread any additional props
      >
        {children}
      </div>
    );
  }