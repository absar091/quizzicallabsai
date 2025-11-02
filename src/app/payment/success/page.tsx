'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'failed' | null>(null);

  const orderId = searchParams.get('orderId');
  const planId = searchParams.get('planId');
  const isWhop = searchParams.get('whop') === 'true';
  const isMock = searchParams.get('mock') === 'true';

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    const sendConfirmationEmail = async () => {
      try {
        // Get user info from auth context or localStorage
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        
        if (userInfo.email) {
          const response = await fetch('/api/notifications/subscription-confirmed', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              idToken: userInfo.idToken,
              userEmail: userInfo.email,
              userName: userInfo.name || userInfo.displayName,
              planName: 'Pro Plan',
              amount: '2.00',
              currency: 'USD',
              orderId: orderId
            })
          });

          const result = await response.json();
          console.log('Confirmation email result:', result);
        }
      } catch (error) {
        console.error('Failed to send confirmation email:', error);
      }
    };

    // Simulate verification process and send email
    const timer = setTimeout(async () => {
      setIsVerifying(false);
      setVerificationStatus('success');
      
      // Send confirmation email after successful verification
      if (!isMock) {
        await sendConfirmationEmail();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [orderId, router, isMock]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verifying Payment
          </h1>
          <p className="text-gray-600">
            Please wait while we confirm your payment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your payment. Your subscription has been activated successfully.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <p className="font-mono text-sm text-gray-900">{orderId}</p>
            {planId && (
              <>
                <p className="text-sm text-gray-500 mb-1 mt-2">Plan</p>
                <p className="text-sm text-gray-900 capitalize">{planId} Plan</p>
              </>
            )}
            {isMock && (
              <div className="mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                Mock Payment (Development)
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Home
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            You will receive a confirmation email shortly.
          </p>
        </div>
      </div>
    </div>
  );
}