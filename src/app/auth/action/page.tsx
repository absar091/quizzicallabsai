'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { confirmPasswordReset, applyActionCode, verifyPasswordResetCode } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export default function AuthActionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    if (!mode || !oobCode) {
      setError('Invalid action link');
      setLoading(false);
      return;
    }

    if (mode === 'verifyEmail') {
      handleEmailVerification();
    } else if (mode === 'resetPassword') {
      handlePasswordResetVerification();
    }
  }, [mode, oobCode]);

  const handleEmailVerification = async () => {
    try {
      await applyActionCode(auth, oobCode!);
      setSuccess('Email verified successfully!');
      toast({
        title: "Email Verified!",
        description: "Your email has been verified. You can now sign in.",
      });
      setTimeout(() => router.push('/login'), 2000);
    } catch (error: any) {
      setError('Invalid or expired verification link');
    }
    setLoading(false);
  };

  const handlePasswordResetVerification = async () => {
    try {
      await verifyPasswordResetCode(auth, oobCode!);
      setLoading(false);
    } catch (error: any) {
      setError('Invalid or expired password reset link');
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode!, newPassword);
      setSuccess('Password reset successfully!');
      toast({
        title: "Password Reset!",
        description: "Your password has been updated. Redirecting to login...",
      });
      setTimeout(() => router.push('/login'), 2000);
    } catch (error: any) {
      setError('Failed to reset password. Please try again.');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Processing...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {mode === 'resetPassword' ? 'Reset Password' : 'Email Verification'}
          </CardTitle>
          <CardDescription>
            {mode === 'resetPassword' 
              ? 'Enter your new password below' 
              : 'Verifying your email address...'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}

          {mode === 'resetPassword' && !success && !error && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter>
          <Button variant="outline" onClick={() => router.push('/login')} className="w-full">
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}