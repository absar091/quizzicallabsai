
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
    <div className={cn("mb-6", className)}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      {description && <p className="text-muted-foreground mt-1 max-w-2xl">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default PageHeader;
