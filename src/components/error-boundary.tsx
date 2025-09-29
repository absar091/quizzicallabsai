'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Always prevent app crash - just log and continue
    console.warn('Error caught but app continues:', error.message);
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error but don't crash app
    console.warn('Component error (non-fatal):', {
      error: error.message,
      stack: error.stack?.substring(0, 200),
      component: errorInfo.componentStack?.substring(0, 200)
    });
  }

  render() {
    // Never show error UI - always render children
    return this.props.children;
  }
}