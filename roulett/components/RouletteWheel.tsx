'use client';

import React, { useEffect, useRef } from 'react';

interface RouletteWheelProps {
  spinning: boolean;
  number?: number;
  onSpinComplete?: () => void;
}

const NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

export function RouletteWheel({ spinning, number, onSpinComplete }: RouletteWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    const drawWheel = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw wheel segments
      NUMBERS.forEach((num, i) => {
        const startAngle = (i * 2 * Math.PI) / NUMBERS.length;
        const endAngle = ((i + 1) * 2 * Math.PI) / NUMBERS.length;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        // Color based on number
        ctx.fillStyle = num === 0 ? '#008000' : num % 2 === 0 ? '#FF0000' : '#000000';
        ctx.fill();
        ctx.stroke();

        // Draw numbers
        ctx.save();
        ctx.translate(
          centerX + (radius * 0.85 * Math.cos(startAngle + Math.PI / NUMBERS.length)),
          centerY + (radius * 0.85 * Math.sin(startAngle + Math.PI / NUMBERS.length))
        );
        ctx.rotate(startAngle + Math.PI / NUMBERS.length + Math.PI / 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(num.toString(), 0, 0);
        ctx.restore();
      });
    };

    drawWheel();
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className={`${spinning ? 'animate-spin' : ''} rounded-full border-4 border-gray-800`}
      />
      {number !== undefined && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-full shadow-lg">
          <span className="text-2xl font-bold">{number}</span>
        </div>
      )}
    </div>
  );
}