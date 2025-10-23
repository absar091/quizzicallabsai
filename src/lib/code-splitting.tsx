// Code splitting utilities for Quizzicallabs AI
// This file provides lazy loading components and utilities to optimize bundle size

import { lazy, ComponentType, LazyExoticComponent } from 'react';
import { motion } from 'framer-motion';

// Loading component for lazy-loaded components
export function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-8 space-y-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
      />
      <p className="text-muted-foreground">{message}</p>
    </motion.div>
  );
}

// Error boundary for lazy-loaded components
export function LazyErrorBoundary({ children, fallback }: {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error }>;
}) {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error>();

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    const FallbackComponent = fallback || (() => (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="text-destructive">Failed to load component</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Reload Page
        </button>
      </div>
    ));

    return <FallbackComponent error={error} />;
  }

  return <>{children}</>;
}

// Lazy loading wrapper with loading and error states
export function withLazyLoading<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  loadingMessage?: string,
  fallback?: React.ComponentType<{ error?: Error }>
): LazyExoticComponent<T> {
  const LazyComponent = lazy(importFunc);

  return lazy(() =>
    importFunc().catch((error) => {
      console.error('Failed to load component:', error?.message || 'Unknown error');
      return {
        default: (() => {
          const FallbackComponent = fallback || (() => (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <div className="text-destructive">Failed to load component</div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded"
              >
                Reload Page
              </button>
            </div>
          ));
          return <FallbackComponent error={error} />;
        }) as any
      };
    })
  );
}

// Preload utilities for critical components
export const preloadComponent = (importFunc: () => Promise<any>) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  // This is a simplified version - in practice you'd need to resolve the chunk URL
  return importFunc;
};

// Lazy-loaded page components
export const LazyDashboard = withLazyLoading(
  () => import('@/app/(protected)/(main)/dashboard/page'),
  "Loading dashboard..."
);

export const LazyGenerateQuiz = withLazyLoading(
  () => import('@/app/(protected)/(main)/generate-quiz/page'),
  "Loading quiz generator..."
);

export const LazyGenerateStudyGuide = withLazyLoading(
  () => import('@/app/(protected)/(main)/generate-study-guide/page'),
  "Loading study guide generator..."
);

export const LazyGenerateFromFile = withLazyLoading(
  () => import('@/app/(protected)/(main)/generate-from-file/page'),
  "Loading document quiz generator..."
);

export const LazyExamPrep = withLazyLoading(
  () => import('@/app/(protected)/(main)/exam-prep/page'),
  "Loading exam preparation..."
);

export const LazyMDCAT = withLazyLoading(
  () => import('@/app/(protected)/(main)/mdcat/page'),
  "Loading MDCAT preparation..."
);

export const LazyECAT = withLazyLoading(
  () => import('@/app/(protected)/(main)/ecat/page'),
  "Loading ECAT preparation..."
);

export const LazyNTS = withLazyLoading(
  () => import('@/app/(protected)/(main)/nts/page'),
  "Loading NTS preparation..."
);

// Lazy-loaded heavy components
export const LazyQuizSharing = withLazyLoading(
  () => import('@/components/quiz-sharing'),
  "Loading sharing features..."
);

export const LazyRichContentRenderer = withLazyLoading(
  () => import('@/components/rich-content-renderer'),
  "Loading content renderer..."
);

export const LazyLatexRenderer = withLazyLoading(
  () => import('@/components/latex-renderer'),
  "Loading math renderer..."
);

export const LazyPDFExport = withLazyLoading(
  () => import('jspdf'),
  "Loading PDF export..."
);

// Lazy-loaded AI flows (heavy computation)
export const LazyGenerateCustomQuiz = withLazyLoading(
  () => import('@/ai/flows/generate-custom-quiz'),
  "Loading quiz generation..."
);

export const LazyGenerateStudyGuideFlow = withLazyLoading(
  () => import('@/ai/flows/generate-study-guide'),
  "Loading study guide generation..."
);

