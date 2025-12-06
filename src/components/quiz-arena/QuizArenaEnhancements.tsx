// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Target, 
  Clock, 
  Users, 
  TrendingUp, 
  Award,
  Zap,
  Star,
  Crown,
  Medal,
  Flame,
  CheckCircle
} from 'lucide-react';

interface PlayerStats {
  userId: string;
  name: string;
  score: number;
  correctAnswers: number;
  totalAnswers: number;
  accuracy: string;
}

interface RoomAnalytics {
  roomInfo: {
    roomCode: string;
    totalQuestions: number;
    totalPlayers: number;
    started: boolean;
    finished: boolean;
  };
  playerStats: PlayerStats[];
  summary: {
    averageScore: string;
    totalAnswers: number;
    correctAnswers: number;
    overallAccuracy: string;
  };
}

interface QuizArenaEnhancementsProps {
  roomCode: string;
  isHost: boolean;
  currentUserId: string;
}

export function QuizArenaAnalytics({ roomCode, isHost, currentUserId }: QuizArenaEnhancementsProps) {
  const [analytics, setAnalytics] = useState<RoomAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    if (!isHost) return;
    
    setLoading(true);
    try {
      const user = await import('@/hooks/useAuth').then(m => m.useAuth().user);
      if (!user) return;

      const idToken = await user.getIdToken();
      const response = await fetch(`/api/quiz-arena/room-analytics?roomCode=${roomCode}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isHost) {
      fetchAnalytics();
    }
  }, [roomCode, isHost]);

  if (!isHost || !analytics) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Room Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{analytics.roomInfo.totalPlayers}</div>
              <div className="text-sm text-muted-foreground">Players</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{analytics.summary.overallAccuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{analytics.summary.averageScore}</div>
              <div className="text-sm text-muted-foreground">Avg Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{analytics.summary.totalAnswers}</div>
              <div className="text-sm text-muted-foreground">Total Answers</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Top Performers</h4>
            {analytics.playerStats.slice(0, 5).map((player, index) => (
              <div key={player.userId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-600' :
                    index === 1 ? 'bg-gray-500/20 text-gray-600' :
                    index === 2 ? 'bg-orange-500/20 text-orange-600' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
                  </div>
                  <div>
                    <div className="font-medium">{player.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {player.correctAnswers}/{player.totalAnswers} correct ({player.accuracy}%)
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{player.score}</div>
                  <div className="text-sm text-muted-foreground">points</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function QuizArenaAchievements({ playerStats }: { playerStats: PlayerStats }) {
  const achievements = [];

  if (playerStats.accuracy === '100.0' && playerStats.totalAnswers > 0) {
    achievements.push({
      icon: <Crown className="h-5 w-5 text-yellow-500" />,
      title: 'Perfect Score!',
      description: 'Answered all questions correctly',
      rarity: 'legendary'
    });
  }

  if (playerStats.score > 50) {
    achievements.push({
      icon: <Zap className="h-5 w-5 text-blue-500" />,
      title: 'Quiz Master',
      description: 'Scored over 50 points',
      rarity: 'epic'
    });
  }

  if (playerStats.correctAnswers > 0) {
    achievements.push({
      icon: <Target className="h-5 w-5 text-green-500" />,
      title: 'First Strike',
      description: 'Got your first answer right',
      rarity: 'common'
    });
  }

  if (achievements.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-500" />
          Achievements Unlocked
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border ${
              achievement.rarity === 'legendary' ? 'bg-yellow-500/10 border-yellow-500/30' :
              achievement.rarity === 'epic' ? 'bg-purple-500/10 border-purple-500/30' :
              'bg-green-500/10 border-green-500/30'
            }`}>
              {achievement.icon}
              <div>
                <div className="font-semibold">{achievement.title}</div>
                <div className="text-sm text-muted-foreground">{achievement.description}</div>
              </div>
              <Badge variant="outline" className="ml-auto">
                {achievement.rarity}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function QuizArenaLiveStats({ 
  currentQuestion, 
  totalQuestions, 
  timeLeft, 
  playersAnswered, 
  totalPlayers 
}: {
  currentQuestion: number;
  totalQuestions: number;
  timeLeft: number;
  playersAnswered: number;
  totalPlayers: number;
}) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const answerProgress = (playersAnswered / totalPlayers) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Live Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Quiz Progress</span>
            <span>{currentQuestion + 1}/{totalQuestions}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Players Answered</span>
            <span>{playersAnswered}/{totalPlayers}</span>
          </div>
          <Progress value={answerProgress} className="h-2" />
        </div>

        <div className="text-center">
          <div className={`text-3xl font-bold ${
            timeLeft <= 5 ? 'text-red-500 animate-pulse' :
            timeLeft <= 10 ? 'text-orange-500' : 'text-green-500'
          }`}>
            {timeLeft}s
          </div>
          <div className="text-sm text-muted-foreground">Time Remaining</div>
        </div>
      </CardContent>
    </Card>
  );
}