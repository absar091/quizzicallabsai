'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface UserUsage {
  plan: string;
  tokens_used: number;
  tokens_limit: number;
  tokens_remaining: number;
  quizzes_used: number;
  quizzes_limit: number;
  quizzes_remaining: number;
  billing_cycle_end: string;
  subscription_status: string;
}

export interface UseSubscriptionReturn {
  usage: UserUsage | null;
  loading: boolean;
  error: string | null;
  refreshUsage: () => Promise<void>;
  trackTokenUsage: (amount: number) => Promise<boolean>;
  trackQuizCreation: () => Promise<boolean>;
  canPerformAction: (actionType: 'token' | 'quiz', amount?: number) => boolean;
  createCheckoutUrl: (planId: string) => Promise<string>;
  initializeUser: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get auth token for API calls
  const getAuthToken = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    try {
      // Import Firebase auth to get the token
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return null;
      return await currentUser.getIdToken();
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }, [user]);

  // Fetch user usage data
  const refreshUsage = useCallback(async () => {
    if (!user) {
      setUsage(null);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const token = await getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch('/api/subscription/usage', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch usage');
      }

      setUsage(data.usage);
    } catch (err: any) {
      console.error('Failed to fetch usage:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, getAuthToken]);

  // Initialize user subscription
  const initializeUser = useCallback(async () => {
    if (!user) return;

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch('/api/subscription/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize user');
      }

      setUsage(data.usage);
    } catch (err: any) {
      console.error('Failed to initialize user:', err);
      setError(err.message);
    }
  }, [user, getAuthToken]);

  // Track token usage
  const trackTokenUsage = useCallback(async (amount: number): Promise<boolean> => {
    if (!user) return false;

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch('/api/subscription/usage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'token',
          amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          // Usage limit exceeded
          setError(data.message || 'Usage limit exceeded');
          return false;
        }
        throw new Error(data.error || 'Failed to track token usage');
      }

      setUsage(data.usage);
      return true;
    } catch (err: any) {
      console.error('Failed to track token usage:', err);
      setError(err.message);
      return false;
    }
  }, [user, getAuthToken]);

  // Track quiz creation
  const trackQuizCreation = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch('/api/subscription/usage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'quiz',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          // Usage limit exceeded
          setError(data.message || 'Quiz limit exceeded');
          return false;
        }
        throw new Error(data.error || 'Failed to track quiz creation');
      }

      setUsage(data.usage);
      return true;
    } catch (err: any) {
      console.error('Failed to track quiz creation:', err);
      setError(err.message);
      return false;
    }
  }, [user, getAuthToken]);

  // Check if user can perform action
  const canPerformAction = useCallback((actionType: 'token' | 'quiz', amount: number = 1): boolean => {
    if (!usage) return false;

    if (actionType === 'token') {
      return usage.tokens_remaining >= amount;
    } else {
      return usage.quizzes_remaining >= amount;
    }
  }, [usage]);

  // Create checkout URL
  const createCheckoutUrl = useCallback(async (planId: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const token = await getAuthToken();
    if (!token) throw new Error('No auth token');

    const response = await fetch('/api/subscription/checkout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout URL');
    }

    return data.checkoutUrl;
  }, [user, getAuthToken]);

  // Load usage on user change
  useEffect(() => {
    if (user) {
      refreshUsage();
    } else {
      setUsage(null);
      setLoading(false);
      setError(null);
    }
  }, [user, refreshUsage]);

  // Initialize user if no usage data found
  useEffect(() => {
    if (user && !loading && !usage && !error) {
      console.log('🔄 Auto-initializing user subscription...');
      initializeUser();
    }
  }, [user, loading, usage, error, initializeUser]);

  // Auto-retry initialization if it fails
  useEffect(() => {
    if (error && error.includes('not found') && user) {
      console.log('⚠️ Subscription not found, retrying initialization...');
      const timer = setTimeout(() => {
        initializeUser();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, user, initializeUser]);

  return {
    usage,
    loading,
    error,
    refreshUsage,
    trackTokenUsage,
    trackQuizCreation,
    canPerformAction,
    createCheckoutUrl,
    initializeUser,
  };
}