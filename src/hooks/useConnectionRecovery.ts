import { useState, useEffect } from 'react';
import { getConnectionStatus, forceReconnect } from '@/lib/firebase-connection';

export function useConnectionRecovery() {
  const [isOnline, setIsOnline] = useState(true);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    const checkConnection = () => {
      const status = getConnectionStatus();
      setIsOnline(status.isOnline);
    };

    checkConnection();
    const interval = setInterval(checkConnection, 3000);

    const handleOnline = () => {
      setIsOnline(true);
      setReconnecting(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const reconnect = async () => {
    setReconnecting(true);
    try {
      await forceReconnect();
      setIsOnline(true);
    } catch (error) {
      console.error('Reconnection failed:', error);
    } finally {
      setReconnecting(false);
    }
  };

  return { isOnline, reconnecting, reconnect };
}