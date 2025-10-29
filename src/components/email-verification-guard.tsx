'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

export function EmailVerificationGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

  // Check verification status periodically
  useEffect(() => {
    if (!user || user.emailVerified || loading) return;

    const interval = setInterval(async () => {
      if (!user?.email) return;

      try {
        const response = await fetch('/api/auth/check-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email })
        });

        const data = await response.json();
        if (data.verified) {
          // Mark user as verified in Firebase Auth
          await fetch('/api/auth/mark-verified', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email })
          });
          
          // Refresh the page to update the auth context
          window.location.reload();
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [user, loading]);

  // If user is verified or loading, show children
  if (loading || !user || user.emailVerified) {
    return <>{children}</>;
  }

  const handleSendVerificationCode = async () => {
    if (!user?.email) return;

    setIsResending(true);
    setResendMessage('');

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user.email, 
          name: user.displayName || user.email.split('@')[0] 
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setResendMessage('Verification code sent! Please check your email.');
        toast({
          title: 'Verification code sent',
          description: 'Check your email for the 6-digit code'
        });
        // Redirect to verification page
        router.push(`/verify-email?email=${encodeURIComponent(user.email)}`);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      setResendMessage('Failed to send verification code. Please try again.');
      toast({
        title: 'Failed to send code',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!user?.email) return;
    
    setIsChecking(true);
    
    try {
      const response = await fetch('/api/auth/check-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });

      const data = await response.json();
      
      if (data.verified) {
        // Mark user as verified in Firebase Auth
        await fetch('/api/auth/mark-verified', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email })
        });
        
        // Refresh the page to update the auth context
        window.location.reload();
      } else {
        setResendMessage('Email not verified yet. Please enter the verification code.');
        // Redirect to verification page
        router.push(`/verify-email?email=${encodeURIComponent(user.email)}`);
      }
    } catch (error: any) {
      console.error('Error checking verification status:', error);
      setResendMessage('Failed to check verification status. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
            <Mail className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            Please verify your email address to access Quizzicallabzᴬᴵ
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              We need to verify your email address: <strong>{user.email}</strong>. 
              Click below to receive a 6-digit verification code.
            </AlertDescription>
          </Alert>

          {resendMessage && (
            <Alert className={resendMessage.includes('sent') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{resendMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button 
              onClick={handleSendVerificationCode} 
              disabled={isResending}
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Verification Code
                </>
              )}
            </Button>

            <Button 
              onClick={handleCheckVerification} 
              disabled={isChecking}
              variant="outline"
              className="w-full"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  I Have a Verification Code
                </>
              )}
            </Button>

            <Button 
              onClick={handleLogout}
              variant="ghost"
              className="w-full text-sm"
            >
              Sign Out
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Need help?</p>
            <ul className="mt-2 space-y-1 text-xs">
              <li>• Check your spam/junk folder</li>
              <li>• Make sure {user.email} is correct</li>
              <li>• Contact support if issues persist</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
