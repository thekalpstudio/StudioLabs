"use client";

import { useEffect, useState } from 'react';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className = '',
}: ProgressRingProps) {
  const [offset, setOffset] = useState(0);
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * circumference;
    setOffset(progressOffset);
  }, [progress, circumference]);

  return (
    <div className={className}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-muted stroke-current"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
        />
        <circle
          className="text-primary stroke-current transition-all duration-500 ease-in-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
        />
        <text
          x="50%"
          y="50%"
          className="text-sm font-medium"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="currentColor"
          transform={`rotate(90 ${center} ${center})`}
        >
          {Math.round(progress)}%
        </text>
      </svg>
    </div>
  );
}