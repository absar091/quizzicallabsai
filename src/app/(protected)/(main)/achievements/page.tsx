'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AchievementShowcase } from '@/components/achievements/achievement-showcase';
import { getUserAchievements } from '@/lib/achievement-system';
import { Achievement } from '@/components/achievements/achievement-badge';
import { Loader2 } from 'lucide-react';
import PageHeader from '@/components/page-header';

export default function AchievementsPage() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadAchievements = async () => {
      try {
        // Fetch user's earned achievements from API
        const response = await fetch('/api/achievements', {
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch achievements');
        }

        const data = await response.json();

        // Mock user stats for now - would come from database
        const userStats = {
          quizCount: data.stats?.totalQuizzesTaken || 0,
          streakDays: data.stats?.studyStreak || 0,
          averageScore: data.stats?.averageScore || 0,
          studyHours: Math.floor((data.stats?.totalStudyTime || 0) / 60),
          perfectScores: data.stats?.perfectScores || 0,
          fastestTime: data.stats?.fastestTime || 999,
          flashcardsReviewed: data.stats?.flashcardsReviewed || 0,
        };

        // Combine with achievement system
        const userAchievements = getUserAchievements(
          data.achievements || [],
          userStats
        );

        setAchievements(userAchievements);
      } catch (error) {
        console.error('Error loading achievements:', error);

        // Fallback to empty achievements if API fails
        const userAchievements = getUserAchievements([], {
          quizCount: 0,
          streakDays: 0,
          averageScore: 0,
          studyHours: 0,
          perfectScores: 0,
          fastestTime: 999,
          flashcardsReviewed: 0,
        });

        setAchievements(userAchievements);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PageHeader
        title="Achievements"
        description="Track your progress and unlock badges as you learn"
      />

      <div className="mt-8">
        <AchievementShowcase achievements={achievements} userId={user?.uid} />
      </div>
    </div>
  );
}