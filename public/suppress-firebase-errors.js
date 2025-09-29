// Comprehensive Error Suppressor
(function() {
  'use strict';
  
  if (typeof window === 'undefined') return;
  
  // Override console methods to suppress specific errors
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = function(...args) {
    const message = String(args[0] || '');
    
    // Suppress React #306 errors and Firebase WebChannel errors
    if (message.includes('Minified React error #306') || 
        message.includes('visit https://react.dev/errors/306') ||
        (message.includes('WebChannelConnection') && message.includes('transport errored'))) {
      return;
    }
    
    originalError.apply(console, args);
  };
  
  console.warn = function(...args) {
    const message = String(args[0] || '');
    
    // Suppress React #306 warnings
    if (message.includes('Error caught but app continues: Minified React error #306') ||
        message.includes('Component error (non-fatal)') && message.includes('306')) {
      return;
    }
    
    originalWarn.apply(console, args);
  };
  
  console.log('🔥 Error suppressor active');
})();