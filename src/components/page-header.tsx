import type { ReactNode } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="mb-8">
       <div className="flex items-center justify-between">
         <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
         </div>
        <div className='flex items-center gap-2'>
        {children}
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
        </div>
      </div>
    </header>
  );
}
