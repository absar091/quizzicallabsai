'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface EmailVerificationGuardProps {
  children: React.ReactNode;
}

export function EmailVerificationGuard({ children }: EmailVerificationGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isCheckingVerification, setIsCheckingVerification] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      checkVerificationStatus();
    } else if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const checkVerificationStatus = async () => {
    if (!user?.email) return;

    try {
      const response = await fetch('/api/auth/check-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });

      const data = await response.json();
      setIsVerified(data.verified || user.emailVerified);
    } catch (error) {
      console.error('Failed to check verification:', error);
      setIsVerified(user.emailVerified || false);
    } finally {
      setIsCheckingVerification(false);
    }
  };

  const sendVerificationCode = async () => {
    if (!user?.email) return;

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
        toast({
          title: 'Verification code sent',
          description: 'Check your email for the 6-digit code'
        });
        router.push(`/verify-email?email=${encodeURIComponent(user.email)}`);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'Failed to send code',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (loading || isCheckingVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Checking your account status...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Email Verification Required</CardTitle>
            <CardDescription>
              Please verify your email address to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              We need to verify your email: <strong>{user.email}</strong>
            </p>
            <Button onClick={sendVerificationCode} className="w-full">
              Send Verification Code
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/login')} 
              className="w-full"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}