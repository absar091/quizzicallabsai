'use client';

import React from 'react';

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
  }

  static getDerivedStateFromError() {
    // NEVER change state - always render normally
    return null;
  }

  componentDidCatch() {
    // Completely silent - no logging, no state changes
  }

  render() {
    try {
      return this.props.children || null;
    } catch {
      return null;
    }
  }
}