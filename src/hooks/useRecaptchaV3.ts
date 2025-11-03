'use client';

import { useEffect, useState, useCallback } from 'react';
import { executeRecaptcha, loadRecaptchaScript } from '@/lib/recaptcha-v3';

export interface UseRecaptchaV3Options {
  action?: string;
  autoLoad?: boolean;
}

export interface UseRecaptchaV3Return {
  executeRecaptcha: (action?: string) => Promise<string | null>;
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useRecaptchaV3(options: UseRecaptchaV3Options = {}): UseRecaptchaV3Return {
  const { action = 'submit', autoLoad = true } = options;
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load reCAPTCHA script on mount
  useEffect(() => {
    if (!autoLoad) return;

    const loadScript = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        await loadRecaptchaScript();
        
        setIsLoaded(true);
        console.log('✅ reCAPTCHA v3: Hook initialized successfully');
      } catch (err: any) {
        setError(err.message || 'Failed to load reCAPTCHA v3');
        console.error('❌ reCAPTCHA v3: Hook initialization failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadScript();
  }, [autoLoad]);

  // Execute reCAPTCHA challenge
  const execute = useCallback(async (customAction?: string): Promise<string | null> => {
    try {
      const actionToUse = customAction || action;
      console.log(`🔄 reCAPTCHA v3: Executing challenge for action: ${actionToUse}`);
      
      const token = await executeRecaptcha(actionToUse);
      
      if (token) {
        console.log('✅ reCAPTCHA v3: Challenge completed successfully');
      } else {
        console.warn('⚠️ reCAPTCHA v3: No token received');
      }
      
      return token;
    } catch (err: any) {
      const errorMessage = err.message || 'reCAPTCHA execution failed';
      setError(errorMessage);
      console.error('❌ reCAPTCHA v3: Execution error:', err);
      return null;
    }
  }, [action]);

  return {
    executeRecaptcha: execute,
    isLoaded,
    isLoading,
    error
  };
}

// Specialized hooks for common actions
export const useRecaptchaLogin = () => useRecaptchaV3({ action: 'login' });
export const useRecaptchaRegister = () => useRecaptchaV3({ action: 'register' });
export const useRecaptchaSubmit = () => useRecaptchaV3({ action: 'submit' });
export const useRecaptchaPayment = () => useRecaptchaV3({ action: 'payment' });