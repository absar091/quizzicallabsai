'use client';

import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { sendVerificationEmail, isEmailVerified } from '@/lib/auth-helpers';

export default function EmailVerification() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSendVerification = async () => {
    if (!user) return;
    
    setLoading(true);
    setMessage('');

    const result = await sendVerificationEmail(user);
    setMessage(result.message);
    setSuccess(result.success);
    setLoading(false);
  };

  if (!user) return null;

  if (isEmailVerified(user)) {
    return (
      <div className="p-4 bg-green-100 text-green-700 rounded-md">
        ✅ Your email is verified!
      </div>
    );
  }

  return (
    <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Email not verified</p>
          <p className="text-sm">Please verify your email to access all features</p>
        </div>
        <button
          onClick={handleSendVerification}
          disabled={loading}
          className="ml-4 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Verification'}
        </button>
      </div>
      
      {message && (
        <div className={`mt-3 p-2 rounded-md text-sm ${success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
}