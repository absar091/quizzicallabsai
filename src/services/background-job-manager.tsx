// @ts-nocheck
"use client";

import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { backgroundJobService, BackgroundJob } from './background-job-service';
import { notificationService } from './notification-service';
import { useAuth } from '@/hooks/useAuth';

interface BackgroundJobState {
  currentJob: BackgroundJob | null;
  jobs: BackgroundJob[];
  isLoading: boolean;
  showMonitor: boolean;
  notificationsEnabled: boolean;
}

type BackgroundJobAction =
  | { type: 'START_JOB'; payload: string }
  | { type: 'JOB_UPDATE'; payload: BackgroundJob }
  | { type: 'JOB_COMPLETE'; payload: BackgroundJob }
  | { type: 'SET_JOBS'; payload: BackgroundJob[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SHOW_MONITOR'; payload: boolean }
  | { type: 'SET_NOTIFICATIONS_ENABLED'; payload: boolean }
  | { type: 'RESET_STATE' };

const initialState: BackgroundJobState = {
  currentJob: null,
  jobs: [],
  isLoading: false,
  showMonitor: false,
  notificationsEnabled: false,
};

function backgroundJobReducer(state: BackgroundJobState, action: BackgroundJobAction): BackgroundJobState {
  switch (action.type) {
    case 'START_JOB':
      return {
        ...state,
        currentJob: { id: action.payload, status: 'pending', createdAt: Date.now() } as BackgroundJob,
        showMonitor: true,
      };
    case 'JOB_UPDATE':
      return {
        ...state,
        currentJob: action.payload,
        jobs: state.jobs.map(job =>
          job.id === action.payload.id ? action.payload : job
        ),
      };
    case 'JOB_COMPLETE':
      return {
        ...state,
        currentJob: action.payload,
      };
    case 'SET_JOBS':
      return {
        ...state,
        jobs: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SHOW_MONITOR':
      return {
        ...state,
        showMonitor: action.payload,
      };
    case 'SET_NOTIFICATIONS_ENABLED':
      return {
        ...state,
        notificationsEnabled: action.payload,
      };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

interface BackgroundJobContextType {
  state: BackgroundJobState;
  startBackgroundQuizGeneration: (formValues: any) => Promise<string>;
  closeMonitor: () => void;
  requestNotificationPermission: () => Promise<boolean>;
  getJobResult: (jobId: string) => Promise<BackgroundJob | null>;
}

const BackgroundJobContext = createContext<BackgroundJobContextType | null>(null);

export function BackgroundJobProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(backgroundJobReducer, initialState);
  const { user } = useAuth();
  const subscriptionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (user) {
      loadJobs();
      checkNotificationPermission();
    } else {
      dispatch({ type: 'RESET_STATE' });
    }
  }, [user]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current();
      }
    };
  }, []);

  const loadJobs = async () => {
    if (!user?.uid) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const jobs = await backgroundJobService.getUserJobs(user.uid);
      dispatch({ type: 'SET_JOBS', payload: jobs });

      // Auto-cleanup old jobs
      await backgroundJobService.cleanupOldJobs(user.uid);
    } catch (error) {
      console.error('Error loading background jobs:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const checkNotificationPermission = () => {
    const enabled = notificationService.canShowNotifications();
    dispatch({ type: 'SET_NOTIFICATIONS_ENABLED', payload: enabled });
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    const granted = await notificationService.requestPermission();
    dispatch({ type: 'SET_NOTIFICATIONS_ENABLED', payload: granted });
    return granted;
  };

  const startBackgroundQuizGeneration = async (formValues: any): Promise<string> => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Create background job on server
      const response = await fetch('/api/background-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formValues,
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start background job');
      }

      const result = await response.json();
      const jobId = result.jobId;

      // Start monitoring this job
      dispatch({ type: 'START_JOB', payload: jobId });

      // Subscribe to job updates
      if (subscriptionRef.current) {
        subscriptionRef.current();
      }

      subscriptionRef.current = backgroundJobService.subscribeToJob(
        jobId,
        user.uid,
        (job) => {
          dispatch({ type: 'JOB_UPDATE', payload: job });

          if (job.status === 'completed') {
            dispatch({ type: 'JOB_COMPLETE', payload: job });
            // Auto-hide monitor after some time when completed
            setTimeout(() => {
              dispatch({ type: 'SHOW_MONITOR', payload: false });
            }, 5000);
          }
        }
      );

      // Load updated jobs list
      await loadJobs();

      return jobId;
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getJobResult = async (jobId: string): Promise<BackgroundJob | null> => {
    if (!user?.uid) return null;

    try {
      const job = await backgroundJobService.getJob(jobId, user.uid);
      return job;
    } catch (error) {
      console.error('Error getting job result:', error);
      return null;
    }
  };

  const closeMonitor = () => {
    dispatch({ type: 'SHOW_MONITOR', payload: false });
  };

  const contextValue = {
    state,
    startBackgroundQuizGeneration,
    closeMonitor,
    requestNotificationPermission,
    getJobResult,
  };

  return (
    <BackgroundJobContext.Provider value={contextValue}>
      {children}

      {/* Background Job Monitor */}
      {state.showMonitor && state.currentJob && (
        <BackgroundJobMonitorOverlay
          jobId={state.currentJob.id}
          userId={user?.uid || ''}
          onComplete={(job) => {
            dispatch({ type: 'JOB_COMPLETE', payload: job });
            // Handle completion - redirect to quiz page or similar
            if (job.status === 'completed' && job.result) {
              // Automatically redirect to the generated quiz
              window.location.href = `/generate-quiz?fromJob=${job.id}`;
            }
          }}
          onClose={closeMonitor}
        />
      )}
    </BackgroundJobContext.Provider>
  );
}

export const useBackgroundJob = () => {
  const context = useContext(BackgroundJobContext);
  if (!context) {
    throw new Error('useBackgroundJob must be used within a BackgroundJobProvider');
  }
  return context;
};

// Dynamic import for the monitor to avoid SSR issues
const BackgroundJobMonitorOverlay = React.lazy(() =>
  import('@/components/background-job-monitor').then(module => ({
    default: (props: any) => {
      // Create a portal for the overlay
      if (typeof window === 'undefined') return null;

      const overlay = document.createElement('div');
      overlay.setAttribute('data-background-job-overlay', 'true');
      overlay.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 400px;
      `;
      document.body.appendChild(overlay);

      return React.createPortal(<module.BackgroundJobMonitor {...props} />, overlay);
    }
  }))
);
