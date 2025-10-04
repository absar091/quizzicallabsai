'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SafePayDebugPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSafePayConnectivity = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/test-safepay', {
        method: 'GET'
      });
      
      const data = await response.json();
      setTestResult(data);
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.message,
        type: 'Network Error'
      });
    } finally {
      setLoading(false);
    }
  };

  const testPaymentCreation = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/test-safepay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: 200,
          planId: 'pro'
        })
      });
      
      const data = await response.json();
      setTestResult(data);
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.message,
        type: 'Network Error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>SafePay Integration Debug</CardTitle>
            <CardDescription>
              Test SafePay connectivity and payment creation
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={testSafePayConnectivity}
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Testing...' : 'Test API Connectivity'}
              </Button>
              
              <Button
                onClick={testPaymentCreation}
                disabled={loading}
              >
                {loading ? 'Testing...' : 'Test Payment Creation'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Environment Variables</h3>
                <div className="space-y-1">
                  <div>API Key: <Badge variant="secondary">Set</Badge></div>
                  <div>Secret Key: <Badge variant="secondary">Set</Badge></div>
                  <div>Environment: <Badge>sandbox</Badge></div>
                  <div>Mock Mode: <Badge variant="outline">Enabled</Badge></div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Expected Behavior</h3>
                <div className="text-gray-600 space-y-1">
                  <div>• Mock service should be used</div>
                  <div>• Payment URL should be local</div>
                  <div>• No real API calls made</div>
                  <div>• Success response expected</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Test Result
                <Badge variant={testResult.success ? 'default' : 'destructive'}>
                  {testResult.success ? 'Success' : 'Failed'}
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}