// Minimal Firebase Error Suppressor
(function() {
  'use strict';
  
  if (typeof window === 'undefined') return;
  
  // Only suppress specific Firebase WebChannel warnings
  const originalWarn = console.warn;
  console.warn = function(...args) {
    const message = String(args[0] || '');
    
    // Only suppress Firebase WebChannel transport errors
    if (message.includes('WebChannelConnection') && message.includes('transport errored')) {
      return;
    }
    
    originalWarn.apply(console, args);
  };
  
  console.log('🔥 Firebase error suppressor active');
})();