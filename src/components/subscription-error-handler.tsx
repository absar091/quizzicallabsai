'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  XCircle, 
  Info, 
  CheckCircle, 
  RefreshCw,
  Mail,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

export interface SubscriptionError {
  code: string;
  message: string;
  details?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

interface SubscriptionErrorHandlerProps {
  error: SubscriptionError | null;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export function SubscriptionErrorHandler({ 
  error, 
  onDismiss, 
  onRetry 
}: SubscriptionErrorHandlerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
    }
  }, [error]);

  if (!error || !isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const getErrorConfig = (code: string) => {
    const configs: Record<string, {
      icon: any;
      variant: 'default' | 'destructive';
      title: string;
      helpText: string;
      actions: Array<{ label: string; href?: string; onClick?: () => void; variant?: 'default' | 'outline' }>;
    }> = {
      'AUTH_REQUIRED': {
        icon: AlertTriangle,
        variant: 'destructive',
        title: 'Authentication Required',
        helpText: 'Please sign in to access subscription features.',
        actions: [
          { label: 'Sign In', href: '/login' },
          { label: 'Dismiss', onClick: handleDismiss, variant: 'outline' }
        ]
      },
      'INVALID_TOKEN': {
        icon: XCircle,
        variant: 'destructive',
        title: 'Session Expired',
        helpText: 'Your session has expired. Please sign in again to continue.',
        actions: [
          { label: 'Sign In', href: '/login' },
          { label: 'Dismiss', onClick: handleDismiss, variant: 'outline' }
        ]
      },
      'USAGE_LIMIT_EXCEEDED': {
        icon: AlertTriangle,
        variant: 'destructive',
        title: 'Usage Limit Reached',
        helpText: 'You\'ve reached your plan limits. Upgrade to continue using AI features.',
        actions: [
          { label: 'Upgrade Plan', href: '/pricing' },
          { label: 'View Usage', href: '/billing', variant: 'outline' }
        ]
      },
      'SUBSCRIPTION_NOT_FOUND': {
        icon: Info,
        variant: 'default',
        title: 'Subscription Not Found',
        helpText: 'We couldn\'t find your subscription. This might be a temporary issue.',
        actions: [
          { label: 'Retry', onClick: onRetry },
          { label: 'Contact Support', href: '/contact', variant: 'outline' }
        ]
      },
      'CHECKOUT_FAILED': {
        icon: XCircle,
        variant: 'destructive',
        title: 'Checkout Failed',
        helpText: 'We couldn\'t create your checkout session. Please try again.',
        actions: [
          { label: 'Try Again', onClick: onRetry },
          { label: 'Contact Support', href: '/contact', variant: 'outline' }
        ]
      },
      'PLAN_CHANGE_FAILED': {
        icon: XCircle,
        variant: 'destructive',
        title: 'Plan Change Failed',
        helpText: 'We couldn\'t process your plan change. Please try again or contact support.',
        actions: [
          { label: 'Try Again', onClick: onRetry },
          { label: 'View Plans', href: '/pricing', variant: 'outline' }
        ]
      },
      'INVALID_PLAN': {
        icon: AlertTriangle,
        variant: 'destructive',
        title: 'Invalid Plan Selected',
        helpText: 'The selected plan is not available. Please choose a different plan.',
        actions: [
          { label: 'View Plans', href: '/pricing' },
          { label: 'Dismiss', onClick: handleDismiss, variant: 'outline' }
        ]
      },
      'PAYMENT_FAILED': {
        icon: XCircle,
        variant: 'destructive',
        title: 'Payment Failed',
        helpText: 'Your payment couldn\'t be processed. Please check your payment method and try again.',
        actions: [
          { label: 'Try Again', onClick: onRetry },
          { label: 'Update Payment', href: '/billing', variant: 'outline' }
        ]
      },
      'INTERNAL_ERROR': {
        icon: XCircle,
        variant: 'destructive',
        title: 'Something Went Wrong',
        helpText: 'An unexpected error occurred. Our team has been notified.',
        actions: [
          { label: 'Try Again', onClick: onRetry },
          { label: 'Contact Support', href: '/contact', variant: 'outline' }
        ]
      },
      'NETWORK_ERROR': {
        icon: AlertTriangle,
        variant: 'default',
        title: 'Connection Issue',
        helpText: 'We couldn\'t connect to our servers. Please check your internet connection.',
        actions: [
          { label: 'Retry', onClick: onRetry },
          { label: 'Dismiss', onClick: handleDismiss, variant: 'outline' }
        ]
      }
    };

    return configs[code] || {
      icon: Info,
      variant: 'default' as const,
      title: 'Notice',
      helpText: 'Something unexpected happened. Please try again.',
      actions: [
        { label: 'Try Again', onClick: onRetry },
        { label: 'Dismiss', onClick: handleDismiss, variant: 'outline' as const }
      ]
    };
  };

  const config = getErrorConfig(error.code);
  const Icon = config.icon;

  return (
    <Alert variant={config.variant} className="mb-4">
      <Icon className="h-4 w-4" />
      <AlertTitle className="flex items-center justify-between">
        {config.title}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-6 w-6 p-0"
        >
          <XCircle className="h-4 w-4" />
        </Button>
      </AlertTitle>
      <AlertDescription className="space-y-3">
        <p>{error.message || config.helpText}</p>
        
        {error.details && (
          <details className="text-sm text-muted-foreground">
            <summary className="cursor-pointer hover:underline">Technical Details</summary>
            <p className="mt-2 font-mono text-xs bg-muted p-2 rounded">
              {error.details}
            </p>
          </details>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          {config.actions.map((action, index) => (
            action.href ? (
              <Button
                key={index}
                variant={action.variant || 'default'}
                size="sm"
                asChild
              >
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ) : (
              <Button
                key={index}
                variant={action.variant || 'default'}
                size="sm"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )
          ))}
        </div>

        {/* Help Resources */}
        <div className="pt-3 border-t mt-3">
          <p className="text-xs text-muted-foreground mb-2">Need help?</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link href="/help" className="flex items-center gap-1 hover:underline">
              <HelpCircle className="h-3 w-3" />
              Help Center
            </Link>
            <Link href="/contact" className="flex items-center gap-1 hover:underline">
              <Mail className="h-3 w-3" />
              Contact Support
            </Link>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Hook for managing subscription errors
export function useSubscriptionError() {
  const [error, setError] = useState<SubscriptionError | null>(null);

  const handleError = (err: any, context?: string) => {
    console.error(`Subscription error (${context}):`, err);

    // Parse error
    let subscriptionError: SubscriptionError;

    if (err.response) {
      // API error response
      const data = err.response.data;
      subscriptionError = {
        code: data.code || 'UNKNOWN_ERROR',
        message: data.message || 'An error occurred',
        details: data.details || err.message
      };
    } else if (err.code) {
      // Firebase or custom error
      subscriptionError = {
        code: err.code,
        message: err.message || 'An error occurred',
        details: err.details
      };
    } else if (err.message?.includes('fetch')) {
      // Network error
      subscriptionError = {
        code: 'NETWORK_ERROR',
        message: 'Connection failed. Please check your internet connection.',
        details: err.message
      };
    } else {
      // Generic error
      subscriptionError = {
        code: 'INTERNAL_ERROR',
        message: err.message || 'An unexpected error occurred',
        details: JSON.stringify(err)
      };
    }

    setError(subscriptionError);
  };

  const clearError = () => setError(null);

  return {
    error,
    setError,
    handleError,
    clearError,
    ErrorDisplay: () => (
      <SubscriptionErrorHandler 
        error={error} 
        onDismiss={clearError}
        onRetry={() => {
          clearError();
          // Trigger retry logic if needed
        }}
      />
    )
  };
}

// Success notification component
export function SubscriptionSuccess({ 
  message, 
  onDismiss 
}: { 
  message: string; 
  onDismiss?: () => void;
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!isVisible) return null;

  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-900">Success!</AlertTitle>
      <AlertDescription className="text-green-800">
        {message}
      </AlertDescription>
    </Alert>
  );
}
