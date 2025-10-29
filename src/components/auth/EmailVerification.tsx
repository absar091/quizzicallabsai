'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Edit2, ArrowLeft } from 'lucide-react';

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
}

export function EmailVerification({ email, onVerified }: EmailVerificationProps) {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(email);
  const [currentEmail, setCurrentEmail] = useState(email);

  const sendVerificationCode = async (emailToSend = currentEmail) => {
    setIsSending(true);
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToSend, name: emailToSend.split('@')[0] })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Verification code sent',
          description: `Check ${emailToSend} for the 6-digit code`
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

  const changeEmail = async () => {
    if (!newEmail || newEmail === currentEmail) {
      setIsChangingEmail(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive'
      });
      return;
    }

    setCurrentEmail(newEmail);
    setCode('');
    setIsChangingEmail(false);
    
    // Send verification code to new email
    await sendVerificationCode(newEmail);
    
    toast({
      title: 'Email updated',
      description: `Verification code sent to ${newEmail}`
    });
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
        body: JSON.stringify({ email: currentEmail, code })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update Firebase Auth user as verified
        await fetch('/api/auth/mark-verified', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: currentEmail,
            originalEmail: email // Pass original email for user identification
          })
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

  if (isChangingEmail) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Change Email Address</CardTitle>
          <CardDescription>
            Enter your new email address to receive the verification code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter new email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="text-center"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                setIsChangingEmail(false);
                setNewEmail(currentEmail);
              }}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              onClick={changeEmail}
              disabled={!newEmail || newEmail === currentEmail}
              className="flex-1"
            >
              Update Email
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          We sent a 6-digit code to {currentEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3')}
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
        
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => sendVerificationCode()}
            disabled={isSending}
            className="text-sm"
          >
            {isSending ? 'Sending...' : 'Resend Code'}
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => setIsChangingEmail(true)}
            className="text-sm"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Change Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}