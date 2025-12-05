"use client";

import { useEffect } from 'react';

export function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Suppress Firebase Auth internal assertion errors
      if (event.reason?.message?.includes('INTERNAL ASSERTION FAILED')) {
        console.log('Suppressed Firebase Auth internal error');
        event.preventDefault();
        return;
      }

      // Suppress popup-related errors
      if (event.reason?.code === 'auth/popup-closed-by-user' ||
          event.reason?.code === 'auth/cancelled-popup-request') {
        console.log('Suppressed popup cancellation error');
        event.preventDefault();
        return;
      }

      // Log other unhandled rejections for debugging
      console.error('Unhandled promise rejection:', event.reason);
    };

    // Handle global errors
    const handleError = (event: ErrorEvent) => {
      // Suppress Firebase Auth internal assertion errors
      if (event.message?.includes('INTERNAL ASSERTION FAILED')) {
        console.log('Suppressed Firebase Auth internal error');
        event.preventDefault();
        return;
      }

      // Suppress COOP warnings
      if (event.message?.includes('Cross-Origin-Opener-Policy')) {
        console.log('Suppressed COOP warning');
        event.preventDefault();
        return;
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null; // This component doesn't render anything
}
