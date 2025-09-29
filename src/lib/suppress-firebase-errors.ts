// Global Firebase Error Suppressor
// This suppresses harmless WebChannel transport errors that spam the console

if (typeof window !== 'undefined') {
  // Store original console methods
  const originalWarn = console.warn;
  const originalError = console.error;

  // Override console.warn
  console.warn = (...args) => {
    const message = args.join(' ');
    
    // Suppress Firebase WebChannel errors (they're normal and harmless)
    if (message.includes('WebChannelConnection RPC') && 
        (message.includes('transport errored') || message.includes('stream') || message.includes('Listen') || message.includes('Write'))) {
      return;
    }
    
    // Log everything else normally
    originalWarn.apply(console, args);
  };

  // Override console.error for Firebase errors too
  console.error = (...args) => {
    const message = args.join(' ');
    
    // Suppress Firebase WebChannel errors
    if (message.includes('WebChannelConnection') || message.includes('transport errored')) {
      return;
    }
    
    // Log everything else normally
    originalError.apply(console, args);
  };

  console.log('🔥 Firebase error suppressor loaded - WebChannel errors will be hidden');
}

export {};