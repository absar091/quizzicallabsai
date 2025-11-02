'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { getWhopPlanId } from '@/lib/whop';

interface WhopCheckoutProps {
  planType: 'pro' | 'premium';
  userEmail?: string;
  userName?: string;
  onComplete?: (planId: string, receiptId: string) => void;
  className?: string;
}

export default function WhopCheckout({ 
  planType, 
  userEmail, 
  userName,
  onComplete,
  className = ''
}: WhopCheckoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [WhopCheckoutEmbed, setWhopCheckoutEmbed] = useState<any>(null);

  const planId = getWhopPlanId(planType);
  
  console.log('🔍 Whop Plan Debug:', {
    planType,
    planId,
    proPlanId: process.env.WHOP_PRO_PRODUCT_ID,
    premiumPlanId: process.env.WHOP_PREMIUM_PRODUCT_ID
  });

  // Dynamically import Whop component to avoid TypeScript issues
  useEffect(() => {
    const loadWhopComponent = async () => {
      try {
        const whopModule = await import('@whop/checkout/react');
        setWhopCheckoutEmbed(() => whopModule.WhopCheckoutEmbed);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load Whop component:', error);
        setError('Failed to load checkout component');
        setIsLoading(false);
      }
    };

    loadWhopComponent();
  }, []);

  if (!planId) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-red-600 mb-4">
          <h3 className="font-semibold text-lg mb-2">Plan Not Configured</h3>
          <p className="text-sm">
            The {planType} plan ID is not configured in the environment variables.
          </p>
        </div>
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p className="font-mono">
            Missing: WHOP_{planType.toUpperCase()}_PRODUCT_ID
          </p>
          <p className="mt-1">
            Please add this to your .env.local file with your Whop plan ID.
          </p>
        </div>
      </div>
    );
  }

  const handleComplete = (planId: string, receiptId: string) => {
    console.log('🎉 Whop checkout completed:', { planId, receiptId });
    
    if (onComplete) {
      onComplete(planId, receiptId);
    } else {
      // Default redirect to success page
      window.location.href = `/payment/success?orderId=${receiptId}&planId=${planId}`;
    }
  };

  const handleError = (error: any) => {
    console.error('❌ Whop checkout error:', error);
    setError('Failed to load checkout. Please try again.');
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading secure checkout...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      )}

      {!error && WhopCheckoutEmbed && (
        <WhopCheckoutEmbed
          planId={planId}
          theme="light"
          hidePrice={false}
          hideTermsAndConditions={false}
          skipRedirect={true}
          onComplete={handleComplete}
          prefill={{
            email: userEmail,
          }}
          hideEmail={!!userEmail}
          disableEmail={!!userEmail}
          utm={{
            utm_source: 'quizzicallabz',
            utm_medium: 'website',
            utm_campaign: `${planType}_subscription`,
            utm_content: 'pricing_page'
          }}
          fallback={
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          }
          onError={handleError}
        />
      )}

      {!error && !WhopCheckoutEmbed && !isLoading && (
        <div className="p-8 text-center">
          <p className="text-gray-600 mb-4">
            Whop checkout component failed to load. You can still checkout directly:
          </p>
          <a 
            href={`https://checkout.whop.com/${planId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Checkout
          </a>
        </div>
      )}
    </div>
  );
}