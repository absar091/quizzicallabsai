'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { 
  verifyPasswordResetCode, 
  confirmPasswordReset,
  applyActionCode 
} from 'firebase/auth';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AuthActionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');
  const continueUrl = searchParams.get('continueUrl');

  useEffect(() => {
    if (!mode || !oobCode) {
      setError('Invalid action link');
      setLoading(false);
      return;
    }

    handleAuthAction();
  }, [mode, oobCode]);

  const handleAuthAction = async () => {
    try {
      switch (mode) {
        case 'resetPassword':
          // Verify the password reset code
          await verifyPasswordResetCode(auth, oobCode!);
          setShowPasswordForm(true);
          setLoading(false);
          break;

        case 'verifyEmail':
          try {
            // Apply the email verification code with retry logic
            await applyActionCode(auth, oobCode!);
            setSuccess('Email verified successfully! You can now sign in.');
            setLoading(false);
            setTimeout(() => {
              // Always redirect to login after email verification
              router.push('/login?verified=true');
            }, 2000);
          } catch (verifyError: any) {
            // Handle specific Firebase errors
            if (verifyError.code === 'auth/network-request-failed') {
              setError('Network error. Please check your internet connection and try again.');
            } else if (verifyError.code === 'auth/invalid-action-code') {
              setError('This verification link has expired or is invalid. Please request a new verification email.');
            } else if (verifyError.code === 'auth/expired-action-code') {
              setError('This verification link has expired. Please request a new verification email.');
            } else {
              setError(verifyError.message || 'Email verification failed');
            }
            setLoading(false);
            throw verifyError;
          }
          break;

        default:
          setError('Invalid action mode');
          setLoading(false);
      }
    } catch (error: any) {
      console.error('Auth action error:', error);
      setError(error.message || 'Action failed');
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

    try {
      setLoading(true);
      await confirmPasswordReset(auth, oobCode!, newPassword);
      setSuccess('Password reset successfully!');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !showPasswordForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Processing your request...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Action Failed</h1>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Success!</h1>
            <p className="text-green-600 mb-6">{success}</p>
            <p className="text-gray-500 text-sm">Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showPasswordForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Reset Your Password
            </h1>
            
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  minLength={6}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return null;
}