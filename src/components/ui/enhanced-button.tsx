'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './enhanced-progress';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        gradient: 'bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl hover:scale-105',
        glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg hover:bg-white/20 hover:shadow-xl',
        neon: 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-11 rounded-xl px-8',
        xl: 'h-12 rounded-2xl px-10 text-base',
        icon: 'h-10 w-10',
      },
      animation: {
        none: '',
        pulse: 'animate-pulse',
        bounce: 'hover:animate-bounce',
        glow: 'pulse-glow',
        scale: 'hover:scale-105 active:scale-95',
        slide: 'hover:translate-x-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'scale',
    },
  }
);

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({
    className,
    variant,
    size,
    animation,
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
  }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, animation }),
          loading && 'cursor-not-allowed',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <LoadingSpinner
            size="sm"
            className="mr-2"
            color={variant === 'glass' ? 'muted' : 'primary'}
          />
        )}

        {!loading && leftIcon && (
          <span className="mr-2 flex-shrink-0">
            {leftIcon}
          </span>
        )}

        <span className="flex items-center">
          {loading ? (loadingText || 'Loading...') : children}
        </span>

        {!loading && rightIcon && (
          <span className="ml-2 flex-shrink-0">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

// Preset button components for common use cases
export function PrimaryButton({ children, ...props }: EnhancedButtonProps) {
  return (
    <EnhancedButton variant="gradient" size="lg" {...props}>
      {children}
    </EnhancedButton>
  );
}

export function SecondaryButton({ children, ...props }: EnhancedButtonProps) {
  return (
    <EnhancedButton variant="secondary" {...props}>
      {children}
    </EnhancedButton>
  );
}

export function OutlineButton({ children, ...props }: EnhancedButtonProps) {
  return (
    <EnhancedButton variant="outline" {...props}>
      {children}
    </EnhancedButton>
  );
}

export function GhostButton({ children, ...props }: EnhancedButtonProps) {
  return (
    <EnhancedButton variant="ghost" {...props}>
      {children}
    </EnhancedButton>
  );
}

export function GlassButton({ children, ...props }: EnhancedButtonProps) {
  return (
    <EnhancedButton variant="glass" {...props}>
      {children}
    </EnhancedButton>
  );
}

export function NeonButton({ children, ...props }: EnhancedButtonProps) {
  return (
    <EnhancedButton variant="neon" animation="glow" {...props}>
      {children}
    </EnhancedButton>
  );
}

// Floating Action Button
interface FABProps extends EnhancedButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function FloatingActionButton({
  position = 'bottom-right',
  className,
  children,
  ...props
}: FABProps) {
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  return (
    <div className={cn('fixed z-50', getPositionClasses(), className)}>
      <EnhancedButton
        size="lg"
        variant="gradient"
        animation="bounce"
        className="rounded-full shadow-2xl hover:shadow-3xl w-14 h-14 p-0"
        {...props}
      >
        {children}
      </EnhancedButton>
    </div>
  );
}

// Button Group Component
interface ButtonGroupProps {
  children: React.ReactNode;
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

export function ButtonGroup({ children, variant = 'horizontal', className }: ButtonGroupProps) {
  return (
    <div
      className={cn(
        'inline-flex rounded-xl overflow-hidden shadow-md',
        variant === 'vertical' ? 'flex-col' : 'flex-row',
        className
      )}
    >
      {children}
    </div>
  );
}

// Social Button Component
interface SocialButtonProps extends EnhancedButtonProps {
  provider: 'google' | 'github' | 'facebook' | 'twitter';
}

export function SocialButton({ provider, children, ...props }: SocialButtonProps) {
  const getProviderStyles = () => {
    switch (provider) {
      case 'google':
        return 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50';
      case 'github':
        return 'bg-gray-900 text-white hover:bg-gray-800';
      case 'facebook':
        return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'twitter':
        return 'bg-blue-400 text-white hover:bg-blue-500';
      default:
        return '';
    }
  };

  return (
    <EnhancedButton
      variant="outline"
      className={cn('w-full justify-center', getProviderStyles())}
      {...props}
    >
      {children}
    </EnhancedButton>
  );
}

export { EnhancedButton, buttonVariants };
export default EnhancedButton;
