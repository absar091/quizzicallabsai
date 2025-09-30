/**
 * Achievement System Logic
 * Handles achievement unlocking, progress tracking, and notifications
 */

import { Achievement } from '@/components/achievements/achievement-badge';

export interface AchievementDefinition {
  id: string;
  type: Achievement['type'];
  title: string;
  description: string;
  rarity: Achievement['rarity'];
  requirement: {
    quizCount?: number;
    streakDays?: number;
    scorePercentage?: number;
    studyHours?: number;
    fastTime?: number;
    perfectScores?: number;
  };
}

// Define all available achievements
export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // Quiz Completion Achievements
  {
    id: 'first_quiz',
    type: 'quiz_complete',
    title: 'First Steps',
    description: 'Complete your first quiz',
    rarity: 'common',
    requirement: { quizCount: 1 },
  },
  {
    id: 'quiz_master_10',
    type: 'quiz_complete',
    title: 'Quiz Enthusiast',
    description: 'Complete 10 quizzes',
    rarity: 'common',
    requirement: { quizCount: 10 },
  },
  {
    id: 'quiz_master_50',
    type: 'quiz_complete',
    title: 'Quiz Master',
    description: 'Complete 50 quizzes',
    rarity: 'rare',
    requirement: { quizCount: 50 },
  },
  {
    id: 'quiz_master_100',
    type: 'quiz_complete',
    title: 'Quiz Legend',
    description: 'Complete 100 quizzes',
    rarity: 'epic',
    requirement: { quizCount: 100 },
  },
  {
    id: 'quiz_master_500',
    type: 'quiz_complete',
    title: 'Quiz Deity',
    description: 'Complete 500 quizzes',
    rarity: 'legendary',
    requirement: { quizCount: 500 },
  },

  // Streak Achievements
  {
    id: 'streak_3',
    type: 'streak',
    title: 'On Fire',
    description: 'Maintain a 3-day study streak',
    rarity: 'common',
    requirement: { streakDays: 3 },
  },
  {
    id: 'streak_7',
    type: 'streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day study streak',
    rarity: 'common',
    requirement: { streakDays: 7 },
  },
  {
    id: 'streak_30',
    type: 'streak',
    title: 'Monthly Champion',
    description: 'Maintain a 30-day study streak',
    rarity: 'rare',
    requirement: { streakDays: 30 },
  },
  {
    id: 'streak_100',
    type: 'streak',
    title: 'Unstoppable',
    description: 'Maintain a 100-day study streak',
    rarity: 'epic',
    requirement: { streakDays: 100 },
  },
  {
    id: 'streak_365',
    type: 'streak',
    title: 'Year-Long Dedication',
    description: 'Maintain a 365-day study streak',
    rarity: 'legendary',
    requirement: { streakDays: 365 },
  },

  // Score Achievements
  {
    id: 'perfect_score',
    type: 'perfect_score',
    title: 'Perfect!',
    description: 'Get 100% on a quiz',
    rarity: 'common',
    requirement: { scorePercentage: 100, perfectScores: 1 },
  },
  {
    id: 'perfect_5',
    type: 'perfect_score',
    title: 'Perfectionist',
    description: 'Get 100% on 5 quizzes',
    rarity: 'rare',
    requirement: { scorePercentage: 100, perfectScores: 5 },
  },
  {
    id: 'perfect_25',
    type: 'perfect_score',
    title: 'Flawless Master',
    description: 'Get 100% on 25 quizzes',
    rarity: 'epic',
    requirement: { scorePercentage: 100, perfectScores: 25 },
  },
  {
    id: 'high_scorer',
    type: 'score',
    title: 'High Scorer',
    description: 'Maintain 90%+ average across 10 quizzes',
    rarity: 'rare',
    requirement: { scorePercentage: 90, quizCount: 10 },
  },

  // Study Time Achievements
  {
    id: 'study_1h',
    type: 'study_time',
    title: 'Getting Started',
    description: 'Study for 1 hour total',
    rarity: 'common',
    requirement: { studyHours: 1 },
  },
  {
    id: 'study_10h',
    type: 'study_time',
    title: 'Dedicated Learner',
    description: 'Study for 10 hours total',
    rarity: 'common',
    requirement: { studyHours: 10 },
  },
  {
    id: 'study_50h',
    type: 'study_time',
    title: 'Serious Student',
    description: 'Study for 50 hours total',
    rarity: 'rare',
    requirement: { studyHours: 50 },
  },
  {
    id: 'study_100h',
    type: 'study_time',
    title: 'Master Student',
    description: 'Study for 100 hours total',
    rarity: 'epic',
    requirement: { studyHours: 100 },
  },
  {
    id: 'study_500h',
    type: 'study_time',
    title: 'Academic Excellence',
    description: 'Study for 500 hours total',
    rarity: 'legendary',
    requirement: { studyHours: 500 },
  },

  // Speed Achievements
  {
    id: 'speed_demon',
    type: 'speed',
    title: 'Speed Demon',
    description: 'Complete a quiz in under 30 seconds',
    rarity: 'rare',
    requirement: { fastTime: 30 },
  },
  {
    id: 'lightning_fast',
    type: 'speed',
    title: 'Lightning Fast',
    description: 'Complete a quiz in under 15 seconds',
    rarity: 'epic',
    requirement: { fastTime: 15 },
  },

  // Flashcard Achievements
  {
    id: 'flashcard_master',
    type: 'flashcard_master',
    title: 'Flashcard Master',
    description: 'Review 100 flashcards',
    rarity: 'common',
    requirement: { quizCount: 100 },
  },
  {
    id: 'flashcard_legend',
    type: 'flashcard_master',
    title: 'Flashcard Legend',
    description: 'Review 1000 flashcards',
    rarity: 'rare',
    requirement: { quizCount: 1000 },
  },
];

