// @ts-nocheck
"use client";

import dynamic from "next/dynamic";
import { ComponentType, ReactNode } from "react";
import { Loader2 } from "lucide-react";

// Generic lazy loading wrapper with consistent loading UI
export function withLazyLoading<T extends {}>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  loadingText?: string
) {
  return dynamic(importFunc, {
    loading: () => (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-4">
        <div className="relative mb-4">
          <div className="h-12 w-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground">
          {loadingText || "Loading..."}
        </p>
      </div>
    ),
    ssr: false, // Disable SSR for client-only components
  });
}

// Lazy load heavy components
export const LazyMainSidebar = withLazyLoading(
  () => import('@/components/main-sidebar'),
  "Loading navigation..."
);

export const LazyHelpBot = withLazyLoading(
  () => import('@/components/help-bot'),
  "Loading AI assistant..."
);

export const LazyStudyStreakWidget = withLazyLoading(
  () => import('@/components/study-streak-widget'),
  "Loading progress..."
);

export const LazyEnhancedToast = withLazyLoading(
  () => import('@/components/enhanced-toast').then(mod => ({ default: mod.EnhancedToast })),
  "Loading notifications..."
);

// Prefetch navigation helper
export function prefetchRoute(href: string) {
  // Use next/link prefetch for routes
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    link.as = 'document';
    document.head.appendChild(link);
  }
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
}

// Dynamic layout components
export const LazyProtectedLayout = withLazyLoading(
  () => import('@/app/(protected)/layout'),
  "Loading app..."
);

// Suspense boundary for critical sections
export function PerformanceBoundary({ children, fallback }: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <Suspense
      fallback={fallback || (
        <div className="flex items-center justify-center p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        </div>
      )}
    >
      {children}
    </Suspense>
  );
}

// Import Suspense for the boundary
import React, { Suspense } from "react";
