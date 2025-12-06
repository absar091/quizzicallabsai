'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ApiErrorDetails } from '@/lib/api-error-handler';

interface LimitReachedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
  details?: ApiErrorDetails;
}

export function LimitReachedDialog({
  open,
  onOpenChange,
  title = '🪙 Usage Limit Reached',
  message = 'Your usage limit has been reached.',
  details,
}: LimitReachedDialogProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleUpgrade = () => {
    setIsNavigating(true);
    const upgradeUrl = details?.upgradeUrl || '/pricing';
    router.push(upgradeUrl);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">{title}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 text-base">
            <p className="text-foreground">{message}</p>
            
            {details && (
              <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                {details.planName && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Plan:</span>
                    <span className="font-semibold">{details.planName}</span>
                  </div>
                )}
                
                {details.tokensUsed !== undefined && details.tokensLimit !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Usage:</span>
                    <span className="font-semibold">
                      {details.tokensUsed.toLocaleString()} / {details.tokensLimit.toLocaleString()} tokens
                    </span>
                  </div>
                )}
                
                {details.resetDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Limit Resets:</span>
                    <span className="font-semibold">{details.resetDate}</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <p className="font-semibold text-foreground">You have two options:</p>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>
                    <strong>Upgrade your plan</strong> to get instant access to more tokens and premium features
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>
                    <strong>Wait for reset</strong> on {details?.resetDate || 'the 1st of next month'} to continue with your current plan
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3 rounded-lg text-sm">
              <p className="text-blue-900 dark:text-blue-100">
                <strong>💡 Need help?</strong> Contact our support team at{' '}
                <a 
                  href="mailto:support@quizzicallabs.com" 
                  className="underline hover:text-blue-700 dark:hover:text-blue-300"
                >
                  support@quizzicallabs.com
                </a>
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel disabled={isNavigating}>
            Close
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUpgrade}
            disabled={isNavigating}
            className="bg-primary hover:bg-primary/90"
          >
            {isNavigating ? 'Loading...' : 'View Pricing & Upgrade'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
