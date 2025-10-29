'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EmailVerification } from '@/components/auth/EmailVerification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // If no email parameter, redirect to signup
      router.push('/signup');
      return;
    }
    setIsLoading(false);
  }, [searchParams, router]);

  const handleVerified = () => {
    toast({
      title: 'Welcome to Quizzicallabzᴬᴵ!',
      description: 'Your email has been verified successfully.',
    });
    router.push('/dashboard?verified=true');
  };

  if (isLoading || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Please wait while we load the verification page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <EmailVerification email={email} onVerified={handleVerified} />
    </div>
  );
}