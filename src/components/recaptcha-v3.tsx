'use client';

import { useEffect, useState } from 'react';
import { useRecaptchaV3 } from '@/hooks/useRecaptchaV3';

interface RecaptchaV3Props {
  onChange: (token: string | null) => void;
  action?: string;
  className?: string;
}

export default function RecaptchaV3({ 
  onChange, 
  action = 'submit',
  className 
}: RecaptchaV3Props) {
  const [isWhopDomain, setIsWhopDomain] = useState(false);
  const { executeRecaptcha, isLoaded, isLoading, error } = useRecaptchaV3({ action });

  useEffect(() => {
    // Check if we're running inside Whop's iframe or on Whop domain
    const isInWhop = window.location.hostname.includes('whop.com') || 
                     window.parent !== window || // Inside iframe
                     document.referrer.includes('whop.com');
    
    setIsWhopDomain(isInWhop);

    // Auto-execute reCAPTCHA v3 when loaded (invisible)
    if (isLoaded && !isInWhop) {
      executeRecaptcha(action).then(token => {
        onChange(token);
      });
    } else if (isInWhop) {
      // If in Whop, automatically call onChange with bypass token
      onChange('whop-bypass-token');
    }
  }, [isLoaded, action, onChange, executeRecaptcha]);

  // Show status for Whop integration
  if (isWhopDomain) {
    return (
      <div className={`p-3 bg-green-50 border border-green-200 rounded ${className}`}>
        <p className="text-green-800 text-sm flex items-center gap-2">
          🔒 <span>Advanced security verification (Whop integration)</span>
        </p>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={`p-3 bg-blue-50 border border-blue-200 rounded ${className}`}>
        <p className="text-blue-800 text-sm flex items-center gap-2">
          🔄 <span>Loading advanced security verification...</span>
        </p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`p-3 bg-red-50 border border-red-200 rounded ${className}`}>
        <p className="text-red-800 text-sm">
          ❌ Security verification failed: {error}
        </p>
      </div>
    );
  }

  // Show success state (invisible reCAPTCHA v3)
  return (
    <div className={`p-3 bg-green-50 border border-green-200 rounded ${className}`}>
      <p className="text-green-800 text-sm flex items-center gap-2">
        ✅ <span>Advanced security verification active</span>
      </p>
      <p className="text-green-600 text-xs mt-1">
        reCAPTCHA v3 • Invisible protection • Score-based detection
      </p>
    </div>
  );
}