
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="mb-8 text-center">
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

    