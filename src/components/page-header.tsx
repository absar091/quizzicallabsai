
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      {description && <p className="text-muted-foreground mt-2 max-w-2xl">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
