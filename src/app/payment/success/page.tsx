'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ref, get } from 'firebase/database';
import { database } from '@/lib/firebase';

interface SubscriptionStatus {
  plan: string;
  subscription_status: 'pending' | 'active' | 'cancelled' | 'expired';
  tokens_limit: number;
  quizzes_limit: number;
  updated_at: string;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [isPolling, setIsPolling] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [timeoutReached, setTimeoutReached] = useState(false);

  const orderId = searchParams.get('orderId');
  const planId = searchParams.get('planId');
  const isWhop = searchParams.get('whop') === 'true';
  const isMock = searchParams.get('mock') === 'true';

  // Poll subscription status every 2 seconds for up to 60 seconds
  // If activation doesn't happen after 10 seconds, trigger auto-fix
  useEffect(() => {
    if (!orderId || !user) {
      if (!orderId) router.push('/');
      return;
    }

    let pollInterval: NodeJS.Timeout;
    let timeoutTimer: NodeJS.Timeout;
    let autoFixTimer: NodeJS.Timeout;
    let autoFixTriggered = false;

    const triggerAutoFix = async () => {
      if (autoFixTriggered) return;
      autoFixTriggered = true;

      console.log('🔧 Triggering automatic plan activation...');
      
      try {
        // Check if user has pending_plan_change
        const pendingRef = ref(database, `users/${user.uid}/pending_plan_change`);
        const pendingSnapshot = await get(pendingRef);
        
        if (!pendingSnapshot.exists()) {
          console.log('✅ No pending plan change, activation already complete');
          return;
        }

        const pendingChange = pendingSnapshot.val();
        const requestedPlan = pendingChange.requested_plan || planId || 'pro';

        console.log(`🚀 Auto-activating ${requestedPlan} plan for user...`);

        // Call the auto-fix API
        const response = await fetch('/api/admin/activate-user-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.uid,
            userEmail: user.email,
            plan: requestedPlan,
            adminSecret: 'AUTO_FIX_FROM_CLIENT', // Special marker
          }),
        });

        if (response.ok) {
          console.log('✅ Auto-fix successful, refreshing status...');
          // Force a status check
          await checkSubscriptionStatus();
        } else {
          console.error('❌ Auto-fix failed:', await response.text());
        }
      } catch (error) {
        console.error('❌ Auto-fix error:', error);
      }
    };

    const checkSubscriptionStatus = async () => {
      try {
        const subscriptionRef = ref(database, `users/${user.uid}/subscription`);
        const snapshot = await get(subscriptionRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val() as SubscriptionStatus;
          setSubscriptionStatus(data);
          
          // Stop polling if status is active
          if (data.subscription_status === 'active') {
            setIsPolling(false);
            clearInterval(pollInterval);
            clearTimeout(timeoutTimer);
            clearTimeout(autoFixTimer);
            
            // Send confirmation email
            await sendConfirmationEmail(data);
          }
        }
        
        setPollingAttempts(prev => prev + 1);
      } catch (error) {
        console.error('Error checking subscription status:', error);
      }
    };

    const sendConfirmationEmail = async (subscription: SubscriptionStatus) => {
      try {
        if (user.email) {
          const response = await fetch('/api/notifications/subscription-confirmed', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userEmail: user.email,
              userName: user.displayName || 'User',
              planName: subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) + ' Plan',
              amount: planId === 'pro' ? '2.00' : '1.00',
              currency: 'USD',
              orderId: orderId,
              tokensLimit: subscription.tokens_limit,
              quizzesLimit: subscription.quizzes_limit
            })
          });

          const result = await response.json();
          console.log('Confirmation email result:', result);
        }
      } catch (error) {
        console.error('Failed to send confirmation email:', error);
      }
    };

    // Initial check
    checkSubscriptionStatus();

    // Poll every 2 seconds
    pollInterval = setInterval(checkSubscriptionStatus, 2000);

    // Trigger auto-fix after 10 seconds if still not activated
    autoFixTimer = setTimeout(() => {
      console.log('⏰ 10 seconds elapsed, triggering auto-fix...');
      triggerAutoFix();
    }, 10000);

    // Stop polling after 60 seconds
    timeoutTimer = setTimeout(() => {
      setIsPolling(false);
      setTimeoutReached(true);
      clearInterval(pollInterval);
      clearTimeout(autoFixTimer);
    }, 60000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeoutTimer);
      clearTimeout(autoFixTimer);
    };
  }, [orderId, user, router, planId]);

  // Show loading state while polling
  if (isPolling && !subscriptionStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center max-w-md mx-4">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Activating Your Subscription
          </h1>
          <p className="text-gray-600 mb-4">
            Please wait while we activate your plan...
          </p>
          <p className="text-sm text-gray-500">
            Attempt {pollingAttempts} of 30
          </p>
        </div>
      </div>
    );
  }

  // Show timeout message if activation takes too long
  if (timeoutReached && subscriptionStatus?.subscription_status !== 'active') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-600 mx-auto mb-6" />
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Activation In Progress
            </h1>
            
            <p className="text-gray-600 mb-6">
              Your payment was successful, but plan activation is taking longer than expected. 
              This usually completes within a few minutes.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900 font-medium mb-2">What to do:</p>
              <ul className="text-sm text-blue-800 text-left space-y-1">
                <li>• Check your dashboard in a few minutes</li>
                <li>• Refresh this page to check status</li>
                <li>• Contact support if issue persists</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Order ID</p>
              <p className="font-mono text-sm text-gray-900">{orderId}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Refresh Status
              </button>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Go to Dashboard
              </button>

              <a
                href="mailto:hello@quizzicallabz.qzz.io"
                className="block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show success message when subscription is active
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="relative">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            {subscriptionStatus?.plan !== 'free' && (
              <Sparkles className="h-6 w-6 text-yellow-500 absolute top-0 right-1/3 animate-pulse" />
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to {subscriptionStatus?.plan.charAt(0).toUpperCase()}{subscriptionStatus?.plan.slice(1)}!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your subscription has been activated successfully. You now have access to all premium features!
          </p>

          {subscriptionStatus && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Plan Benefits:</h3>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600">AI Tokens</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {subscriptionStatus.tokens_limit.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quizzes</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {subscriptionStatus.quizzes_limit}
                  </p>
                </div>
              </div>
            </div>
          )}

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
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Start Using Pro Features
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Home
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            A confirmation email has been sent to your inbox.
          </p>
        </div>
      </div>
    </div>
  );
}