/**
 * Check user progress against achievement requirements
 */
export function checkAchievementProgress(
  achievement: AchievementDefinition,
  userStats: {
    quizCount: number;
    streakDays: number;
    averageScore: number;
    studyHours: number;
    perfectScores: number;
    fastestTime: number;
    flashcardsReviewed: number;
  }
): number {
  const req = achievement.requirement;

  if (req.quizCount) {
    return Math.min(100, (userStats.quizCount / req.quizCount) * 100);
  }

  if (req.streakDays) {
    return Math.min(100, (userStats.streakDays / req.streakDays) * 100);
  }

  if (req.scorePercentage && req.perfectScores) {
    return Math.min(100, (userStats.perfectScores / req.perfectScores) * 100);
  }

  if (req.studyHours) {
    return Math.min(100, (userStats.studyHours / req.studyHours) * 100);
  }

  if (req.fastTime) {
    return userStats.fastestTime <= req.fastTime ? 100 : 0;
  }

  return 0;
}

/**
 * Check if user has unlocked an achievement
 */
export function isAchievementUnlocked(
  achievement: AchievementDefinition,
  userStats: {
    quizCount: number;
    streakDays: number;
    averageScore: number;
    studyHours: number;
    perfectScores: number;
    fastestTime: number;
    flashcardsReviewed: number;
  }
): boolean {
  return checkAchievementProgress(achievement, userStats) >= 100;
}

/**
 * Get all achievements with user progress
 */
export function getUserAchievements(
  earnedAchievements: Array<{ achievementId: string; earnedAt: Date }>,
  userStats: {
    quizCount: number;
    streakDays: number;
    averageScore: number;
    studyHours: number;
    perfectScores: number;
    fastestTime: number;
    flashcardsReviewed: number;
  }
): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map((def) => {
    const earned = earnedAchievements.find((e) => e.achievementId === def.id);
    const progress = checkAchievementProgress(def, userStats);

    return {
      id: def.id,
      type: def.type,
      title: def.title,
      description: def.description,
      rarity: def.rarity,
      earnedAt: earned?.earnedAt,
      locked: !earned,
      progress: earned ? 100 : progress,
      metadata: {
        ...def.requirement,
      },
    };
  });
}

/**
 * Check for newly unlocked achievements
 * Returns array of newly unlocked achievement IDs
 */
export function checkNewAchievements(
  previousStats: any,
  currentStats: any,
  earnedAchievements: string[]
): string[] {
  const newlyUnlocked: string[] = [];

  for (const def of ACHIEVEMENT_DEFINITIONS) {
    // Skip if already earned
    if (earnedAchievements.includes(def.id)) {
      continue;
    }

    // Check if just unlocked
    const wasUnlocked = isAchievementUnlocked(def, previousStats);
    const isNowUnlocked = isAchievementUnlocked(def, currentStats);

    if (!wasUnlocked && isNowUnlocked) {
      newlyUnlocked.push(def.id);
    }
  }

  return newlyUnlocked;
}