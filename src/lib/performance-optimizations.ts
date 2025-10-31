// Performance Optimizations for Quiz Arena
// Addresses slow loading issues and service worker problems

// 1. Service Worker Optimization
export const optimizeServiceWorker = () => {
  if (typeof window === 'undefined') return;

  // Disable problematic PWA features that cause loading delays
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Don't show the install prompt automatically
    return false;
  });

  // Handle service worker registration errors gracefully
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      // Only keep essential service workers
      registrations.forEach((registration) => {
        if (registration.scope.includes('quiz-arena')) {
          // Keep quiz arena service workers
          return;
        }
        // Unregister problematic service workers
        registration.unregister().catch(() => {
          // Ignore errors during unregistration
        });
      });
    }).catch(() => {
      // Ignore service worker errors to prevent blocking
    });
  }
};

// 2. Firebase Connection Optimization
export const optimizeFirebaseConnection = () => {
  // Preload Firebase modules for faster initialization
  if (typeof window !== 'undefined') {
    // Preload critical Firebase modules
    import('@/lib/firebase').catch(() => {
      // Ignore preload errors
    });
    
    import('firebase/firestore').catch(() => {
      // Ignore preload errors
    });
  }
};

// 3. Memory Management
export const createOptimizedCleanup = () => {
  const cleanupTasks: (() => void)[] = [];
  
  const addCleanupTask = (task: () => void) => {
    cleanupTasks.push(task);
  };
  
  const cleanup = () => {
    cleanupTasks.forEach(task => {
      try {
        task();
      } catch (error) {
        // Ignore cleanup errors to prevent blocking
      }
    });
    cleanupTasks.length = 0;
  };
  
  return { addCleanupTask, cleanup };
};

// 4. Loading State Optimization
export const createFastLoadingState = () => {
  let loadingTimeout: NodeJS.Timeout | null = null;
  
  const setFastLoading = (setLoading: (loading: boolean) => void, maxTime = 3000) => {
    setLoading(true);
    
    // Force loading to false after maxTime to prevent infinite loading
    loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, maxTime);
    
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
      }
      setLoading(false);
    };
  };
  
  return { setFastLoading };
};

// 5. Connection Recovery Optimization
export const createFastConnectionRecovery = () => {
  let recoveryAttempts = 0;
  const maxAttempts = 3;
  
  const attemptFastRecovery = async (recoveryFn: () => Promise<boolean>) => {
    if (recoveryAttempts >= maxAttempts) {
      return false;
    }
    
    recoveryAttempts++;
    
    try {
      // Quick recovery attempt with short timeout
      const timeoutPromise = new Promise<boolean>((_, reject) => 
        setTimeout(() => reject(new Error('Recovery timeout')), 2000)
      );
      
      const result = await Promise.race([recoveryFn(), timeoutPromise]);
      
      if (result) {
        recoveryAttempts = 0; // Reset on success
      }
      
      return result;
    } catch (error) {
      return false;
    }
  };
  
  return { attemptFastRecovery };
};

// 6. Initialize all optimizations
export const initializePerformanceOptimizations = () => {
  optimizeServiceWorker();
  optimizeFirebaseConnection();
};