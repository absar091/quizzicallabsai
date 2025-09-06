'use client';

import { useEffect } from 'react';

export function MobileOptimization() {
  useEffect(() => {
    // Prevent zoom on input focus on iOS
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        // Prevent zoom by setting font-size temporarily
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          const original = viewport.getAttribute('content');
          viewport.setAttribute('content', original + ', user-scalable=no, maximum-scale=1.0');

          // Restore after focus
          setTimeout(() => {
            if (viewport) {
              viewport.setAttribute('content', original || 'width=device-width, initial-scale=1');
            }
          }, 100);
        }
      }
    };

    // Handle orientation changes
    const handleOrientationChange = () => {
      // Force layout recalculation
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    };

    // Handle resize events for better mobile experience
    const handleResize = () => {
      // Update viewport height for mobile browsers
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Add event listeners
    document.addEventListener('focus', handleFocus, true);
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);

    // Initial setup
    handleResize();

    // Prevent pull-to-refresh on mobile (only when pulling down from top)
    let startY = 0;
    let isPullingDown = false;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      isPullingDown = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      const currentY = e.touches[0].clientY;
      const diffY = startY - currentY;

      // Only prevent pull-to-refresh when at the very top and pulling down
      if (window.scrollY <= 5 && diffY < -10) {
        isPullingDown = true;
        e.preventDefault();
      }
      // Allow normal scrolling in all other cases
    };

    // Add touch event listeners for better scroll behavior
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Cleanup
    return () => {
      document.removeEventListener('focus', handleFocus, true);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return null; // This component doesn't render anything
}
