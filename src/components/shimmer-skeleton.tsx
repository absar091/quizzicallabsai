'use client';

import { cn } from '@/lib/utils';

interface ShimmerSkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function ShimmerSkeleton({ className, children }: ShimmerSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700",
        "bg-[length:200%_100%] animate-shimmer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function QuizCardSkeleton() {
  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <ShimmerSkeleton className="h-6 w-3/4" />
      <div className="space-y-2">
        <ShimmerSkeleton className="h-4 w-full" />
        <ShimmerSkeleton className="h-4 w-5/6" />
        <ShimmerSkeleton className="h-4 w-4/6" />
      </div>
      <div className="flex space-x-2">
        <ShimmerSkeleton className="h-8 w-20" />
        <ShimmerSkeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <ShimmerSkeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-4 border rounded-lg space-y-3">
            <ShimmerSkeleton className="h-12 w-12 rounded-full" />
            <ShimmerSkeleton className="h-6 w-3/4" />
            <ShimmerSkeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}