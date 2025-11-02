'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { ArrowLeft, Shield, ExternalLink } from 'lucide-react';
import Link from 'next/link';

function DirectCheckoutContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const planId = params.planId as string;
  const userEmail = searchParams.get('email') || '';
  const userName = searchParams.get('name') || '';

  // Your actual Whop plan ID
  const whopPlanId = 'plan_m7YM780QOrUbK';

  // Auto-redirect to Whop checkout
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = `https://whop.com/checkout/${whopPlanId}?d2c=true`;
    }, 3000);

    return () => clearTimeout(timer);
  }, [whopPlanId]);

  const redirectNow = () => {
    window.location.href = `https://whop.com/checkout/${whopPlanId}?d2c=true`;
  };

  if (!planId || (planId !== 'pro' && planId !== 'premium')) {
    return (
      <div className="container py-12 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Plan</h1>
        <p className="text-gray-600 mb-6">The requested plan was not found.</p>
        <Link 
          href="/pricing" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pricing
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Redirecting to Secure Checkout
            </h1>
            <p className="text-gray-600">
              You'll be redirected to Whop's secure payment page
            </p>
          </div>

          {/* Plan Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-lg mb-1">Pro Plan</h3>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              $2<span className="text-sm font-normal text-gray-600">/month</span>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Plan ID: {whopPlanId}</p>
              {userEmail && <p>Email: {userEmail}</p>}
            </div>
          </div>

          {/* Loading Animation */}
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-sm text-gray-600">
              Redirecting in 3 seconds...
            </p>
          </div>

          {/* Manual Redirect Button */}
          <button
            onClick={redirectNow}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-4"
          >
            <ExternalLink className="h-4 w-4" />
            Continue to Payment
          </button>

          {/* Back Link */}
          <Link 
            href="/pricing" 
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Pricing
          </Link>

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-xs">
              🔒 Secure payment processing by Whop
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DirectCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    }>
      <DirectCheckoutContent />
    </Suspense>
  );
}