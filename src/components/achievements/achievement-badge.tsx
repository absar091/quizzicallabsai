'use client';

import { Trophy, Flame, Target, Clock, Zap, Star, Award, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Achievement {
  id: string;
  type: 'quiz_complete' | 'streak' | 'score' | 'flashcard_master' | 'study_time' | 'speed' | 'perfect_score';
  title: string;
  description: string;
  icon?: string;
  earnedAt?: Date;
  progress?: number; // 0-100 for achievements in progress
  locked?: boolean;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  metadata?: {
    quizCount?: number;
    streakDays?: number;
    scorePercentage?: number;
    studyHours?: number;
    fastTime?: number;
  };
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  onClick?: () => void;
}

const achievementIcons = {
  quiz_complete: Trophy,
  streak: Flame,
  score: Target,
  flashcard_master: BookOpen,
  study_time: Clock,
  speed: Zap,
  perfect_score: Star,
};

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500',
};

const rarityGlow = {
  common: 'shadow-gray-500/20',
  rare: 'shadow-blue-500/40',
  epic: 'shadow-purple-500/40',
  legendary: 'shadow-yellow-500/60',
};

export function AchievementBadge({
  achievement,
  size = 'md',
  showProgress = false,
  onClick,
}: AchievementBadgeProps) {
  const Icon = achievementIcons[achievement.type] || Award;
  const isLocked = achievement.locked || !achievement.earnedAt;
  const rarity = achievement.rarity || 'common';

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const iconSizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div
      className={cn(
        'relative group cursor-pointer transition-all duration-300',
        onClick && 'hover:scale-110'
      )}
      onClick={onClick}
    >
      {/* Badge Container */}
      <div
        className={cn(
          sizeClasses[size],
          'relative rounded-full flex items-center justify-center',
          'transition-all duration-300',
          isLocked
            ? 'bg-muted border-2 border-muted-foreground/20 grayscale'
            : `bg-gradient-to-br ${rarityColors[rarity]} ${rarityGlow[rarity]} shadow-xl`,
          !isLocked && 'group-hover:shadow-2xl'
        )}
      >
        <Icon
          className={cn(
            iconSizes[size],
            isLocked ? 'text-muted-foreground' : 'text-white',
            'transition-transform duration-300 group-hover:scale-110'
          )}
        />

        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        )}

        {/* Rarity Badge */}
        {!isLocked && rarity !== 'common' && (
          <Badge
            className={cn(
              'absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 capitalize',
              rarity === 'legendary' && 'bg-yellow-500 text-white animate-pulse'
            )}
          >
            {rarity}
          </Badge>
        )}
      </div>

      {/* Progress Ring */}
      {showProgress && achievement.progress !== undefined && isLocked && (
        <svg
          className="absolute inset-0 -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted-foreground/20"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={`${achievement.progress * 2.827} 282.7`}
            className="text-primary transition-all duration-500"
          />
        </svg>
      )}

      {/* Tooltip/Hover Card */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        <Card className="w-64 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
                  isLocked
                    ? 'bg-muted'
                    : `bg-gradient-to-br ${rarityColors[rarity]}`
                )}
              >
                <Icon className={cn('h-6 w-6', isLocked ? 'text-muted-foreground' : 'text-white')} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm mb-1">{achievement.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>

                {achievement.metadata && (
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {achievement.metadata.quizCount && (
                      <div>Quizzes: {achievement.metadata.quizCount}</div>
                    )}
                    {achievement.metadata.streakDays && (
                      <div>Streak: {achievement.metadata.streakDays} days</div>
                    )}
                    {achievement.metadata.scorePercentage && (
                      <div>Score: {achievement.metadata.scorePercentage}%</div>
                    )}
                    {achievement.metadata.studyHours && (
                      <div>Study time: {achievement.metadata.studyHours}h</div>
                    )}
                  </div>
                )}

                {isLocked && achievement.progress !== undefined && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {!isLocked && achievement.earnedAt && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}