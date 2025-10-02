import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';

export function useQuizTimer(questionStartTime: Timestamp | null, duration: number = 30) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!questionStartTime) {
      setTimeLeft(duration);
      setIsActive(false);
      return;
    }

    const startTime = questionStartTime.toMillis();
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    const remaining = Math.max(0, duration - elapsed);

    setTimeLeft(remaining);
    setIsActive(remaining > 0);

    if (remaining <= 0) return;

    const interval = setInterval(() => {
      const currentElapsed = Math.floor((Date.now() - startTime) / 1000);
      const currentRemaining = Math.max(0, duration - currentElapsed);
      
      setTimeLeft(currentRemaining);
      
      if (currentRemaining <= 0) {
        setIsActive(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [questionStartTime, duration]);

  return { timeLeft, isActive };
}