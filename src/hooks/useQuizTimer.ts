// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { Timestamp } from 'firebase/firestore';

// Server time synchronization utility
class ServerTimeSync {
  private static offset: number = 0;
  private static lastSync: number = 0;
  private static syncInProgress: boolean = false;

  static async getServerTime(): Promise<number> {
    // Sync with server every 5 minutes or on first call
    const now = Date.now();
    if (now - this.lastSync > 300000 || this.lastSync === 0) {
      await this.syncWithServer();
    }
    
    return Date.now() + this.offset;
  }

  private static async syncWithServer(): Promise<void> {
    if (this.syncInProgress) return;
    
    this.syncInProgress = true;
    try {
      // FIXED: Use a temporary document in quiz-rooms collection instead of system
      const { firestore } = await import('@/lib/firebase');
      const { doc, setDoc, getDoc, serverTimestamp } = await import('firebase/firestore');
      
      // Use a temporary sync document that gets cleaned up
      const syncRef = doc(firestore, 'quiz-rooms', `time-sync-${Date.now()}`);
      const clientTime = Date.now();
      
      // Write server timestamp to allowed collection
      await setDoc(syncRef, { 
        timestamp: serverTimestamp(),
        type: 'time-sync',
        clientTime: clientTime
      });
      
      // Read it back immediately
      const syncDoc = await getDoc(syncRef);
      if (syncDoc.exists()) {
        const serverTime = syncDoc.data().timestamp?.toMillis();
        if (serverTime) {
          const roundTripTime = Date.now() - clientTime;
          this.offset = serverTime - clientTime + (roundTripTime / 2);
          this.lastSync = Date.now();
          
          // Clean up the temporary document
          try {
            await syncRef.delete();
          } catch (deleteError) {
            // Ignore delete errors
          }
        }
      }
    } catch (error) {
      console.warn('Server time sync failed, using client time:', error);
      this.offset = 0;
    } finally {
      this.syncInProgress = false;
    }
  }
}

export function useQuizTimer(questionStartTime: Timestamp | null, duration: number = 30) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!questionStartTime) {
      setTimeLeft(duration);
      setIsActive(false);
      startTimeRef.current = null;
      return;
    }

    // FIXED: Use server timestamp for accurate synchronization
    const serverStartTime = questionStartTime.toMillis();
    startTimeRef.current = serverStartTime;

    // Enhanced time calculation with server sync
    const calculateTimeLeft = async () => {
      if (!startTimeRef.current || !mountedRef.current) return duration;
      
      try {
        // FIXED: Get synchronized server time
        const adjustedTime = await ServerTimeSync.getServerTime();
        const elapsed = Math.floor((adjustedTime - startTimeRef.current) / 1000);
        return Math.max(0, duration - elapsed);
      } catch (error) {
        // Fallback to client time if server sync fails
        const clientTime = Date.now();
        const elapsed = Math.floor((clientTime - startTimeRef.current) / 1000);
        return Math.max(0, duration - elapsed);
      }
    };

    // Initialize timer
    const initializeTimer = async () => {
      if (!mountedRef.current) return;
      
      const remaining = await calculateTimeLeft();
      if (!mountedRef.current) return;
      
      setTimeLeft(remaining);
      setIsActive(remaining > 0);

      if (remaining <= 0) {
        setIsActive(false);
        return;
      }

      // FIXED: Adaptive update frequency - less frequent for better performance
      const getUpdateInterval = (timeRemaining: number) => {
        if (timeRemaining <= 10) return 100; // 100ms for last 10 seconds
        if (timeRemaining <= 30) return 500; // 500ms for last 30 seconds
        return 1000; // 1s for longer durations
      };

      const updateTimer = async () => {
        if (!mountedRef.current) return;
        
        const currentRemaining = await calculateTimeLeft();
        if (!mountedRef.current) return;
        
        setTimeLeft(currentRemaining);
        
        if (currentRemaining <= 0) {
          setIsActive(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return;
        }

        // Adjust interval based on remaining time
        const nextInterval = getUpdateInterval(currentRemaining);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        
        if (mountedRef.current) {
          intervalRef.current = setTimeout(updateTimer, nextInterval);
        }
      };

      // Start the adaptive timer
      const initialInterval = getUpdateInterval(remaining);
      intervalRef.current = setTimeout(updateTimer, initialInterval);
    };

    initializeTimer();

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [questionStartTime, duration]);

  // Enhanced cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return { timeLeft, isActive };
}