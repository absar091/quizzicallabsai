'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    // Never crash - always continue
    return { hasError: false };
  }

  componentDidCatch() {
    // Silently handle all errors - never crash app
    return;
  }

  render() {
    // Always render children - never show error UI
    return this.props.children;
  }
}