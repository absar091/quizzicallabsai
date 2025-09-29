'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class FirebaseErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a Firebase-related error
    const isFirebaseError = error.message.includes('Firebase') || 
                           error.message.includes('permission-denied') ||
                           error.message.includes('WebChannel');
    
    return { 
      hasError: isFirebaseError, 
      error: isFirebaseError ? error : undefined 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log Firebase errors
    if (error.message.includes('Firebase') || error.message.includes('WebChannel')) {
      console.error('🔥 Firebase Error Caught:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle>Connection Issue</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                We're having trouble connecting to our servers. This usually resolves itself quickly.
              </p>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Page
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => this.setState({ hasError: false })}
                  className="w-full"
                >
                  Try Again
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                If this persists, check your internet connection
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}