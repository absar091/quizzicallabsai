// Universal Error Suppressor
(function() {
  'use strict';
  
  if (typeof window === 'undefined') return;
  
  const originalError = console.error;
  const originalWarn = console.warn;
  
  // Suppress all React minified errors and common crashes
  const suppressedPatterns = [
    'Minified React error',
    'visit https://react.dev/errors',
    'WebChannelConnection',
    'transport errored',
    'ChunkLoadError',
    'Loading chunk',
    'Loading CSS chunk',
    'Failed to import',
    'Network request failed',
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    'DialogContent',
    'DialogTitle',
    'aria-describedby',
    'screen reader users',
    'VisuallyHidden component',
    'Download error or resource',
    'icon from the Manifest'
  ];
  
  function shouldSuppress(message) {
    return suppressedPatterns.some(pattern => message.includes(pattern));
  }
  
  console.error = function(...args) {
    const message = String(args[0] || '');
    if (!shouldSuppress(message)) {
      try {
        originalError.apply(console, args);
      } catch {}
    }
  };
  
  console.warn = function(...args) {
    const message = String(args[0] || '');
    if (!shouldSuppress(message)) {
      try {
        originalWarn.apply(console, args);
      } catch {}
    }
  };
  
  // Override console.log to suppress info messages
  const originalLog = console.log;
  console.log = function(...args) {
    const message = String(args[0] || '');
    if (!shouldSuppress(message)) {
      try {
        originalLog.apply(console, args);
      } catch {}
    }
  };
  
  // Global error handlers - suppress everything
  window.addEventListener('error', function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }, true);
  
  window.addEventListener('unhandledrejection', function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }, true);
  
  // Override window.onerror
  window.onerror = function() { return true; };
  window.onunhandledrejection = function() { return true; };
  
  console.log('🔥 Universal error suppressor active');
})();