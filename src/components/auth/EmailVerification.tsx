'use client';

import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, Mail } from 'lucide-react';

export default function EmailVerification() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSendVerification = async () => {
    if (!user) return;
    
    setLoading(true);
    setMessage('');
    setError('');
    setSuccess(false);

    try {
      await sendEmailVerification(user);
      setMessage('Verification email sent! Check your inbox and spam folder.');
      setSuccess(true);
    } catch (error: any) {
      let errorMessage = 'Failed to send verification email. Please try again.';
      
      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please wait a moment before requesting another email.';
      } else if (error.code === 'auth/user-token-expired') {
        errorMessage = 'Session expired. Please sign in again.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setError(errorMessage);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (user.emailVerified) {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          ✅ Your email is verified!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <Mail className="h-4 w-4" />
      <AlertDescription>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Email not verified</p>
            <p className="text-sm">Please verify your email to access all features</p>
          </div>
          <Button
            onClick={handleSendVerification}
            disabled={loading}
            variant="outline"
            size="sm"
            className="ml-4"
          >
            {loading ? 'Sending...' : 'Send Verification'}
          </Button>
        </div>
        
        {success && message && (
          <Alert className="mt-3">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive" className="mt-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </AlertDescription>
    </Alert>
  );
}