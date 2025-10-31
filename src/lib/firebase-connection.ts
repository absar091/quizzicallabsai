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

// Test Firebase connectivity
async function testFirebaseConnection(): Promise<boolean> {
  try {
    // Try to perform a lightweight Firebase operation
    const { doc, getDoc } = await import('firebase/firestore');
    const testDoc = doc(firestore, '_connection_test', 'test');
    await getDoc(testDoc);
    return true;
  } catch (error) {
    console.warn('Firebase connection test failed:', error);
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
export const forceReconnect = async () => {
  connectionState.reconnectAttempts++;
  
  try {
    // First, try to re-enable Firebase network
    await disableNetwork(firestore);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await enableNetwork(firestore);
    
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
  } catch (error) {
    console.error('Reconnection failed:', error);
    connectionState.firebaseConnected = false;
    
    // Exponential backoff for retries
    const backoffDelay = Math.min(1000 * Math.pow(2, connectionState.reconnectAttempts), 30000);
    
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    reconnectTimeout = setTimeout(() => {
      forceReconnect();
    }, backoffDelay);
    
    return false;
  }
};

// Monitor connection status
if (typeof window !== 'undefined') {
  // Test Firebase connection periodically
  setInterval(async () => {
    const isConnected = await testFirebaseConnection();
    if (isConnected) {
      connectionState.lastSuccessfulConnection = Date.now();
      connectionState.firebaseConnected = true;
    } else {
      connectionState.firebaseConnected = false;
    }
  }, 10000); // Test every 10 seconds

  // Listen to browser online/offline events
  window.addEventListener('online', () => {
    connectionState.isOnline = true;
    forceReconnect();
  });

  window.addEventListener('offline', () => {
    connectionState.isOnline = false;
    connectionState.firebaseConnected = false;
  });

  // Suppress Firebase WebChannel errors (they're harmless)
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args.join(' ');
    
    if (message.includes('WebChannelConnection RPC') && message.includes('transport errored')) {
      return; // Don't log these errors
    }
    
    originalWarn.apply(console, args);
  };
}