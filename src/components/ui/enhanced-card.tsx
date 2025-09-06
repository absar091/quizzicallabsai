'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-card/90 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl dark:bg-card',
        glass: 'bg-card/50 backdrop-blur-md border-border/50 shadow-xl dark:bg-card/30 dark:border-border/30',
        gradient: 'bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border-border/30 shadow-lg',
        neon: 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/10',
        outlined: 'bg-transparent border-2 border-dashed border-border/50 hover:border-primary/50',
        elevated: 'bg-card shadow-2xl border-0 hover:shadow-3xl transform hover:-translate-y-1',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      hover: {
        none: '',
        lift: 'hover:transform hover:-translate-y-2 hover:shadow-2xl',
        glow: 'hover:shadow-2xl hover:shadow-primary/20',
        scale: 'hover:scale-105',
        border: 'hover:border-primary/50',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      hover: 'lift',
    },
  }
);

export interface EnhancedCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const EnhancedCard = forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant, padding, hover, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, hover }), className)}
        {...props}
      />
    );
  }
);

EnhancedCard.displayName = 'EnhancedCard';

const EnhancedCardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));

EnhancedCardHeader.displayName = 'EnhancedCardHeader';

const EnhancedCardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight text-gradient',
      className
    )}
    {...props}
  />
));

EnhancedCardTitle.displayName = 'EnhancedCardTitle';

const EnhancedCardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));

EnhancedCardDescription.displayName = 'EnhancedCardDescription';

const EnhancedCardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));

EnhancedCardContent.displayName = 'EnhancedCardContent';

const EnhancedCardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));

EnhancedCardFooter.displayName = 'EnhancedCardFooter';

// Preset card components
export function GlassCard({ children, className, ...props }: EnhancedCardProps) {
  return (
    <EnhancedCard variant="glass" className={className} {...props}>
      {children}
    </EnhancedCard>
  );
}

export function GradientCard({ children, className, ...props }: EnhancedCardProps) {
  return (
    <EnhancedCard variant="gradient" className={className} {...props}>
      {children}
    </EnhancedCard>
  );
}

export function NeonCard({ children, className, ...props }: EnhancedCardProps) {
  return (
    <EnhancedCard variant="neon" className={className} {...props}>
      {children}
    </EnhancedCard>
  );
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className
}: {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
  className?: string;
}) {
  return (
    <EnhancedCard className={cn('relative overflow-hidden', className)}>
      <EnhancedCardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-gradient">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {icon && (
            <div className="p-3 bg-primary/10 rounded-xl">
              {icon}
            </div>
          )}
        </div>

        {trend && (
          <div className="mt-4 flex items-center space-x-2">
            <span
              className={cn(
                'text-xs font-medium',
                trend.positive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend.positive ? '+' : ''}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </EnhancedCardContent>

      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full -translate-y-10 translate-x-10" />
    </EnhancedCard>
  );
}

export function FeatureCard({
  title,
  description,
  icon,
  comingSoon = false,
  className
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  comingSoon?: boolean;
  className?: string;
}) {
  return (
    <EnhancedCard
      className={cn(
        'group relative overflow-hidden transition-all duration-300',
        comingSoon && 'opacity-75',
        className
      )}
      hover="scale"
    >
      <EnhancedCardContent className="p-6">
        <div className="flex items-start space-x-4">
          {icon && (
            <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          )}

          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-lg text-gradient group-hover:scale-105 transition-transform duration-300">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {comingSoon && (
          <div className="absolute top-4 right-4">
            <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full">
              Coming Soon
            </span>
          </div>
        )}
      </EnhancedCardContent>

      {/* Hover effect gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
    </EnhancedCard>
  );
}

export function TestimonialCard({
  quote,
  author,
  role,
  avatar,
  rating = 5,
  className
}: {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: number;
  className?: string;
}) {
  return (
    <EnhancedCard variant="glass" className={className}>
      <EnhancedCardContent className="p-6">
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={cn(
                'w-4 h-4',
                i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              )}
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-sm italic text-muted-foreground mb-4">
          "{quote}"
        </blockquote>

        {/* Author */}
        <div className="flex items-center space-x-3">
          {avatar && (
            <img
              src={avatar}
              alt={author}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-semibold text-sm">{author}</p>
            {role && <p className="text-xs text-muted-foreground">{role}</p>}
          </div>
        </div>
      </EnhancedCardContent>
    </EnhancedCard>
  );
}

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
  EnhancedCardFooter,
  cardVariants,
};
