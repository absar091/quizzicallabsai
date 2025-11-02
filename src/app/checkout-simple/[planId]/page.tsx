'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CheckoutContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const planId = params.planId as string;
  const userEmail = searchParams.get('email') || '';
  const userName = searchParams.get('name') || '';

  // Your actual Whop plan ID
  const whopPlanId = 'plan_m7YM780QOrUbK';

  const openWhopCheckout = () => {
    // Direct redirect to Whop checkout - CORRECT URL WITH D2C
    window.open(`https://whop.com/checkout/${whopPlanId}?d2c=true`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Subscribe to Pro Plan
          </h1>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            $2<span className="text-lg font-normal text-gray-600">/month</span>
          </div>
          <p className="text-gray-600">Perfect for serious students</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Unlimited AI-generated quizzes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Premium AI model (GPT-4)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Priority support</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">No ads</span>
          </div>
        </div>

        <button
          onClick={openWhopCheckout}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors mb-4"
        >
          💳 Pay Now - $2/month
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            Secure payment powered by Whop
          </p>
          <p className="text-xs text-gray-400">
            Plan ID: {whopPlanId}
          </p>
        </div>

        <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800 text-sm font-medium">
            ✅ This checkout works! Click "Pay Now" to complete payment.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SimpleCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-xl">Loading...</div></div>}>
      <CheckoutContent />
    </Suspense>
  );
}