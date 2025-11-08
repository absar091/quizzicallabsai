'use client';

import { useState, useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Zap, FileText, TrendingUp, Crown } from 'lucide-react';
import Link from 'next/link';
import { PLAN_LIMITS } from '@/lib/whop';

interface UsageLimitModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  limitType?: 'token' | 'quiz' | 'both';
  autoShow?: boolean;
}

export function UsageLimitModal({ 
  open: controlledOpen, 
  onOpenChange, 
  limitType = 'both',
  autoShow = true 
}: UsageLimitModalProps) {
  const { usage, loading } = useSubscription();
  const [internalOpen, setInternalOpen] = useState(false);
  const [hasShownWarning, setHasShownWarning] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange || (() => {})) : setInternalOpen;

  useEffect(() => {
    if (!usage || loading || !autoShow || hasShownWarning) return;

    const tokenPercentage = (usage.tokens_used / usage.tokens_limit) * 100;
    const quizPercentage = (usage.quizzes_used / usage.quizzes_limit) * 100;

    // Show modal if user has exceeded or is very close to limits
    const shouldShow = 
      (limitType === 'token' && tokenPercentage >= 95) ||
      (limitType === 'quiz' && quizPercentage >= 95) ||
      (limitType === 'both' && (tokenPercentage >= 95 || quizPercentage >= 95));

    if (shouldShow && !isControlled) {
      setInternalOpen(true);
      setHasShownWarning(true);
    }
  }, [usage, loading, limitType, autoShow, hasShownWarning, isControlled]);

  if (loading || !usage) return null;

  const tokenPercentage = (usage.tokens_used / usage.tokens_limit) * 100;
  const quizPercentage = (usage.quizzes_used / usage.quizzes_limit) * 100;
  const currentPlan = PLAN_LIMITS[usage.plan as keyof typeof PLAN_LIMITS];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const getNextPlan = () => {
    const plans = ['free', 'basic', 'pro', 'premium'];
    const currentIndex = plans.indexOf(usage.plan);
    if (currentIndex < plans.length - 1) {
      return plans[currentIndex + 1];
    }
    return null;
  };

  const nextPlan = getNextPlan();
  const nextPlanLimits = nextPlan ? PLAN_LIMITS[nextPlan as keyof typeof PLAN_LIMITS] : null;

  const isTokenLimitReached = tokenPercentage >= 100;
  const isQuizLimitReached = quizPercentage >= 100;
  const isAnyLimitReached = isTokenLimitReached || isQuizLimitReached;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full ${isAnyLimitReached ? 'bg-red-100' : 'bg-yellow-100'}`}>
              <AlertTriangle className={`h-6 w-6 ${isAnyLimitReached ? 'text-red-600' : 'text-yellow-600'}`} />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {isAnyLimitReached ? 'Usage Limit Reached' : 'Approaching Usage Limit'}
              </DialogTitle>
              <Badge variant={isAnyLimitReached ? 'destructive' : 'secondary'} className="mt-1">
                {usage.plan.toUpperCase()} PLAN
              </Badge>
            </div>
          </div>
          <DialogDescription className="text-base">
            {isAnyLimitReached 
              ? "You've reached your plan limits. Upgrade to continue using AI features."
              : "You're running low on resources. Consider upgrading to avoid interruptions."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Token Usage */}
          {(limitType === 'token' || limitType === 'both') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">AI Tokens</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatNumber(usage.tokens_used)} / {formatNumber(usage.tokens_limit)}
                </span>
              </div>
              <Progress 
                value={tokenPercentage} 
                className={`h-2 ${tokenPercentage >= 100 ? 'bg-red-100' : tokenPercentage >= 90 ? 'bg-yellow-100' : ''}`}
              />
              <p className="text-xs text-muted-foreground">
                {isTokenLimitReached 
                  ? '❌ Token limit reached'
                  : `${formatNumber(usage.tokens_remaining)} tokens remaining (${(100 - tokenPercentage).toFixed(1)}%)`
                }
              </p>
            </div>
          )}

          {/* Quiz Usage */}
          {(limitType === 'quiz' || limitType === 'both') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Quizzes</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {usage.quizzes_used} / {usage.quizzes_limit}
                </span>
              </div>
              <Progress 
                value={quizPercentage} 
                className={`h-2 ${quizPercentage >= 100 ? 'bg-red-100' : quizPercentage >= 90 ? 'bg-yellow-100' : ''}`}
              />
              <p className="text-xs text-muted-foreground">
                {isQuizLimitReached 
                  ? '❌ Quiz limit reached'
                  : `${usage.quizzes_remaining} quizzes remaining (${(100 - quizPercentage).toFixed(1)}%)`
                }
              </p>
            </div>
          )}

          {/* Upgrade Benefits */}
          {nextPlan && nextPlanLimits && (
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
              <div className="flex items-start gap-3">
                <Crown className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-2 capitalize">
                    Upgrade to {nextPlan} Plan
                  </h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3" />
                      <span>{formatNumber(nextPlanLimits.tokens)} tokens/month</span>
                      <Badge variant="secondary" className="text-xs">
                        +{formatNumber(nextPlanLimits.tokens - currentPlan.tokens)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      <span>{nextPlanLimits.quizzes} quizzes/month</span>
                      <Badge variant="secondary" className="text-xs">
                        +{nextPlanLimits.quizzes - currentPlan.quizzes}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3" />
                      <span className="font-medium text-primary">
                        ${nextPlanLimits.price_usd}/month
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing Cycle Info */}
          {usage.billing_cycle_end && (
            <div className="text-center text-sm text-muted-foreground pt-2 border-t">
              <p>
                Your usage resets on{' '}
                <span className="font-medium">
                  {new Date(usage.billing_cycle_end).toLocaleDateString()}
                </span>
                {' '}({Math.ceil((new Date(usage.billing_cycle_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days)
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
            Continue with Current Plan
          </Button>
          {nextPlan ? (
            <Button asChild className="w-full sm:w-auto">
              <Link href="/pricing">
                Upgrade to {nextPlan.charAt(0).toUpperCase() + nextPlan.slice(1)}
              </Link>
            </Button>
          ) : (
            <Button asChild className="w-full sm:w-auto">
              <Link href="/pricing">View All Plans</Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook to easily trigger the modal
export function useUsageLimitModal() {
  const [open, setOpen] = useState(false);
  const { usage } = useSubscription();

  const checkAndShowModal = (actionType: 'token' | 'quiz', amount: number = 1) => {
    if (!usage) return false;

    const willExceed = actionType === 'token'
      ? usage.tokens_used + amount > usage.tokens_limit
      : usage.quizzes_used + amount > usage.quizzes_limit;

    if (willExceed) {
      setOpen(true);
      return true;
    }

    return false;
  };

  return {
    open,
    setOpen,
    checkAndShowModal,
    UsageLimitModal: () => <UsageLimitModal open={open} onOpenChange={setOpen} />,
  };
}