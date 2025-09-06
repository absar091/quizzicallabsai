is erro from whiole app if presnet nam make app error free espe'use client';

import { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw, Home, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Check online status
    const checkOnline = () => {
      setIsOnline(navigator.onLine);
    };

    // Listen for online/offline events
    window.addEventListener('online', checkOnline);
    window.addEventListener('offline', checkOnline);

    // Initial check
    checkOnline();

    return () => {
      window.removeEventListener('online', checkOnline);
      window.removeEventListener('offline', checkOnline);
    };
  }, []);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {isOnline ? (
              <div className="p-3 bg-green-100 rounded-full">
                <Wifi className="w-8 h-8 text-green-600" />
              </div>
            ) : (
              <div className="p-3 bg-red-100 rounded-full">
                <WifiOff className="w-8 h-8 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {isOnline ? 'Back Online!' : 'You\'re Offline'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-muted-foreground">
            {isOnline ? (
              <p>Great! Your connection is restored. You can now continue using Quizzicallabs AI.</p>
            ) : (
              <p>
                It looks like you're not connected to the internet.
                Don't worry, you can still access some features when you're back online.
              </p>
            )}
          </div>

          {!isOnline && (
            <Alert>
              <WifiOff className="h-4 w-4" />
              <AlertDescription>
                <strong>Offline Features Available:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• View previously generated quizzes</li>
                  <li>• Access cached study materials</li>
                  <li>• Review saved flashcards</li>
                  <li>• Continue incomplete quizzes</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            {isOnline ? (
              <Button onClick={handleGoHome} className="w-full" size="lg">
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Button>
            ) : (
              <>
                <Button onClick={handleRetry} variant="default" className="w-full" size="lg">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again ({retryCount})
                </Button>

                <Button onClick={handleGoHome} variant="outline" className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Offline Content
                </Button>
              </>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            <p>
              {isOnline
                ? 'Welcome back to Quizzicallabs AI!'
                : 'Check your internet connection and try again.'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