export const LazyGenerateFromDocument = withLazyLoading(
  () => import('@/ai/flows/generate-quiz-from-document'),
  "Loading document processing..."
);

// Utility for dynamic imports with caching
class ComponentCache {
  private static cache = new Map<string, LazyExoticComponent<any>>();

  static get<T extends ComponentType<any>>(
    key: string,
    importFunc: () => Promise<{ default: T }>,
    loadingMessage?: string
  ): LazyExoticComponent<T> {
    if (!this.cache.has(key)) {
      this.cache.set(key, withLazyLoading(importFunc, loadingMessage));
    }
    return this.cache.get(key)!;
  }

  static preload(key: string, importFunc: () => Promise<any>) {
    if (!this.cache.has(key)) {
      preloadComponent(importFunc);
    }
  }

  static clear() {
    this.cache.clear();
  }
}

export { ComponentCache };

// Route-based code splitting
export const routeComponents = {
  '/dashboard': () => LazyDashboard,
  '/generate-quiz': () => LazyGenerateQuiz,
  '/generate-study-guide': () => LazyGenerateStudyGuide,
  '/generate-from-file': () => LazyGenerateFromFile,
  '/exam-prep': () => LazyExamPrep,
  '/mdcat': () => LazyMDCAT,
  '/ecat': () => LazyECAT,
  '/nts': () => LazyNTS,
};

// Preload critical routes on app start
export const preloadCriticalRoutes = () => {
  // Preload dashboard and quiz generator immediately
  ComponentCache.preload('dashboard', () => import('@/app/(protected)/(main)/dashboard/page'));
  ComponentCache.preload('generate-quiz', () => import('@/app/(protected)/(main)/generate-quiz/page'));

  // Preload other routes after a delay
  setTimeout(() => {
    ComponentCache.preload('generate-study-guide', () => import('@/app/(protected)/(main)/generate-study-guide/page'));
    ComponentCache.preload('mdcat', () => import('@/app/(protected)/(main)/mdcat/page'));
  }, 2000);
};

// Bundle analyzer helper
export const getBundleInfo = () => {
  if (typeof window !== 'undefined' && (window as any).__STATS__) {
    return (window as any).__STATS__;
  }
  return null;
};

// Performance monitoring for code splitting
export const trackBundleLoad = (componentName: string, loadTime: number) => {
  if (typeof window !== 'undefined') {
    // Send to analytics
    console.log(`Component loaded in ${loadTime}ms`);

    // Store in performance marks
    if ('performance' in window && performance.mark) {
      performance.mark(`${componentName}-loaded`);
    }
  }
};

// Intersection Observer for lazy loading components
export const useLazyLoad = (ref: React.RefObject<Element>, options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
};

// Dynamic import with retry mechanism
export const dynamicImportWithRetry = async <T,>(
  importFunc: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await importFunc();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }

  throw new Error('Failed to load component after retries');
};

// Webpack magic comments for better chunk naming
export const loadComponent = (componentName: string) =>
  lazy(() =>
    import(
      /* webpackChunkName: "[request]" */
      `@/components/${componentName}`
    )
  );

// Service worker integration for caching chunks
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully');

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, notify user
              console.log('New content available, please refresh.');
            }
          });
        }
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error?.message || 'Unknown error');
    }
  }
};

// Bundle size monitoring
export const monitorBundleSize = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Monitor resource loading
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('.js') && entry.transferSize) {
          console.log(`Bundle loaded - ${entry.transferSize} bytes`);
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => observer.disconnect();
  }
};

// Initialize code splitting optimizations
export const initializeCodeSplitting = () => {
  // Preload critical routes
  preloadCriticalRoutes();

  // Register service worker
  registerServiceWorker();

  // Monitor bundle sizes
  monitorBundleSize();

  // Set up performance marks
  if (typeof window !== 'undefined' && 'performance' in window && performance.mark) {
    performance.mark('app-initialized');
  }
};
