'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function useEmailVerification() {
  const [user] = useAuthState(auth);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsVerified(user.emailVerified);
      } else {
        setIsVerified(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshVerificationStatus = async () => {
    if (user) {
      await user.reload();
      setIsVerified(user.emailVerified);
    }
  };

  return {
    user,
    isVerified,
    loading,
    refreshVerificationStatus
  };
}