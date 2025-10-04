'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle, Zap } from 'lucide-react';

export default function SafePayDebugPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const testConnectivity = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      console.log('🧪 Testing SafePay connectivity...');
      
      const response = await fetch('/api/test-safepay', {
        method: 'GET'
      });

      const data = await response.json();
      console.log('📥 SafePay test result:', data);

      setTestResult(data);

      if (data.success) {
        toast({
          title: 'SafePay Test Successful!',
          description: 'API connectivity is working properly',
        });
      } else {
        toast({
          title: 'SafePay Test Failed',
          description: data.error || 'Unknown error occurred',
          variant: 'destructive'
        });
      }

    } catch (error: any) {
      console.error('❌ SafePay test error:', error);
      
      const errorResult = {
        success: false,
        error: error.message,
        type: 'Network Error',
        timestamp: new Date().toISOString()
      };

      setTestResult(errorResult);

      toast({
        title: 'Network Error',
        description: 'Failed to connect to SafePay test endpoint',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const testPaymentCreation = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      console.log('🧪 Testing SafePay payment creation...');
      
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
      console.log('📥 SafePay payment test result:', data);

      setTestResult(data);

      if (data.success) {
        toast({
          title: 'Payment Test Successful!',
          description: 'SafePay payment creation is working',
        });
      } else {
        toast({
          title: 'Payment Test Failed',
          description: data.error || 'Payment creation failed',
          variant: 'destructive'
        });
      }

    } catch (error: any) {
      console.error('❌ SafePay payment test error:', error);
      
      const errorResult = {
        success: false,
        error: error.message,
        type: 'Network Error',
        timestamp: new Date().toISOString()
      };

      setTestResult(errorResult);

      toast({
        title: 'Network Error',
        description: 'Failed to test payment creation',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">SafePay Integration Debug</h1>
          <p className="text-muted-foreground mt-2">
            Test SafePay API connectivity and payment creation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                API Connectivity Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Test basic connectivity to SafePay API and verify credentials
              </p>
              <Button 
                onClick={testConnectivity}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test API Connectivity'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                Payment Creation Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Test creating a SafePay payment session for Pro subscription
              </p>
              <Button 
                onClick={testPaymentCreation}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Payment Creation'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Environment Check</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800">
            <div className="space-y-2">
              <p><strong>Expected Environment Variables:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>SAFEPAY_API_KEY (starts with 'sec_')</li>
                <li>SAFEPAY_SECRET_KEY (long hex string)</li>
                <li>SAFEPAY_ENVIRONMENT ('sandbox' or 'production')</li>
                <li>NEXT_PUBLIC_APP_URL (your app URL)</li>
              </ul>
              <p className="mt-4"><strong>Current Environment:</strong> {process.env.NODE_ENV}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}