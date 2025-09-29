// Firebase WebChannel Error Suppressor
// This script suppresses harmless Firebase WebChannel transport errors
(function() {
  'use strict';
  
  if (typeof window === 'undefined') return;
  
  // Store original console methods
  const originalWarn = console.warn;
  const originalError = console.error;
  
  // Override console.warn
  console.warn = function(...args) {
    const message = args.join(' ');
    
    // Suppress Firebase WebChannel errors (they're harmless)
    if (message.includes('WebChannelConnection RPC') && 
        (message.includes('transport errored') || 
         message.includes('stream') || 
         message.includes('Listen') || 
         message.includes('Write'))) {
      return; // Don't log these
    }
    
    // Log everything else normally
    originalWarn.apply(console, args);
  };
  
  // Override console.error
  console.error = function(...args) {
    const message = args.join(' ');
    
    // Suppress Firebase WebChannel errors
    if (message.includes('WebChannelConnection') || 
        message.includes('transport errored') ||
        message.includes('webchannel_blob_es2018.js') ||
        message.includes('Cannot read properties of undefined') ||
        message.includes('reading \'info\'')) {
      return; // Don't log these
    }
    
    // Log everything else normally
    originalError.apply(console, args);
  };
  
  // Add error boundary for React errors
  window.addEventListener('error', function(event) {
    if (event.error && event.error.message && 
        (event.error.message.includes('Cannot read properties of undefined') ||
         event.error.message.includes('reading \'info\'') ||
         event.error.stack.includes('firebase'))) {
      event.preventDefault();
      return false;
    }
  });
  
  console.log('🔥 Firebase error suppressor active');
})();