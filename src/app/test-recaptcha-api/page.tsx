'use client';

import { useState } from 'react';

export default function TestRecaptchaAPIPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testBypassToken = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recaptcha/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: 'whop-bypass-token', 
          action: 'test' 
        })
      });

      const result = await response.json();
      setTestResult(result);
      console.log('Bypass token test result:', result);
    } catch (error) {
      console.error('Test error:', error);
      setTestResult({ success: false, error: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const testInvalidToken = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recaptcha/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: 'invalid-token-test', 
          action: 'test' 
        })
      });

      const result = await response.json();
      setTestResult(result);
      console.log('Invalid token test result:', result);
    } catch (error) {
      console.error('Test error:', error);
      setTestResult({ success: false, error: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">reCAPTCHA v3 API Test</h1>
      
      <div className="grid gap-6">
        {/* Configuration Check */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Configuration Status:</h2>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Site Key:</strong> {process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY ? '✅ Configured' : '❌ Not Set'}
            </p>
            <p>
              <strong>Site Key Value:</strong> {process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY || 'Not configured'}
            </p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-4">API Tests:</h2>
          <div className="space-x-4">
            <button
              onClick={testBypassToken}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Testing...' : 'Test Whop Bypass Token'}
            </button>
            
            <button
              onClick={testInvalidToken}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
            >
              {loading ? 'Testing...' : 'Test Invalid Token'}
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-2">Test Result:</h2>
            <div className={`p-4 rounded ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="font-semibold mb-2">Test Scenarios:</h2>
          <ul className="text-sm space-y-1">
            <li>• <strong>Whop Bypass Token:</strong> Should return success: true, score: 0.9, isHuman: true</li>
            <li>• <strong>Invalid Token:</strong> Should return success: false with error message</li>
            <li>• <strong>Real Token:</strong> Visit /test-recaptcha-v3 for full reCAPTCHA v3 testing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}