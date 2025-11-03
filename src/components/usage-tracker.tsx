'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, FileText, Calendar, Crown } from 'lucide-react';
import Link from 'next/link';

interface UsageTrackerProps {
  showUpgradeButton?: boolean;
  compact?: boolean;
}

export function UsageTracker({ showUpgradeButton = true, compact = false }: UsageTrackerProps) {
  const { usage, loading, error } = useSubscription();

  if (loading) {
    return (
      <Card className={compact ? 'p-4' : ''}>
        <CardContent className={compact ? 'p-0' : 'pt-6'}>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !usage) {
    return (
      <Card className={compact ? 'p-4' : ''}>
        <CardContent className={compact ? 'p-0' : 'pt-6'}>
          <p className="text-sm text-muted-foreground">
            {error || 'Unable to load usage data'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const tokenPercentage = (usage.tokens_used / usage.tokens_limit) * 100;
  const quizPercentage = (usage.quizzes_used / usage.quizzes_limit) * 100;

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-500';
      case 'pro': return 'bg-purple-500';
      case 'premium': return 'bg-gold-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'basic': return <Zap className="h-4 w-4" />;
      case 'pro': return <Crown className="h-4 w-4" />;
      case 'premium': return <Crown className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="capitalize">
            {getPlanIcon(usage.plan)}
            <span className="ml-1">{usage.plan} Plan</span>
          </Badge>
          {usage.plan === 'free' && showUpgradeButton && (
            <Button size="sm" asChild>
              <Link href="/pricing">Upgrade</Link>
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <Zap className="h-3 w-3 mr-1" />
              Tokens
            </span>
            <span className="font-medium">
              {formatNumber(usage.tokens_used)} / {formatNumber(usage.tokens_limit)}
            </span>
          </div>
          <Progress value={tokenPercentage} className="h-1" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <FileText className="h-3 w-3 mr-1" />
              Quizzes
            </span>
            <span className="font-medium">
              {usage.quizzes_used} / {usage.quizzes_limit}
            </span>
          </div>
          <Progress value={quizPercentage} className="h-1" />
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            {getPlanIcon(usage.plan)}
            <span className="ml-2 capitalize">{usage.plan} Plan</span>
          </CardTitle>
          {usage.plan === 'free' && showUpgradeButton && (
            <Button size="sm" asChild>
              <Link href="/pricing">Upgrade</Link>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Token Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm font-medium">
              <Zap className="h-4 w-4 mr-2 text-yellow-500" />
              AI Tokens
            </div>
            <span className="text-sm font-medium">
              {formatNumber(usage.tokens_used)} / {formatNumber(usage.tokens_limit)}
            </span>
          </div>
          <Progress value={tokenPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {formatNumber(usage.tokens_remaining)} tokens remaining
          </p>
        </div>

        {/* Quiz Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm font-medium">
              <FileText className="h-4 w-4 mr-2 text-blue-500" />
              Quizzes This Month
            </div>
            <span className="text-sm font-medium">
              {usage.quizzes_used} / {usage.quizzes_limit}
            </span>
          </div>
          <Progress value={quizPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {usage.quizzes_remaining} quizzes remaining
          </p>
        </div>

        {/* Billing Cycle */}
        {usage.billing_cycle_end && (
          <div className="pt-2 border-t">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Resets on {new Date(usage.billing_cycle_end).toLocaleDateString()}
            </div>
          </div>
        )}

        {/* Warnings */}
        {tokenPercentage > 80 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ You're running low on tokens. Consider upgrading to avoid interruptions.
            </p>
          </div>
        )}

        {quizPercentage > 80 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ You're approaching your quiz limit for this month.
            </p>
          </div>
        )}

        {(tokenPercentage >= 100 || quizPercentage >= 100) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800 mb-2">
              🚫 You've reached your plan limits. Upgrade to continue using AI features.
            </p>
            {showUpgradeButton && (
              <Button size="sm" asChild>
                <Link href="/pricing">Upgrade Now</Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}