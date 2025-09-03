'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  color?: string;
}

export function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  className,
  children,
  color = "stroke-blue-500"
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          className={color}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (
          <span className="text-xl font-bold">
            {Math.round(progress)}%
          </span>
        )}
      </div>
    </div>
  );
}

export function ScoreRing({ score, total, className }: { 
  score: number; 
  total: number; 
  className?: string; 
}) {
  const percentage = (score / total) * 100;
  const getColor = () => {
    if (percentage >= 80) return "stroke-green-500";
    if (percentage >= 60) return "stroke-yellow-500";
    return "stroke-red-500";
  };

  return (
    <ProgressRing 
      progress={percentage} 
      color={getColor()}
      className={className}
    >
      <div className="text-center">
        <div className="text-2xl font-bold">{score}</div>
        <div className="text-sm text-muted-foreground">/{total}</div>
      </div>
    </ProgressRing>
  );
}