'use client';

import { useEffect } from 'react';

export default function TestWhopNoCSPPage() {
  const planId = process.env.NEXT_PUBLIC_WHOP_PRO_PLAN_ID || 'plan_m7YM780QOrUbK';

  useEffect(() => {
    // Inject Whop checkout script directly
    const script = document.createElement('script');
    script.src = 'https://checkout.whop.com/embed.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup
      document.head.removeChild(script);
    };
  }, []);

  const openWhopCheckout = () => {
    // Direct redirect to Whop checkout
    window.open(`https://checkout.whop.com/${planId}`, '_blank');
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Whop Integration Test (No CSP)</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Debug Info:</h2>
        <p><strong>Plan ID:</strong> {planId}</p>
        <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
        <p><strong>App URL:</strong> {process.env.NEXT_PUBLIC_APP_URL}</p>
      </div>

      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-4">Direct Whop Checkout Link:</h2>
          <button
            onClick={openWhopCheckout}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Whop Checkout (New Tab)
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-4">Embedded Whop Checkout (Manual):</h2>
          <div 
            id="whop-checkout-container"
            className="min-h-[400px] border-2 border-dashed border-gray-300 rounded p-4"
          >
            <p className="text-center text-gray-500 mt-20">
              Whop checkout will load here...
            </p>
          </div>
          <button
            onClick={() => {
              const container = document.getElementById('whop-checkout-container');
              if (container) {
                container.innerHTML = `
                  <iframe 
                    src="https://checkout.whop.com/${planId}" 
                    width="100%" 
                    height="600" 
                    frameborder="0"
                    style="border: none; border-radius: 8px;"
                  ></iframe>
                `;
              }
            }}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Load Checkout Iframe
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-blue-800 mb-2">Testing Notes</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• This page bypasses CSP restrictions for testing</li>
          <li>• The direct link should always work</li>
          <li>• The iframe test will show if embedding works</li>
          <li>• Check browser console for any errors</li>
        </ul>
      </div>
    </div>
  );
}