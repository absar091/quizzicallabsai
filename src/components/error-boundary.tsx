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
    // Silently handle React #306 errors (undefined render)
    if (error.message?.includes('306') || error.message?.includes('undefined')) {
      return { hasError: false };
    }
    console.warn('Error caught but app continues:', error.message);
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Silently handle React #306 errors
    if (error.message?.includes('306') || error.message?.includes('undefined')) {
      return;
    }
    // Log other errors but don't crash app
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