import { ref, get, set, serverTimestamp } from 'firebase/database';
import { db } from './firebase';

export interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  totalStudyDays: number;
  streakStartDate: string;
  lastModified: number;
}

export class StudyStreakManager {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async getStreak(): Promise<StudyStreak> {
    try {
      const streakRef = ref(db, `studyStreaks/${this.userId}`);
      const snapshot = await get(streakRef);
      
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        // Initialize new streak
        const initialStreak: StudyStreak = {
          currentStreak: 0,
          longestStreak: 0,
          lastStudyDate: '',
          totalStudyDays: 0,
          streakStartDate: '',
          lastModified: Date.now()
        };
        
        await set(streakRef, initialStreak);
        return initialStreak;
      }
    } catch (error) {
      console.error('Error getting study streak:', error);
      throw error;
    }
  }

  async updateStreak(): Promise<StudyStreak> {
    try {
      const currentStreak = await this.getStreak();
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      let updatedStreak: StudyStreak;

      if (currentStreak.lastStudyDate === today) {
        // Already studied today, no change needed
        return currentStreak;
      } else if (currentStreak.lastStudyDate === yesterday) {
        // Continuing streak
        updatedStreak = {
          ...currentStreak,
          currentStreak: currentStreak.currentStreak + 1,
          longestStreak: Math.max(currentStreak.longestStreak, currentStreak.currentStreak + 1),
          lastStudyDate: today,
          totalStudyDays: currentStreak.totalStudyDays + 1,
          lastModified: Date.now()
        };
      } else {
        // Streak broken, start new one
        updatedStreak = {
          ...currentStreak,
          currentStreak: 1,
          longestStreak: Math.max(currentStreak.longestStreak, 1),
          lastStudyDate: today,
          totalStudyDays: currentStreak.totalStudyDays + 1,
          streakStartDate: today,
          lastModified: Date.now()
        };
      }

      const streakRef = ref(db, `studyStreaks/${this.userId}`);
      await set(streakRef, updatedStreak);
      
      return updatedStreak;
    } catch (error) {
      console.error('Error updating study streak:', error);
      throw error;
    }
  }

  async getStreakStatus(): Promise<{
    streak: StudyStreak;
    isActiveToday: boolean;
    daysUntilBreak: number;
    motivationalMessage: string;
  }> {
    const streak = await this.getStreak();
    const today = new Date().toDateString();
    const isActiveToday = streak.lastStudyDate === today;
    
    let daysUntilBreak = 0;
    if (isActiveToday) {
      daysUntilBreak = 1; // Need to study tomorrow to maintain
    } else if (streak.lastStudyDate === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()) {
      daysUntilBreak = 0; // Study today or lose streak
    }

    const motivationalMessage = this.getMotivationalMessage(streak, isActiveToday);

    return {
      streak,
      isActiveToday,
      daysUntilBreak,
      motivationalMessage
    };
  }

  private getMotivationalMessage(streak: StudyStreak, isActiveToday: boolean): string {
    if (isActiveToday) {
      if (streak.currentStreak === 1) {
        return "Great start! Keep the momentum going tomorrow.";
      } else if (streak.currentStreak < 7) {
        return `${streak.currentStreak} days strong! You're building a great habit.`;
      } else if (streak.currentStreak < 30) {
        return `Amazing ${streak.currentStreak}-day streak! You're on fire!`;
      } else {
        return `Incredible ${streak.currentStreak}-day streak! You're a study champion!`;
      }
    } else {
      if (streak.currentStreak === 0) {
        return "Start your study streak today! Every expert was once a beginner.";
      } else {
        return `Don't break your ${streak.currentStreak}-day streak! Study today to keep it alive.`;
      }
    }
  }
}

// Hook for React components
export function useStudyStreak(userId: string | null) {
  const [streak, setStreak] = React.useState<StudyStreak | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const streakManager = new StudyStreakManager(userId);
    
    streakManager.getStreak()
      .then(setStreak)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const updateStreak = React.useCallback(async () => {
    if (!userId) return;
    
    const streakManager = new StudyStreakManager(userId);
    try {
      const updatedStreak = await streakManager.updateStreak();
      setStreak(updatedStreak);
      return updatedStreak;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [userId]);

  return { streak, loading, error, updateStreak };
}

// Add React import for the hook
import React from 'react';