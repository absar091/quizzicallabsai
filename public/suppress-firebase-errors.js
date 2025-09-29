// Minimal Error Suppressor
(function() {
  'use strict';
  
  if (typeof window === 'undefined') return;
  
  // Suppress specific errors that cause loops
  const originalError = console.error;
  console.error = function(...args) {
    const message = String(args[0] || '');
    
    // Suppress React error #306 and Firebase WebChannel errors
    if (message.includes('Minified React error #306') || 
        (message.includes('WebChannelConnection') && message.includes('transport errored'))) {
      return;
    }
    
    originalError.apply(console, args);
  };
  
  console.log('🔥 Error suppressor active');
})();