'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { 
  applyActionCode, 
  confirmPasswordReset, 
  verifyPasswordResetCode,
  checkActionCode
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AuthActionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');
  const continueUrl = searchParams.get('continueUrl');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!mode || !oobCode) {
      setError('Invalid or missing parameters');
      setLoading(false);
      return;
    }

    handleAuthAction();
  }, [mode, oobCode]);

  const handleAuthAction = async () => {
    try {
      setLoading(true);
      setError('');

      switch (mode) {
        case 'resetPassword':
          // Verify the password reset code and get email
          const email = await verifyPasswordResetCode(auth, oobCode);
          setEmail(email);
          setLoading(false);
          break;

        case 'verifyEmail':
          // Apply the email verification code
          await applyActionCode(auth, oobCode);
          setSuccess('Email verified successfully! You can now access all features.');
          
          // Send confirmation to backend
          try {
            const user = auth.currentUser;
            if (user) {
              const idToken = await user.getIdToken();
              await fetch('/api/handle-email-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken })
              });
            }
          } catch (backendError) {
            console.error('Backend notification failed:', backendError);
          }
          
          setLoading(false);
          // Redirect after 3 seconds
          setTimeout(() => {
            router.push(continueUrl || '/dashboard');
          }, 3000);
          break;

        case 'recoverEmail':
          // Handle email recovery
          const info = await checkActionCode(auth, oobCode);
          await applyActionCode(auth, oobCode);
          setSuccess(`Email recovery completed. Your email has been restored to: ${info.data.email}`);
          setLoading(false);
          break;

        default:
          setError('Unknown action mode');
          setLoading(false);
      }
    } catch (error: any) {
      console.error('Auth action error:', error);
      setError(getErrorMessage(error.code));
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
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await confirmPasswordReset(auth, oobCode!, newPassword);
      setSuccess('Password reset successfully! You can now sign in with your new password.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/expired-action-code':
        return 'This link has expired. Please request a new one.';
      case 'auth/invalid-action-code':
        return 'This link is invalid or has already been used.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      default:
        return 'An error occurred. Please try again or contact support.';
    }
  };

  const getPageTitle = () => {
    switch (mode) {
      case 'resetPassword':
        return 'Reset Your Password';
      case 'verifyEmail':
        return 'Verify Your Email';
      case 'recoverEmail':
        return 'Recover Your Email';
      default:
        return 'Authentication Action';
    }
  };

  const getPageDescription = () => {
    switch (mode) {
      case 'resetPassword':
        return 'Enter your new password below';
      case 'verifyEmail':
        return 'Verifying your email address...';
      case 'recoverEmail':
        return 'Recovering your email address...';
      default:
        return 'Processing authentication action...';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-bold">{getPageTitle()}</CardTitle>
            <CardDescription>{getPageDescription()}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
            success ? 'bg-green-100 dark:bg-green-900' : 
            error ? 'bg-red-100 dark:bg-red-900' : 
            'bg-blue-100 dark:bg-blue-900'
          }`}>
            {success ? (
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            ) : error ? (
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            ) : (
              <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">{getPageTitle()}</CardTitle>
          <CardDescription>{getPageDescription()}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {mode === 'resetPassword' && !success && !error && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="text-sm font-medium">New Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          )}

          {(success || error) && (
            <div className="text-center space-y-2">
              <Button 
                onClick={() => router.push(success ? '/dashboard' : '/login')}
                className="w-full"
              >
                {success ? 'Go to Dashboard' : 'Back to Login'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}