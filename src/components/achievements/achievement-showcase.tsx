'use client';

import { useState } from 'react';
import { AchievementBadge, Achievement } from './achievement-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock, Star } from 'lucide-react';

interface AchievementShowcaseProps {
  achievements: Achievement[];
  userId?: string;
}

export function AchievementShowcase({ achievements }: AchievementShowcaseProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const earnedAchievements = achievements.filter(a => a.earnedAt && !a.locked);
  const lockedAchievements = achievements.filter(a => a.locked || !a.earnedAt);

  const byRarity = (rarity: string) =>
    earnedAchievements.filter(a => (a.rarity || 'common') === rarity);

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <p className="text-3xl font-bold">{earnedAchievements.length}</p>
              </div>
              <Trophy className="h-10 w-10 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="text-3xl font-bold">
                  {Math.round((earnedAchievements.length / achievements.length) * 100)}%
                </p>
              </div>
              <Star className="h-10 w-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">To Unlock</p>
                <p className="text-3xl font-bold">{lockedAchievements.length}</p>
              </div>
              <Lock className="h-10 w-10 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Your Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">
                All
                <Badge variant="secondary" className="ml-2">
                  {achievements.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="earned">
                Earned
                <Badge variant="secondary" className="ml-2">
                  {earnedAchievements.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="common">Common</TabsTrigger>
              <TabsTrigger value="rare">Rare</TabsTrigger>
              <TabsTrigger value="epic">Epic</TabsTrigger>
              <TabsTrigger value="legendary">Legendary</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                {achievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    size="md"
                    showProgress
                    onClick={() => setSelectedAchievement(achievement)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="earned" className="mt-6">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                {earnedAchievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    size="md"
                    onClick={() => setSelectedAchievement(achievement)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="common" className="mt-6">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                {byRarity('common').map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    size="md"
                    onClick={() => setSelectedAchievement(achievement)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rare" className="mt-6">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                {byRarity('rare').map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    size="md"
                    onClick={() => setSelectedAchievement(achievement)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="epic" className="mt-6">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                {byRarity('epic').map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    size="md"
                    onClick={() => setSelectedAchievement(achievement)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="legendary" className="mt-6">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                {byRarity('legendary').map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    size="md"
                    onClick={() => setSelectedAchievement(achievement)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recently Earned */}
      {earnedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {earnedAchievements
                .sort((a, b) => {
                  const dateA = a.earnedAt ? new Date(a.earnedAt).getTime() : 0;
                  const dateB = b.earnedAt ? new Date(b.earnedAt).getTime() : 0;
                  return dateB - dateA;
                })
                .slice(0, 10)
                .map((achievement) => (
                  <div key={achievement.id} className="flex-shrink-0">
                    <AchievementBadge
                      achievement={achievement}
                      size="lg"
                      onClick={() => setSelectedAchievement(achievement)}
                    />
                    <p className="text-xs text-center mt-2 text-muted-foreground truncate max-w-[128px]">
                      {achievement.title}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}