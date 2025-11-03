'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { loadRecaptchaScript } from '@/lib/recaptcha-v3';

interface RecaptchaV3ContextType {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

const RecaptchaV3Context = createContext<RecaptchaV3ContextType>({
  isLoaded: false,
  isLoading: false,
  error: null
});

export const useRecaptchaV3Context = () => useContext(RecaptchaV3Context);

interface RecaptchaV3ProviderProps {
  children: ReactNode;
  siteKey?: string;
}

export function RecaptchaV3Provider({ children, siteKey }: RecaptchaV3ProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeRecaptcha = async () => {
      try {
        console.log('🔄 reCAPTCHA v3: Initializing provider...');
        
        await loadRecaptchaScript();
        
        setIsLoaded(true);
        setError(null);
        console.log('✅ reCAPTCHA v3: Provider initialized successfully');
      } catch (err: any) {
        setError(err.message || 'Failed to initialize reCAPTCHA v3');
        console.error('❌ reCAPTCHA v3: Provider initialization failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeRecaptcha();
  }, [siteKey]);

  return (
    <RecaptchaV3Context.Provider value={{ isLoaded, isLoading, error }}>
      {children}
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-black/80 text-white text-xs p-2 rounded">
            reCAPTCHA v3: {isLoading ? 'Loading...' : isLoaded ? '✅ Ready' : '❌ Error'}
            {error && <div className="text-red-300">Error: {error}</div>}
          </div>
        </div>
      )}
    </RecaptchaV3Context.Provider>
  );
}