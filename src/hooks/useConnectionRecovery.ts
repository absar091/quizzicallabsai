import { useState, useEffect, useRef, useCallback } from 'react';
import { getConnectionStatus, forceReconnect } from '@/lib/firebase-connection';

export function useConnectionRecovery() {
  const [isOnline, setIsOnline] = useState(true);
  const [reconnecting, setReconnecting] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // FIXED: Enhanced cleanup function
  const cleanup = useCallback(() => {
    mountedRef.current = false;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    reconnectAttemptsRef.current = 0;
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    const checkConnection = () => {
      if (!mountedRef.current) return;
      
      try {
        const status = getConnectionStatus();
        
        if (mountedRef.current) {
          setIsOnline(status.isOnline);
          setFirebaseConnected(status.firebaseConnected);
          
          // Reset reconnect attempts on successful connection
          if (status.isOnline && status.firebaseConnected) {
            reconnectAttemptsRef.current = 0;
          }
          
          // Auto-reconnect if connection is lost and not already reconnecting
          if (!status.isOnline && !reconnecting && reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnect();
          }
        }
      } catch (error) {
        console.warn('Connection check failed:', error);
      }
    };

    // Initial check
    checkConnection();
    
    // FIXED: Less frequent checks for better performance (10s instead of 2s)
    intervalRef.current = setInterval(checkConnection, 10000);

    const handleOnline = () => {
      if (!mountedRef.current) return;
      
      // Clear any pending reconnect attempts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      setReconnecting(false);
      reconnectAttemptsRef.current = 0;
      checkConnection();
    };

    const handleOffline = () => {
      if (!mountedRef.current) return;
      setIsOnline(false);
      setFirebaseConnected(false);
    };

    // Add event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return cleanup;
  }, [cleanup]);

  // FIXED: Enhanced reconnect with exponential backoff and attempt limiting
  const reconnect = useCallback(async () => {
    if (!mountedRef.current || reconnecting || reconnectAttemptsRef.current >= maxReconnectAttempts) {
      return;
    }
    
    reconnectAttemptsRef.current++;
    setReconnecting(true);
    
    try {
      const success = await forceReconnect();
      
      if (mountedRef.current) {
        if (success) {
          setIsOnline(true);
          setFirebaseConnected(true);
          reconnectAttemptsRef.current = 0; // Reset on success
        } else {
          // Schedule retry with exponential backoff
          const backoffDelay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current - 1), 30000);
          
          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectTimeoutRef.current = setTimeout(() => {
              if (mountedRef.current) {
                reconnect();
              }
            }, backoffDelay);
          }
        }
      }
    } catch (error) {
      console.error('Reconnection failed:', error);
      
      // Schedule retry on error
      if (mountedRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
        const backoffDelay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current - 1), 30000);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            reconnect();
          }
        }, backoffDelay);
      }
    } finally {
      if (mountedRef.current) {
        setReconnecting(false);
      }
    }
  }, [reconnecting]);

  // FIXED: Enhanced cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return { 
    isOnline, 
    reconnecting, 
    reconnect, 
    firebaseConnected,
    connectionStatus: getConnectionStatus(),
    reconnectAttempts: reconnectAttemptsRef.current,
    maxAttempts: maxReconnectAttempts
  };
}