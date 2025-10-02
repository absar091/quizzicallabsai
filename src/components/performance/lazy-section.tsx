'use client';

import { ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function LazySection({ children, fallback }: LazySectionProps) {
  return (
    <>
      {children}
    </>
  );
}