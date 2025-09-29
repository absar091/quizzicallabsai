import { useState, useCallback } from 'react';

interface SafetyResult {
  isSafe: boolean;
  reason?: string;
  suggestion?: string;
  safetyScore: number;
}

export function useContentSafety() {
  const [isChecking, setIsChecking] = useState(false);

  const checkContent = useCallback(async (content: string, subject?: string): Promise<SafetyResult> => {
    setIsChecking(true);
    
    try {
      const response = await fetch('/api/content-safety-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, subject })
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        isSafe: false,
        reason: 'Unable to verify content safety',
        safetyScore: 0
      };
    } finally {
      setIsChecking(false);
    }
  }, []);

  return { checkContent, isChecking };
}