// @ts-nocheck
// Real-time progress persistence
import { useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { InputValidator } from '@/lib/input-validator';
import { secureLog } from '@/lib/secure-logger';

interface QuizProgress {
  quizId: string;
  answers: (string | null)[];
  currentQuestion: number;
  timeSpent: number;
  timestamp: number;
}

export function useProgressPersistence(quizId: string) {
  const { user } = useAuth();

  const saveProgress = useCallback((progress: Omit<QuizProgress, 'quizId' | 'timestamp'>) => {
    if (!user || !quizId) return;

    // Validate and sanitize quizId to prevent path traversal
    const sanitizedQuizId = InputValidator.sanitizeInput(quizId);
    if (!sanitizedQuizId || sanitizedQuizId !== quizId) {
      secureLog('warn', 'Invalid quiz ID detected in saveProgress');
      return;
    }

    const progressData: QuizProgress = {
      quizId: sanitizedQuizId,
      ...progress,
      timestamp: Date.now()
    };

    // Save to localStorage for immediate persistence
    localStorage.setItem(`quiz_progress_${sanitizedQuizId}`, JSON.stringify(progressData));

    // Save to Firebase for cross-device sync
    if (typeof window !== 'undefined') {
      import('@/lib/firebase').then(({ database, ref, set }) => {
        const progressRef = ref(database, `users/${user.uid}/quiz_progress/${sanitizedQuizId}`);
        set(progressRef, progressData).catch((error) => {
          secureLog('error', 'Failed to save progress to Firebase', error);
        });
      });
    }
  }, [user, quizId]);

  const loadProgress = useCallback(async (): Promise<QuizProgress | null> => {
    if (!user || !quizId) return null;

    // Validate and sanitize quizId to prevent path traversal
    const sanitizedQuizId = InputValidator.sanitizeInput(quizId);
    if (!sanitizedQuizId || sanitizedQuizId !== quizId) {
      secureLog('warn', 'Invalid quiz ID detected in loadProgress');
      return null;
    }

    try {
      // Try localStorage first
      const localProgress = localStorage.getItem(`quiz_progress_${sanitizedQuizId}`);
      if (localProgress) {
        return JSON.parse(localProgress);
      }

      // Fallback to Firebase
      const { database, ref, get } = await import('@/lib/firebase');
      const progressRef = ref(database, `users/${user.uid}/quiz_progress/${sanitizedQuizId}`);
      const snapshot = await get(progressRef);
      
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      secureLog('error', 'Failed to load progress', error);
      return null;
    }
  }, [user, quizId]);

  const clearProgress = useCallback(() => {
    if (!user || !quizId) return;

    // Validate and sanitize quizId to prevent path traversal
    const sanitizedQuizId = InputValidator.sanitizeInput(quizId);
    if (!sanitizedQuizId || sanitizedQuizId !== quizId) {
      secureLog('warn', 'Invalid quiz ID detected in clearProgress');
      return;
    }

    localStorage.removeItem(`quiz_progress_${sanitizedQuizId}`);
    
    if (typeof window !== 'undefined') {
      import('@/lib/firebase').then(({ database, ref, remove }) => {
        const progressRef = ref(database, `users/${user.uid}/quiz_progress/${sanitizedQuizId}`);
        remove(progressRef).catch((error) => {
          secureLog('error', 'Failed to clear progress from Firebase', error);
        });
      });
    }
  }, [user, quizId]);

  return { saveProgress, loadProgress, clearProgress };
}