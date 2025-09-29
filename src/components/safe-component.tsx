'use client';

import { ReactNode } from 'react';

interface SafeComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function SafeComponent({ children, fallback = null }: SafeComponentProps) {
  try {
    // Ensure children is not undefined
    if (children === undefined || children === null) {
      return <>{fallback}</>;
    }
    return <>{children}</>;
  } catch (error) {
    console.warn('SafeComponent caught error:', error);
    return <>{fallback}</>;
  }
}