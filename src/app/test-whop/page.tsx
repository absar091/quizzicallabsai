'use client';

import { WhopCheckoutEmbed } from '@whop/checkout/react';

export default function TestWhopPage() {
  const planId = process.env.NEXT_PUBLIC_WHOP_PRO_PLAN_ID || 'plan_m7YM780QOrUbK';

  console.log('🔍 Test Whop Plan ID:', planId);

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Whop Integration Test</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Debug Info:</h2>
        <p><strong>Plan ID:</strong> {planId}</p>
        <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-4">Direct Whop Checkout Embed:</h2>
        <WhopCheckoutEmbed 
          planId={planId}
          theme="light"
          fallback={<div className="p-8 text-center">Loading Whop checkout...</div>}
          onComplete={(planId, receiptId) => {
            console.log('✅ Checkout completed:', { planId, receiptId });
            alert(`Checkout completed! Plan: ${planId}, Receipt: ${receiptId}`);
          }}
        />
      </div>
    </div>
  );
}