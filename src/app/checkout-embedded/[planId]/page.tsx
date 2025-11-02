'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import WhopEmbeddedCheckout from '@/components/whop-embedded-checkout';
import { ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

function EmbeddedCheckoutContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const planId = params.planId as string;
  const userEmail = searchParams.get('email') || '';
  const userName = searchParams.get('name') || '';

  // Your actual Whop plan ID
  const whopPlanId = 'plan_m7YM780QOrUbK';

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

  const handleCheckoutComplete = (planId: string, receiptId: string) => {
    console.log('🎉 Checkout completed:', { planId, receiptId });
    // Redirect to success page
    window.location.href = `/payment/success?orderId=${receiptId}&planId=${planId}&whop=true`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/pricing" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pricing
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Subscribe to Pro Plan</h1>
            <p className="text-gray-600">Complete your subscription with embedded checkout</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Plan Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Pro Plan</h3>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  $2<span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 text-sm">Perfect for serious students</p>
              </div>

              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-sm">What's included:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    Unlimited AI-generated quizzes
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    Premium AI model (GPT-4)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    Priority support
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    No ads
                  </li>
                </ul>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Secure payment by Whop</span>
              </div>
            </div>
          </div>

          {/* Embedded Checkout */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h4 className="font-semibold mb-4">Complete Your Purchase</h4>
              
              <WhopEmbeddedCheckout
                planId={whopPlanId}
                userEmail={userEmail}
                userName={userName}
                onComplete={handleCheckoutComplete}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-4">
          <h5 className="font-medium mb-2 text-sm">Debug Information:</h5>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Plan:</strong> {planId}</p>
            <p><strong>Whop Plan ID:</strong> {whopPlanId}</p>
            <p><strong>User Email:</strong> {userEmail || 'Not provided'}</p>
            <p><strong>User Name:</strong> {userName || 'Not provided'}</p>
            <p><strong>CSP:</strong> Disabled for development</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmbeddedCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    }>
      <EmbeddedCheckoutContent />
    </Suspense>
  );
}