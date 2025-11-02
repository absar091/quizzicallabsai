'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface WhopEmbeddedCheckoutProps {
  planId: string;
  userEmail?: string;
  userName?: string;
  onComplete?: (planId: string, receiptId: string) => void;
  className?: string;
}

export default function WhopEmbeddedCheckout({ 
  planId, 
  userEmail, 
  userName,
  onComplete,
  className = ''
}: WhopEmbeddedCheckoutProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create Whop checkout URL with parameters
    const checkoutUrl = new URL(`https://whop.com/checkout/${planId}`);
    
    // Add required d2c parameter for direct-to-consumer checkout
    checkoutUrl.searchParams.set('d2c', 'true');
    
    // Add user information if available
    if (userEmail) {
      checkoutUrl.searchParams.set('prefill_email', userEmail);
    }
    if (userName) {
      checkoutUrl.searchParams.set('prefill_name', userName);
    }
    
    // Add success/cancel URLs
    checkoutUrl.searchParams.set('success_url', `${window.location.origin}/payment/success`);
    checkoutUrl.searchParams.set('cancel_url', `${window.location.origin}/pricing`);

    // Set iframe source
    if (iframeRef.current) {
      iframeRef.current.src = checkoutUrl.toString();
    }

    // Handle iframe load
    const handleIframeLoad = () => {
      setIsLoading(false);
      setError(null);
    };

    // Handle iframe error
    const handleIframeError = () => {
      setIsLoading(false);
      setError('Failed to load checkout. Please try again.');
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
      iframe.addEventListener('error', handleIframeError);

      return () => {
        iframe.removeEventListener('load', handleIframeLoad);
        iframe.removeEventListener('error', handleIframeError);
      };
    }
  }, [planId, userEmail, userName]);

  // Listen for messages from Whop iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from Whop domains
      if (!event.origin.includes('whop.com')) return;

      if (event.data.type === 'whop_checkout_complete') {
        console.log('🎉 Whop checkout completed:', event.data);
        if (onComplete) {
          onComplete(event.data.planId || planId, event.data.receiptId || 'unknown');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [planId, onComplete]);

  if (error) {
    return (
      <div className={`p-8 text-center border-2 border-red-200 rounded-lg ${className}`}>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setIsLoading(true);
            if (iframeRef.current) {
              iframeRef.current.src = iframeRef.current.src; // Reload iframe
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
        <div className="mt-4">
          <a
            href={`https://whop.com/checkout/${planId}?d2c=true`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Open in New Tab
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10 rounded-lg">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading secure checkout...</p>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        className="w-full h-full min-h-[600px] border-0 rounded-lg"
        title="Whop Checkout"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
        loading="lazy"
      />

      <div className="mt-2 text-center">
        <p className="text-xs text-gray-500">
          Secure payment powered by Whop • Plan ID: {planId}
        </p>
      </div>
    </div>
  );
}