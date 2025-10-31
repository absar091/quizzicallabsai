import { useState, useEffect, useRef } from 'react';
import { getConnectionStatus, forceReconnect } from '@/lib/firebase-connection';

export function useConnectionRecovery() {
  const [isOnline, setIsOnline] = useState(true);
  const [reconnecting, setReconnecting] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const checkConnection = () => {
      if (!mountedRef.current) return;
      
      const status = getConnectionStatus();
      setIsOnline(status.isOnline);
      setFirebaseConnected(status.firebaseConnected);
      
      // Auto-reconnect if connection is lost
      if (!status.isOnline && !reconnecting) {
        reconnect();
      }
    };

    // Initial check
    checkConnection();
    
    // Set up interval with ref for cleanup
    intervalRef.current = setInterval(checkConnection, 2000);

    const handleOnline = () => {
      if (!mountedRef.current) return;
      setReconnecting(false);
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

    return () => {
      mountedRef.current = false;
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  const reconnect = async () => {
    if (!mountedRef.current || reconnecting) return;
    
    setReconnecting(true);
    
    try {
      const success = await forceReconnect();
      
      if (mountedRef.current) {
        if (success) {
          setIsOnline(true);
          setFirebaseConnected(true);
        }
      }
    } catch (error) {
      console.error('Reconnection failed:', error);
    } finally {
      if (mountedRef.current) {
        setReconnecting(false);
      }
    }
  };

  return { 
    isOnline, 
    reconnecting, 
    reconnect, 
    firebaseConnected,
    connectionStatus: getConnectionStatus()
  };
}