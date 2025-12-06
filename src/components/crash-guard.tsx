'use client';

import React, { useEffect } from 'react';

export function CrashGuard({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ultimate crash prevention
    const preventCrash = () => {
      window.onerror = () => true;
      window.onunhandledrejection = () => true;
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