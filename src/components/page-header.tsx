
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
    <header className={cn("mb-8 text-center", className)}>
       <div className="flex flex-col items-center justify-center">
         <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-foreground/80 mt-2 max-w-prose">{description}</p>}
         </div>
        {children}
      </div>
    </header>
  );
}
