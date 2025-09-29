'use client';

import { ReactNode } from 'react';

interface SafeComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function SafeComponent({ children, fallback = null }: SafeComponentProps) {
  try {
    if (children === undefined || children === null || children === false) {
      return <>{fallback}</>;
    }
    return <>{children}</>;
  } catch {
    return <>{fallback}</>;
  }
}