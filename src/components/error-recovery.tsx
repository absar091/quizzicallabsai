"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCw, Wifi, WifiOff, Clock, Server, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface ErrorRecoveryProps {
  error: Error | string;
  onRetry: () => void;
  maxRetries?: number;
  currentRetry?: number;
  operation?: string;
  showDetails?: boolean;
}

interface RetryState {
  isRetrying: boolean;
  retryCount: number;
  lastError: Error | string | null;
  nextRetryIn: number;
}

export function ErrorRecovery({
  error,
  onRetry,
  maxRetries = 3,
  currentRetry = 0,
  operation = "operation",
  showDetails = false
}: ErrorRecoveryProps) {
  const [retryState, setRetryState] = useState<RetryState>({
    isRetrying: false,
    retryCount: currentRetry,
    lastError: error,
    nextRetryIn: 0
  });

  const getErrorType = (error: Error | string): 'network' | 'timeout' | 'server' | 'quota' | 'unknown' => {
    const errorMessage = typeof error === 'string' ? error : error.message;

    if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
      return 'network';
    }
    if (errorMessage.includes('timeout') || errorMessage.includes('deadline')) {
      return 'timeout';
    }
    if (errorMessage.includes('quota') || errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      return 'quota';
    }
    if (errorMessage.includes('500') || errorMessage.includes('502') || errorMessage.includes('503') || errorMessage.includes('server')) {
      return 'server';
    }
    return 'unknown';
  };

  const getErrorConfig = (errorType: string) => {
    const configs = {
      network: {
        icon: WifiOff,
        title: "Connection Problem",
        message: "Unable to connect to our servers. Please check your internet connection.",
        suggestion: "Check your internet connection and try again.",
        color: "destructive"
      },
      timeout: {
        icon: Clock,
        title: "Request Timeout",
        message: "The request is taking too long to complete.",
        suggestion: "The servers might be busy. Please try again in a moment.",
        color: "warning"
      },
      server: {
        icon: Server,
        title: "Server Error",
        message: "Our servers are experiencing issues.",
        suggestion: "This is usually temporary. Please try again.",
        color: "destructive"
      },
      quota: {
        icon: AlertTriangle,
        title: "Rate Limit Exceeded",
        message: "You've made too many requests recently.",
        suggestion: "Please wait a moment before trying again.",
        color: "warning"
      },
      unknown: {
        icon: AlertCircle,
        title: "Something Went Wrong",
        message: "An unexpected error occurred.",
        suggestion: "Please try again. If the problem persists, contact support.",
        color: "destructive"
      }
    };

    return configs[errorType as keyof typeof configs] || configs.unknown;
  };

  const handleRetry = useCallback(async () => {
    if (retryState.retryCount >= maxRetries) {
      return;
    }

    setRetryState(prev => ({
      ...prev,
      isRetrying: true,
      retryCount: prev.retryCount + 1
    }));

    // Exponential backoff: 1s, 2s, 4s, 8s...
    const delay = Math.pow(2, retryState.retryCount) * 1000;

    setRetryState(prev => ({
      ...prev,
      nextRetryIn: delay / 1000
    }));

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setRetryState(prev => ({
        ...prev,
        nextRetryIn: Math.max(0, prev.nextRetryIn - 1)
      }));
    }, 1000);

    setTimeout(() => {
      clearInterval(countdownInterval);
      setRetryState(prev => ({
        ...prev,
        isRetrying: false,
        nextRetryIn: 0
      }));
      onRetry();
    }, delay);
  }, [retryState.retryCount, maxRetries, onRetry]);

  const errorType = getErrorType(error);
  const config = getErrorConfig(errorType);
  const Icon = config.icon;
  const canRetry = retryState.retryCount < maxRetries;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="border-destructive/50">
        <CardHeader className="text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4"
          >
            <Icon className="w-8 h-8 text-destructive" />
          </motion.div>
          <CardTitle className="text-xl text-destructive">
            {config.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Issue Details</AlertTitle>
            <AlertDescription>
              {config.message}
            </AlertDescription>
          </Alert>

          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              {config.suggestion}
            </p>

            {retryState.retryCount > 0 && (
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline">
                  Attempt {retryState.retryCount} of {maxRetries}
                </Badge>
              </div>
            )}
          </div>

          {/* Retry Button */}
          {canRetry && (
            <div className="flex justify-center">
              <AnimatePresence mode="wait">
                {retryState.isRetrying ? (
                  <motion.div
                    key="retrying"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Retrying in {retryState.nextRetryIn} seconds...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="retry-button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Button
                      onClick={handleRetry}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Max retries reached */}
          {!canRetry && (
            <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                Maximum retry attempts reached. Please try again later or contact support if the problem persists.
              </AlertDescription>
            </Alert>
          )}

          {/* Error details for debugging */}
          {showDetails && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Technical Details
              </summary>
              <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto">
                {typeof error === 'string' ? error : error.message}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Hook for managing error recovery state
export function useErrorRecovery(maxRetries = 3) {
  const [errorState, setErrorState] = useState<{
    error: Error | string | null;
    retryCount: number;
    isRecovering: boolean;
  }>({
    error: null,
    retryCount: 0,
    isRecovering: false
  });

  const triggerError = useCallback((error: Error | string) => {
    setErrorState(prev => ({
      error,
      retryCount: prev.retryCount + 1,
      isRecovering: false
    }));
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      retryCount: 0,
      isRecovering: false
    });
  }, []);

  const startRecovery = useCallback(() => {
    setErrorState(prev => ({
      ...prev,
      isRecovering: true
    }));
  }, []);

  const canRetry = errorState.retryCount < maxRetries;

  return {
    error: errorState.error,
    retryCount: errorState.retryCount,
    isRecovering: errorState.isRecovering,
    canRetry,
    triggerError,
    clearError,
    startRecovery
  };
}

// Specialized error recovery for different operations
export function APIErrorRecovery({ error, onRetry, operation }: {
  error: Error | string;
  onRetry: () => void;
  operation: string;
}) {
  return (
    <ErrorRecovery
      error={error}
      onRetry={onRetry}
      operation={operation}
      maxRetries={3}
      showDetails={process.env.NODE_ENV === 'development'}
    />
  );
}

export function QuizGenerationError({ error, onRetry }: {
  error: Error | string;
  onRetry: () => void;
}) {
  return (
    <ErrorRecovery
      error={error}
      onRetry={onRetry}
      operation="quiz generation"
      maxRetries={3}
    />
  );
}

export function ExplanationError({ error, onRetry }: {
  error: Error | string;
  onRetry: () => void;
}) {
  return (
    <ErrorRecovery
      error={error}
      onRetry={onRetry}
      operation="explanation generation"
      maxRetries={2}
    />
  );
}
