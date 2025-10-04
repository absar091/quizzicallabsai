'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, CreditCard } from 'lucide-react';

export default function MockPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const description = searchParams.get('description');

  const handlePaymentSuccess = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirect to success page
    router.push(`/payment/success?orderId=${orderId}&mock=true`);
  };

  const handlePaymentCancel = () => {
    router.push(`/payment/cancelled?orderId=${orderId}&mock=true`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Mock Payment Gateway</CardTitle>
          <CardDescription>
            This is a mock payment page for development testing
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Order ID:</span>
              <span className="text-sm font-mono">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Amount:</span>
              <span className="text-sm font-semibold">
                ${amount ? (parseInt(amount) / 100).toFixed(2) : '0.00'} USD
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Description:</span>
              <span className="text-sm">{description}</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Development Mode:</strong> This is a mock payment gateway for testing. 
              No real payment will be processed.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handlePaymentSuccess}
              disabled={processing}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Simulate Successful Payment
                </>
              )}
            </Button>

            <Button
              onClick={handlePaymentCancel}
              disabled={processing}
              variant="outline"
              className="w-full"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Payment
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Mock SafePay Gateway • Development Environment
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}