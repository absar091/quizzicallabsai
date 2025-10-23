'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import PasswordConfirmForm from '@/components/auth/PasswordConfirmForm';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

function ConfirmPasswordResetContent() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  if (!oobCode) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Invalid password reset link. Please request a new password reset.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return <PasswordConfirmForm oobCode={oobCode} />;
}

export default function ConfirmPasswordResetPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Suspense fallback={
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">Loading...</div>
          </CardContent>
        </Card>
      }>
        <ConfirmPasswordResetContent />
      </Suspense>
    </div>
  );
}