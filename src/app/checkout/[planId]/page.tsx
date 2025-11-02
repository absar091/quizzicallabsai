'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import WhopEmbeddedCheckout from '@/components/whop-embedded-checkout';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Shield, CreditCard, Globe } from 'lucide-react';
import Link from 'next/link';

function CheckoutContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const planId = params.planId as string;
  const userEmail = searchParams.get('email') || '';
  const userName = searchParams.get('name') || '';

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

  const planDetails = {
    pro: {
      name: 'Pro Plan',
      price: '$2',
      interval: 'month',
      description: 'Perfect for serious students',
      features: [
        'Unlimited AI-generated quizzes',
        'Advanced quiz types & formats',
        'Premium AI model (GPT-4)',
        'Priority support',
        'Advanced study guides',
        'Export to PDF',
        'No ads'
      ]
    },
    premium: {
      name: 'Premium Plan',
      price: '$5',
      interval: 'month',
      description: 'Ultimate learning experience',
      features: [
        'Everything in Pro',
        'Advanced analytics & insights',
        'Custom quiz templates',
        'Team collaboration',
        'API access',
        'White-label options',
        'Dedicated support'
      ]
    }
  };

  const plan = planDetails[planId as keyof typeof planDetails];

  const handleCheckoutComplete = (planId: string, receiptId: string) => {
    // Redirect to success page with receipt information
    window.location.href = `/payment/success?orderId=${receiptId}&planId=${planId}&whop=true`;
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/pricing" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pricing
        </Link>
        
        <PageHeader 
          title={`Subscribe to ${plan.name}`}
          description="Complete your subscription with secure payment"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Plan Summary */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {plan.price}
                  <span className="text-lg font-normal text-gray-600">/{plan.interval}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">What's included:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Security Features */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Secure Payment
              </h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Powered by Whop</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>PCI DSS compliant</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Whop Checkout */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4">Complete Your Purchase</h4>
              <WhopEmbeddedCheckout
                planId="plan_m7YM780QOrUbK"
                userEmail={userEmail}
                userName={userName}
                onComplete={handleCheckoutComplete}
                className="min-h-[500px]"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          By subscribing, you agree to our{' '}
          <Link href="/terms" className="text-blue-600 hover:text-blue-700">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="container py-12 max-w-2xl mx-auto text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}