'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { sendEmailVerification, reload } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export function EmailVerificationGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

  // If user is verified or loading, show children
  if (loading || !user || user.emailVerified) {
    return <>{children}</>;
  }

  const handleResendVerification = async () => {
    if (!auth.currentUser) return;
    
    setIsResending(true);
    setResendMessage('');
    
    try {
      await sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/dashboard`,
        handleCodeInApp: false,
      });
      setResendMessage('Verification email sent! Please check your inbox and spam folder.');
    } catch (error: any) {
      console.error('Error sending verification email:', error);
      setResendMessage('Failed to send verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!auth.currentUser) return;
    
    setIsChecking(true);
    
    try {
      // Reload the user to get the latest verification status
      await reload(auth.currentUser);
      
      if (auth.currentUser.emailVerified) {
        // Send verification confirmation to backend
        try {
          const idToken = await auth.currentUser.getIdToken();
          await fetch('/api/handle-email-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
          });
        } catch (error) {
          console.error('Error notifying backend of verification:', error);
        }
        
        // Refresh the page to update the auth context
        window.location.reload();
      } else {
        setResendMessage('Email not verified yet. Please check your email and click the verification link.');
      }
    } catch (error: any) {
      console.error('Error checking verification status:', error);
      setResendMessage('Failed to check verification status. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
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
              We've sent a verification email to <strong>{user.email}</strong>. 
              Please check your inbox and click the verification link to continue.
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
              onClick={handleCheckVerification} 
              disabled={isChecking}
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
                  I've Verified My Email
                </>
              )}
            </Button>

            <Button 
              onClick={handleResendVerification} 
              disabled={isResending}
              variant="outline"
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
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
            <p>Didn't receive the email?</p>
            <ul className="mt-2 space-y-1 text-xs">
              <li>• Check your spam/junk folder</li>
              <li>• Make sure {user.email} is correct</li>
              <li>• Try resending the verification email</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}