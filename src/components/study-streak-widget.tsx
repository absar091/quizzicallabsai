'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy, Calendar } from 'lucide-react';
import { StudyStreakManager, StudyStreak } from '@/lib/study-streaks';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

export function StudyStreakWidget() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<StudyStreak | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadStreak = async () => {
      try {
        const { db } = await import('@/lib/firebase');
        const { ref, get } = await import('firebase/database');
        const streakRef = ref(db, `users/${user.uid}/study_streak`);
        const snapshot = await get(streakRef);
        
        if (snapshot.exists()) {
          setStreak(snapshot.val());
        } else {
          // Initialize new streak
          const newStreak: StudyStreak = {
            userId: user.uid,
            currentStreak: 0,
            longestStreak: 0,
            lastStudyDate: '',
            totalStudyDays: 0,
            streakMilestones: []
          };
          setStreak(newStreak);
        }
      } catch (error) {
        console.error('Failed to load streak:', error);
      }
    };

    loadStreak();
  }, [user]);

  if (!streak) return null;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="h-5 w-5 text-orange-500" />
          Study Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-orange-500"
            >
              {streak.currentStreak}
            </motion.div>
            <p className="text-sm text-muted-foreground">Days in a row</p>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium">
              {StudyStreakManager.getStreakMessage(streak.currentStreak)}
            </p>
          </div>

          <div className="flex justify-between text-sm">
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{streak.longestStreak}</span>
              </div>
              <p className="text-muted-foreground">Best</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{streak.totalStudyDays}</span>
              </div>
              <p className="text-muted-foreground">Total</p>
            </div>
          </div>

          {streak.streakMilestones && streak.streakMilestones.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {streak.streakMilestones.map(milestone => (
                <Badge key={milestone} variant="secondary" className="text-xs">
                  {milestone} days
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}