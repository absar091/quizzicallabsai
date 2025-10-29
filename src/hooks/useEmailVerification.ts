import { useState, useEffect } from 'react';

export function useEmailVerification(email: string) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      setIsLoading(false);
      return;
    }

    checkVerificationStatus();
  }, [email]);

  const checkVerificationStatus = async () => {
    try {
      const response = await fetch('/api/auth/check-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      setIsVerified(data.verified || false);
    } catch (error) {
      console.error('Failed to check verification status:', error);
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationCode = async (name?: string) => {
    const response = await fetch('/api/auth/send-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
    return data;
  };

  const verifyCode = async (code: string) => {
    const response = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });

    const data = await response.json();
    if (data.success) {
      setIsVerified(true);
    } else {
      throw new Error(data.error);
    }
    return data;
  };

  return {
    isVerified,
    isLoading,
    sendVerificationCode,
    verifyCode,
    refreshStatus: checkVerificationStatus
  };
}