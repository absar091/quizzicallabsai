'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';

interface RateLimitStatus {
  remainingQuizzes: number;
  remainingFlashcards: number;
  isRestricted: boolean;
  cooldownTime?: number;
}

export function RateLimitDisplay({ userId, isPro }: { userId: string; isPro: boolean }) {
  const [status, setStatus] = useState<RateLimitStatus | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    // Fetch current rate limit status
    fetch('/api/rate-limit-status')
      .then(res => res.json())
      .then(setStatus);
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  if (!status) return null;

  const maxQuizzes = isPro ? 20 : 5;
  const maxFlashcards = isPro ? 50 : 10;

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Quiz Generation</span>
              <span>{status.remainingQuizzes}/{maxQuizzes}</span>
            </div>
            <Progress value={(status.remainingQuizzes / maxQuizzes) * 100} />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Flashcard Generation</span>
              <span>{status.remainingFlashcards}/{maxFlashcards}</span>
            </div>
            <Progress value={(status.remainingFlashcards / maxFlashcards) * 100} />
          </div>

          {cooldown > 0 && (
            <div className="text-sm text-orange-600">
              Cooldown: {cooldown}s remaining
            </div>
          )}

          {status.isRestricted && (
            <div className="text-sm text-red-600 font-medium">
              Account temporarily restricted due to unusual activity
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}