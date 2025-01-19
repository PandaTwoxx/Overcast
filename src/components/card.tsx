import React from 'react';

export default function Card ({ children, elevation = "md", className, ...props }) {
  const elevationClasses = {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl", // Need quotes for 2xl
    none: "shadow-none", // Option for no shadow
  };


  return (
    <div
      className={`bg-white rounded-lg overflow-hidden ${elevationClasses[elevation] || elevationClasses.md} ${className}`}
      {...props}  // Spread any additional props (like onClick)
    >
      {children}
    </div>
  );
};