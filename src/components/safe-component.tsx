'use client';

import React from 'react';

interface SafeComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SafeComponent({ children, fallback = null }: SafeComponentProps) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.warn('Component render error (non-fatal):', error);
    return <>{fallback}</>;
  }
}

export function withSafeRender<P extends object>(
  Component: React.ComponentType<P>
) {
  return function SafeWrappedComponent(props: P) {
    try {
      return <Component {...props} />;
    } catch (error) {
      console.warn('Component error (non-fatal):', error);
      return null;
    }
  };
}