'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
}

export function EmailVerification({ email, onVerified }: EmailVerificationProps) {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const sendVerificationCode = async () => {
    setIsSending(true);
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: email.split('@')[0] })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Verification code sent',
          description: 'Check your email for the 6-digit code'
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'Failed to send code',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  const verifyCode = async () => {
    if (code.length !== 6) {
      toast({
        title: 'Invalid code',
        description: 'Please enter a 6-digit code',
        variant: 'destructive'
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update Firebase Auth user as verified
        await fetch('/api/auth/mark-verified', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        
        toast({
          title: 'Email Verified!',
          description: 'Welcome to Quizzicallabzᴬᴵ!'
        });
        onVerified();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'Verification failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          We sent a 6-digit code to {email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="text-center text-lg tracking-widest"
            maxLength={6}
          />
        </div>
        
        <Button 
          onClick={verifyCode} 
          disabled={isVerifying || code.length !== 6}
          className="w-full"
        >
          {isVerifying ? 'Verifying...' : 'Verify Email'}
        </Button>
        
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={sendVerificationCode}
            disabled={isSending}
            className="text-sm"
          >
            {isSending ? 'Sending...' : 'Resend Code'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}