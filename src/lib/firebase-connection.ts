// Simple Firebase Error Suppressor
if (typeof window !== 'undefined') {
  // Suppress WebChannel transport errors
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args.join(' ');
    
    // Suppress Firebase WebChannel errors (they're harmless)
    if (message.includes('WebChannelConnection RPC') && message.includes('transport errored')) {
      return; // Don't log these errors
    }
    
    // Log all other warnings normally
    originalWarn.apply(console, args);
  };
}

// Simple connection status
export const getConnectionStatus = () => ({ isOnline: navigator?.onLine ?? true, reconnectAttempts: 0 });
export const forceReconnect = () => window.location.reload();