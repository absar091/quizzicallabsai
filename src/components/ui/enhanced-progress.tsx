'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';

interface EnhancedProgressProps {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'animated' | 'steps';
  showValue?: boolean;
  className?: string;
  color?: 'primary' | 'accent' | 'success' | 'warning';
  animated?: boolean;
}

export function EnhancedProgress({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'default',
  showValue = false,
  className,
  color = 'primary',
  animated = false
}: EnhancedProgressProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(value);
    }
  }, [value, animated]);

  const percentage = Math.min((animatedValue / max) * 100, 100);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-2';
      case 'lg':
        return 'h-6';
      default:
        return 'h-4';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'accent':
        return 'bg-accent';
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gradient-to-r from-primary to-accent';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-primary/20 via-primary/40 to-accent/20';
      case 'animated':
        return 'bg-gradient-to-r from-primary/30 via-primary/50 to-accent/30 shimmer';
      case 'steps':
        return 'bg-muted/50';
      default:
        return 'bg-muted/50';
    }
  };

  if (variant === 'steps') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        {Array.from({ length: max }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'flex-1 h-2 rounded-full transition-all duration-300',
              index < Math.floor((animatedValue / max) * max)
                ? getColorClasses()
                : 'bg-muted/30'
            )}
          />
        ))}
        {showValue && (
          <span className="text-sm font-medium text-muted-foreground ml-2">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className={cn(
          'progress-modern overflow-hidden rounded-full',
          getSizeClasses(),
          getVariantClasses()
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            getColorClasses(),
            animated && 'transform scale-x-0 origin-left animate-pulse'
          )}
          style={{
            width: `${percentage}%`,
            transform: animated ? 'scaleX(1)' : undefined,
            transition: animated ? 'width 0.5s ease-out, transform 0.2s ease-out' : undefined
          }}
        />
      </div>

      {showValue && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
}

interface CircularProgressProps {
  value?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  className?: string;
  color?: 'primary' | 'accent' | 'success' | 'warning';
  animated?: boolean;
}

export function CircularProgress({
  value = 0,
  max = 100,
  size = 80,
  strokeWidth = 8,
  showValue = false,
  className,
  color = 'primary',
  animated = false
}: CircularProgressProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(value);
    }
  }, [value, animated]);

  const percentage = Math.min((animatedValue / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColorClasses = () => {
    switch (color) {
      case 'accent':
        return 'text-accent';
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted/20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(
            getColorClasses(),
            'transition-all duration-500 ease-out',
            animated && 'animate-pulse'
          )}
        />
      </svg>

      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}

interface StepProgressProps {
  steps: Array<{
    title: string;
    description?: string;
    completed?: boolean;
    current?: boolean;
  }>;
  className?: string;
}

export function StepProgress({ steps, className }: StepProgressProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-start space-x-4">
          {/* Step Indicator */}
          <div className="flex-shrink-0">
            {step.completed ? (
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            ) : step.current ? (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center pulse-glow">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {index + 1}
                </span>
              </div>
            )}
          </div>

          {/* Step Content */}
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              'text-sm font-medium',
              step.completed ? 'text-green-700' :
              step.current ? 'text-primary' : 'text-muted-foreground'
            )}>
              {step.title}
            </h4>
            {step.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {step.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'primary' | 'accent' | 'muted';
}

export function LoadingSpinner({
  size = 'md',
  className,
  color = 'primary'
}: LoadingSpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-8 h-8';
      default:
        return 'w-6 h-6';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'accent':
        return 'text-accent';
      case 'muted':
        return 'text-muted-foreground';
      default:
        return 'text-primary';
    }
  };

  return (
    <Loader2
      className={cn(
        'animate-spin',
        getSizeClasses(),
        getColorClasses(),
        className
      )}
    />
  );
}
