import React from 'react';

export default function Card ({ children, elevation = "md", className, ...props }: {
  children: React.ReactNode;
  elevation?: "sm" | "md" | "lg" | "xl" | "2xl" | "none";
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow any other props
}) {
  const elevationClasses = {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
    none: "shadow-none",
  };


  return (
    <div
      className={`bg-white rounded-lg overflow-hidden ${elevationClasses[elevation] || elevationClasses.md} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};