import { useCallback } from 'react';

export function useSafeAsync() {
  const safeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    fallback?: T
  ): Promise<T | undefined> => {
    try {
      return await asyncFn();
    } catch (error) {
      console.warn('Async operation failed (non-fatal):', error);
      return fallback;
    }
  }, []);

  const safeCall = useCallback(<T>(
    fn: () => T,
    fallback?: T
  ): T | undefined => {
    try {
      return fn();
    } catch (error) {
      console.warn('Function call failed (non-fatal):', error);
      return fallback;
    }
  }, []);

  return { safeAsync, safeCall };
}