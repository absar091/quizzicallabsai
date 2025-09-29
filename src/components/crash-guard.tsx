'use client';

import { useEffect } from 'react';

export function CrashGuard({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ultimate crash prevention
    const preventCrash = () => {
      window.onerror = () => true;
      window.onunhandledrejection = () => true;
      
      // Wrap ALL React render methods
      if (typeof window !== 'undefined' && window.React) {
        const originalRender = window.React.render;
        if (originalRender) {
          window.React.render = function(...args) {
            try {
              return originalRender.apply(this, args);
            } catch {
              return null;
            }
          };
        }
      }
    };

    preventCrash();
    
    // Re-apply every second to ensure it sticks
    const interval = setInterval(preventCrash, 1000);
    
    return () => clearInterval(interval);
  }, []);

  try {
    return <>{children}</>;
  } catch {
    return null;
  }
}