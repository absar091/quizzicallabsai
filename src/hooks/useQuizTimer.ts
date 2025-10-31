import { useState, useEffect, useRef } from 'react';
import { Timestamp } from 'firebase/firestore';

export function useQuizTimer(questionStartTime: Timestamp | null, duration: number = 30) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
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

    // Use server timestamp for synchronization
    const serverStartTime = questionStartTime.toMillis();
    startTimeRef.current = serverStartTime;

    // Calculate initial time with server sync
    const calculateTimeLeft = () => {
      if (!startTimeRef.current) return duration;
      
      // Get server time offset for better sync
      const clientTime = Date.now();
      const serverOffset = 0; // Could implement NTP-like sync here
      const adjustedTime = clientTime + serverOffset;
      
      const elapsed = Math.floor((adjustedTime - startTimeRef.current) / 1000);
      return Math.max(0, duration - elapsed);
    };

    const remaining = calculateTimeLeft();
    setTimeLeft(remaining);
    setIsActive(remaining > 0);

    if (remaining <= 0) {
      setIsActive(false);
      return;
    }

    // Use more frequent updates for better accuracy
    intervalRef.current = setInterval(() => {
      const currentRemaining = calculateTimeLeft();
      setTimeLeft(currentRemaining);
      
      if (currentRemaining <= 0) {
        setIsActive(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 100); // Update every 100ms for smoother countdown

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [questionStartTime, duration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return { timeLeft, isActive };
}