'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function SubscriptionInitializer() {
  const { user } = useAuth();
  const [initializing, setInitializing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [autoInitAttempted, setAutoInitAttempted] = useState(false);

  // Auto-initialize on mount
  useEffect(() => {
    if (user && !autoInitAttempted && !initializing) {
      setAutoInitAttempted(true);
      console.log('🔄 Auto-initializing subscription for new user...');
      handleInitialize();
    }
  }, [user, autoInitAttempted, initializing]);

  const handleInitialize = async () => {
    if (!user) {
      setStatus('error');
      setMessage('Please sign in first');
      return;
    }

    setInitializing(true);
    setStatus('idle');

    try {
      // Get Firebase token
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      const token = await currentUser.getIdToken();

      // Initialize subscription
      const response = await fetch('/api/subscription/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize subscription');
      }

      setStatus('success');
      setMessage('Subscription initialized successfully! Refreshing...');
      
      console.log('✅ Subscription auto-initialized successfully');
      
      // Reload page after 1 second
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error: any) {
      console.error('Failed to initialize subscription:', error);
      setStatus('error');
      setMessage(error.message || 'Failed to initialize subscription');
    } finally {
      setInitializing(false);
    }
  };

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-900">
          <AlertTriangle className="h-5 w-5" />
          Subscription Setup Required
        </CardTitle>
        <CardDescription className="text-yellow-800">
          Your subscription needs to be initialized to track usage and access features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {message}
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleInitialize} 
          disabled={initializing || status === 'success'}
          className="w-full"
        >
          {initializing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initializing...
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Initialized!
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Initialize Subscription
            </>
          )}
        </Button>

        <p className="text-xs text-yellow-700">
          This will set up your free plan with 100K tokens and 20 quizzes per month.
        </p>
      </CardContent>
    </Card>
  );
}
