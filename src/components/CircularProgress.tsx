"use client";

import React from "react";
import { cx } from "@/utils/cx";

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  color?: "blue" | "green" | "yellow" | "red" | "gray";
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 192, // 48 * 4 (h-48 = 192px)
  strokeWidth = 8,
  className,
  children,
  color = "blue",
}) => {
  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2 + 60; // Move center down more to hug the text better
  
  // For speedometer: much larger arc from bottom-left to bottom-right
  // Start angle: 180° (bottom-left), End angle: 360° (bottom-right)
  const startAngle = 180; // bottom-left (stretched much more)
  const endAngle = 360;   // bottom-right (stretched much more)
  const totalAngle = endAngle - startAngle; // 180 degrees (semi-circle)
  
  // Calculate current angle based on percentage
  const currentAngle = startAngle + (percentage / 100) * totalAngle;
  
  // Convert angles to radians
  const startAngleRad = (startAngle * Math.PI) / 180;
  const currentAngleRad = (currentAngle * Math.PI) / 180;
  
  // Calculate arc path
  const createArcPath = (startRad: number, endRad: number) => {
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const largeArcFlag = endRad - startRad <= Math.PI ? "0" : "1";
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };
  
  // Color mapping
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-500",
    red: "text-red-600",
    gray: "text-gray-600",
  };

  return (
    <div className={cx("relative flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background arc (speedometer track) */}
        <path
          d={createArcPath(startAngleRad, (endAngle * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* Progress arc */}
        <path
          d={createArcPath(startAngleRad, currentAngleRad)}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={cx(
            colorClasses[color],
            "transition-all duration-1000 ease-in-out"
          )}
        />
      </svg>
      {/* Content in the center */}
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};
