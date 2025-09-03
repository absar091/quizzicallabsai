// Real-time progress persistence
import { useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

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

    const progressData: QuizProgress = {
      quizId,
      ...progress,
      timestamp: Date.now()
    };

    // Save to localStorage for immediate persistence
    localStorage.setItem(`quiz_progress_${quizId}`, JSON.stringify(progressData));

    // Save to Firebase for cross-device sync
    if (typeof window !== 'undefined') {
      import('@/lib/firebase').then(({ database, ref, set }) => {
        const progressRef = ref(database, `users/${user.uid}/quiz_progress/${quizId}`);
        set(progressRef, progressData).catch(console.error);
      });
    }
  }, [user, quizId]);

  const loadProgress = useCallback(async (): Promise<QuizProgress | null> => {
    if (!user || !quizId) return null;

    try {
      // Try localStorage first
      const localProgress = localStorage.getItem(`quiz_progress_${quizId}`);
      if (localProgress) {
        return JSON.parse(localProgress);
      }

      // Fallback to Firebase
      const { database, ref, get } = await import('@/lib/firebase');
      const progressRef = ref(database, `users/${user.uid}/quiz_progress/${quizId}`);
      const snapshot = await get(progressRef);
      
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Failed to load progress:', error);
      return null;
    }
  }, [user, quizId]);

  const clearProgress = useCallback(() => {
    if (!user || !quizId) return;

    localStorage.removeItem(`quiz_progress_${quizId}`);
    
    if (typeof window !== 'undefined') {
      import('@/lib/firebase').then(({ database, ref, remove }) => {
        const progressRef = ref(database, `users/${user.uid}/quiz_progress/${quizId}`);
        remove(progressRef).catch(console.error);
      });
    }
  }, [user, quizId]);

  return { saveProgress, loadProgress, clearProgress };
}