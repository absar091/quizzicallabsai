'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export default function TestEmailVerification() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const sendCode = async () => {
    if (!email) {
      toast({ title: 'Email required', variant: 'destructive' });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/test-email-system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email, name })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({ title: 'Code sent!', description: `Check your email. Test code: ${data.code}` });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  const verifyCode = async () => {
    if (!email || !code) {
      toast({ title: 'Email and code required', variant: 'destructive' });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('/api/test-email-system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, code })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({ title: 'Verified!', description: 'Email successfully verified' });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Email Verification</CardTitle>
          <CardDescription>Test the custom email verification system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={sendCode} disabled={isSending} className="w-full">
            {isSending ? 'Sending...' : 'Send Verification Code'}
          </Button>
          
          <div className="border-t pt-4">
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-lg tracking-widest mb-4"
              maxLength={6}
            />
            <Button onClick={verifyCode} disabled={isVerifying} className="w-full">
              {isVerifying ? 'Verifying...' : 'Verify Code'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}