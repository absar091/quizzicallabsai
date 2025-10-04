'use client';

import { useAuth } from '@/hooks/useAuth';
import { useStudyStreak } from '@/lib/study-streak';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar, Trophy, Target } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function StudyStreakCard() {
  const { user } = useAuth();
  const { streak, loading, error, updateStreak } = useStudyStreak(user?.uid || null);

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Study Streak
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-full" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !streak) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Unable to load streak data
        </CardContent>
      </Card>
    );
  }

  const today = new Date().toDateString();
  const isActiveToday = streak.lastStudyDate === today;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className={`h-5 w-5 ${streak.currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
            Study Streak
          </div>
          {isActiveToday && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Active Today
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Streak */}
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">
            {streak.currentStreak}
          </div>
          <div className="text-sm text-muted-foreground">
            {streak.currentStreak === 1 ? 'day' : 'days'} current streak
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Trophy className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="text-lg font-semibold">{streak.longestStreak}</div>
            <div className="text-xs text-muted-foreground">Best</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Calendar className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-lg font-semibold">{streak.totalStudyDays}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Target className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-lg font-semibold">
              {Math.round((streak.totalStudyDays / Math.max(1, Math.ceil((Date.now() - new Date(streak.streakStartDate || Date.now()).getTime()) / (1000 * 60 * 60 * 24)))) * 100) || 0}%
            </div>
            <div className="text-xs text-muted-foreground">Rate</div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {isActiveToday 
              ? `Great job! You've studied ${streak.currentStreak} ${streak.currentStreak === 1 ? 'day' : 'days'} in a row.`
              : streak.currentStreak > 0 
                ? `Don't break your ${streak.currentStreak}-day streak! Study today.`
                : "Start your study streak today!"
            }
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress to next milestone</span>
            <span>{streak.currentStreak % 7}/7</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(streak.currentStreak % 7) * (100/7)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StudyStreakBadge() {
  const { user } = useAuth();
  const { streak, loading } = useStudyStreak(user?.uid || null);

  if (loading || !streak) return null;

  if (streak.currentStreak === 0) return null;

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <Flame className="h-3 w-3 text-orange-500" />
      {streak.currentStreak} day streak
    </Badge>
  );
}