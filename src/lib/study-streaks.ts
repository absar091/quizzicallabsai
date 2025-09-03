// Study Streaks Gamification System
export interface StudyStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  totalStudyDays: number;
  streakMilestones: number[];
}

export class StudyStreakManager {
  static updateStreak(userId: string, currentStreak: StudyStreak): StudyStreak {
    const today = new Date().toDateString();
    const lastStudy = new Date(currentStreak.lastStudyDate).toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastStudy === today) {
      // Already studied today
      return currentStreak;
    }

    if (lastStudy === yesterday) {
      // Continuing streak
      const newStreak = currentStreak.currentStreak + 1;
      return {
        ...currentStreak,
        currentStreak: newStreak,
        longestStreak: Math.max(currentStreak.longestStreak, newStreak),
        lastStudyDate: today,
        totalStudyDays: currentStreak.totalStudyDays + 1,
        streakMilestones: this.checkMilestones(newStreak, currentStreak.streakMilestones)
      };
    }

    // Streak broken, start new
    return {
      ...currentStreak,
      currentStreak: 1,
      lastStudyDate: today,
      totalStudyDays: currentStreak.totalStudyDays + 1
    };
  }

  private static checkMilestones(streak: number, existing: number[]): number[] {
    const milestones = [7, 14, 30, 50, 100];
    const newMilestones = [...existing];
    
    milestones.forEach(milestone => {
      if (streak >= milestone && !existing.includes(milestone)) {
        newMilestones.push(milestone);
      }
    });
    
    return newMilestones;
  }

  static getStreakMessage(streak: number): string {
    if (streak >= 100) return "🔥 Century Streak! You're unstoppable!";
    if (streak >= 50) return "⚡ Lightning Streak! Amazing dedication!";
    if (streak >= 30) return "🌟 Monthly Master! Keep it up!";
    if (streak >= 14) return "💪 Two Week Warrior!";
    if (streak >= 7) return "🎯 Week Champion!";
    if (streak >= 3) return "🚀 Building momentum!";
    return "📚 Great start!";
  }
}