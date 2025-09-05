'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'modern' | 'shimmer';
  lines?: number;
}

export function Skeleton({ className, variant = 'default', lines = 1 }: SkeletonProps) {
  if (lines === 1) {
    return (
      <div
        className={cn(
          'skeleton',
          {
            'skeleton': variant === 'default',
            'bg-white/50 backdrop-blur-sm rounded-xl': variant === 'modern',
            'shimmer rounded-lg': variant === 'shimmer',
          },
          className
        )}
      />
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'skeleton h-4',
            {
              'skeleton': variant === 'default',
              'bg-white/50 backdrop-blur-sm rounded-xl': variant === 'modern',
              'shimmer rounded-lg': variant === 'shimmer',
            },
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full', // Last line shorter
            className
          )}
        />
      ))}
    </div>
  );
}

interface LoadingCardProps {
  className?: string;
  title?: boolean;
  content?: boolean;
  avatar?: boolean;
}

export function LoadingCard({ className, title = true, content = true, avatar = false }: LoadingCardProps) {
  return (
    <div className={cn('card-modern p-6', className)}>
      {avatar && (
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton className="h-12 w-12 rounded-full" variant="modern" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" variant="modern" />
            <Skeleton className="h-3 w-24" variant="modern" />
          </div>
        </div>
      )}

      {title && <Skeleton className="h-6 w-3/4 mb-4" variant="modern" />}

      {content && (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" variant="modern" />
          <Skeleton className="h-4 w-5/6" variant="modern" />
          <Skeleton className="h-4 w-4/6" variant="modern" />
        </div>
      )}
    </div>
  );
}

interface LoadingGridProps {
  count?: number;
  className?: string;
}

export function LoadingGrid({ count = 6, className }: LoadingGridProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}

interface LoadingTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function LoadingTable({ rows = 5, columns = 4, className }: LoadingTableProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex space-x-4 pb-4 border-b border-border/50">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" variant="modern" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className="h-4 flex-1"
              variant="modern"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface LoadingChartProps {
  className?: string;
}

export function LoadingChart({ className }: LoadingChartProps) {
  return (
    <div className={cn('card-modern', className)}>
      <div className="p-6">
        <Skeleton className="h-6 w-48 mb-6" variant="modern" />
        <div className="space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" variant="modern" />
            <Skeleton className="h-4 w-16" variant="modern" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" variant="modern" />
          <div className="flex justify-center space-x-8">
            <Skeleton className="h-3 w-12" variant="modern" />
            <Skeleton className="h-3 w-12" variant="modern" />
            <Skeleton className="h-3 w-12" variant="modern" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface LoadingFormProps {
  fields?: number;
  className?: string;
}

export function LoadingForm({ fields = 4, className }: LoadingFormProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" variant="modern" />
          <Skeleton className="h-12 w-full" variant="modern" />
        </div>
      ))}
      <div className="flex space-x-4 pt-4">
        <Skeleton className="h-12 w-24" variant="modern" />
        <Skeleton className="h-12 w-20" variant="modern" />
      </div>
    </div>
  );
}
