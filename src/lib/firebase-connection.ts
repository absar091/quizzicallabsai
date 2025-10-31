import { connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';
import { firestore } from './firebase';

// Enhanced Firebase Connection Management
let connectionState = {
  isOnline: true,
  reconnectAttempts: 0,
  lastSuccessfulConnection: Date.now(),
  firebaseConnected: true
};

let reconnectTimeout: NodeJS.Timeout | null = null;

// Test Firebase connectivity - OPTIMIZED FOR SPEED
async function testFirebaseConnection(): Promise<boolean> {
  try {
    // Use a much faster, lightweight test - just check if Firebase is initialized
    if (!firestore) {
      return false;
    }
    
    // Quick connection test with shorter timeout (2 seconds instead of 10)
    const { doc, getDoc } = await import('firebase/firestore');
    const testDoc = doc(firestore, 'quiz-rooms', 'connection_test');
    
    // MUCH shorter timeout for faster loading
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 2000)
    );
    
    await Promise.race([getDoc(testDoc), timeoutPromise]);
    return true;
  } catch (error: any) {
    // Permission errors mean Firebase is connected
    if (error.code === 'permission-denied' || error.code === 'unauthenticated') {
      return true;
    }
    
    // For faster loading, don't log every connection test failure
    if (error.message !== 'Connection timeout') {
      console.warn('Firebase connection test failed:', error.message || error);
    }
    return false;
  }
}

// Enhanced connection monitoring
export const getConnectionStatus = () => {
  const browserOnline = navigator?.onLine ?? true;
  const timeSinceLastSuccess = Date.now() - connectionState.lastSuccessfulConnection;
  const connectionStale = timeSinceLastSuccess > 30000; // 30 seconds

  return {
    isOnline: browserOnline && connectionState.firebaseConnected && !connectionStale,
    reconnectAttempts: connectionState.reconnectAttempts,
    firebaseConnected: connectionState.firebaseConnected,
    browserOnline
  };
};

// Enhanced reconnection with Firebase-specific handling
export const forceReconnect = async (): Promise<boolean> => {
  connectionState.reconnectAttempts++;
  
  try {
    // Only attempt network operations if we're in a browser environment
    if (typeof window === 'undefined') {
      return false;
    }

    // First, try to re-enable Firebase network with error handling
    try {
      await disableNetwork(firestore);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await enableNetwork(firestore);
    } catch (networkError) {
      console.warn('Network enable/disable failed:', networkError);
      // Continue with connection test even if network operations fail
    }
    
    // Test the connection
    const isConnected = await testFirebaseConnection();
    
    if (isConnected) {
      connectionState.firebaseConnected = true;
      connectionState.lastSuccessfulConnection = Date.now();
      connectionState.reconnectAttempts = 0;
      return true;
    } else {
      throw new Error('Firebase connection test failed');
    }
  } catch (error: any) {
    console.warn('Reconnection attempt failed:', error.message || error);
    connectionState.firebaseConnected = false;
    
    // Don't retry too aggressively to avoid overwhelming the system
    if (connectionState.reconnectAttempts < 5) {
      // Exponential backoff for retries
      const backoffDelay = Math.min(1000 * Math.pow(2, connectionState.reconnectAttempts), 30000);
      
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(() => {
        forceReconnect().catch(console.warn);
      }, backoffDelay);
    }
    
    return false;
  }
};

// Monitor connection status
if (typeof window !== 'undefined') {
  // Test Firebase connection periodically with error handling
  const connectionCheckInterval = setInterval(async () => {
    try {
      const isConnected = await testFirebaseConnection();
      if (isConnected) {
        connectionState.lastSuccessfulConnection = Date.now();
        connectionState.firebaseConnected = true;
      } else {
        connectionState.firebaseConnected = false;
      }
    } catch (error) {
      // Silently handle periodic check errors
      connectionState.firebaseConnected = false;
    }
  }, 15000); // Test every 15 seconds (less aggressive)

  // Listen to browser online/offline events
  window.addEventListener('online', () => {
    connectionState.isOnline = true;
    // Don't immediately force reconnect, let the periodic check handle it
    setTimeout(() => {
      forceReconnect().catch(console.warn);
    }, 2000);
  });

  window.addEventListener('offline', () => {
    connectionState.isOnline = false;
    connectionState.firebaseConnected = false;
  });

  // Clean up interval on page unload
  window.addEventListener('beforeunload', () => {
    if (connectionCheckInterval) {
      clearInterval(connectionCheckInterval);
    }
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
  });

  // Suppress Firebase WebChannel errors (they're harmless)
  const originalWarn = console.warn;
  const originalError = console.error;
  
  console.warn = (...args) => {
    const message = args.join(' ');
    
    if (message.includes('WebChannelConnection RPC') && message.includes('transport errored')) {
      return; // Don't log these errors
    }
    
    originalWarn.apply(console, args);
  };

  console.error = (...args) => {
    const message = args.join(' ');
    
    // Suppress common Firebase connection errors that are handled gracefully
    if (message.includes('Firebase connection test failed') || 
        message.includes('Reconnection failed')) {
      return; // Don't log these as errors, they're handled
    }
    
    originalError.apply(console, args);
  };
}