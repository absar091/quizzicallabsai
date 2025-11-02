'use client';

export default function TestWhopSimplePage() {
  const planId = process.env.NEXT_PUBLIC_WHOP_PRO_PLAN_ID || 'plan_m7YM780QOrUbK';

  console.log('🔍 Test Whop Plan ID:', planId);

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Whop Integration Test (Simple)</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Debug Info:</h2>
        <p><strong>Plan ID:</strong> {planId}</p>
        <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
        <p><strong>App URL:</strong> {process.env.NEXT_PUBLIC_APP_URL}</p>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-4">Whop Checkout URL:</h2>
        <p className="mb-4">
          Since the Whop React component has TypeScript issues, you can test the checkout directly:
        </p>
        <a 
          href={`https://whop.com/checkout/${planId}?d2c=true`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open Whop Checkout (External)
        </a>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold text-yellow-800 mb-2">TypeScript Issue</h3>
        <p className="text-yellow-700 text-sm">
          The @whop/checkout package has module resolution issues with the current TypeScript setup. 
          The checkout functionality will work, but we need to resolve the import issues.
        </p>
      </div>
    </div>
  );
}