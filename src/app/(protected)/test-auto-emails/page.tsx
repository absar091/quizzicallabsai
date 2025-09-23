'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';

export default function TestAutoEmailsPage() {
  const [isTestingWelcome, setIsTestingWelcome] = useState(false);
  const [isTestingQuizResult, setIsTestingQuizResult] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const testWelcomeEmail = async () => {
    if (!user?.email) return;
    
    setIsTestingWelcome(true);
    try {
      console.log('🧪 Testing automatic welcome email flow...');
      
      const response = await fetch('/api/debug-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.displayName || user.email.split('@')[0],
          testType: 'welcome'
        })
      });

      const result = await response.json();
      console.log('🧪 Welcome email test result:', result);

      if (result.success) {
        toast({
          title: "Welcome Email Test Successful! ✅",
          description: "Check console for details",
        });
      } else {
        toast({
          title: "Welcome Email Test Failed ❌",
          description: result.error || 'Unknown error',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Welcome email test error:', error);
      toast({
        title: "Test Error",
        description: "Network error during test",
        variant: "destructive",
      });
    } finally {
      setIsTestingWelcome(false);
    }
  };

  const testQuizResultEmail = async () => {
    if (!user?.email) return;
    
    setIsTestingQuizResult(true);
    try {
      console.log('🧪 Testing automatic quiz result email flow...');
      
      const response = await fetch('/api/debug-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.displayName || user.email.split('@')[0],
          testType: 'quiz-result'
        })
      });

      const result = await response.json();
      console.log('🧪 Quiz result email test result:', result);

      if (result.success) {
        toast({
          title: "Quiz Result Email Test Successful! ✅",
          description: "Check console for details",
        });
      } else {
        toast({
          title: "Quiz Result Email Test Failed ❌",
          description: result.error || 'Unknown error',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Quiz result email test error:', error);
      toast({
        title: "Test Error",
        description: "Network error during test",
        variant: "destructive",
      });
    } finally {
      setIsTestingQuizResult(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader 
        title="Test Automatic Emails" 
        description="Debug why automatic emails aren't working"
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome Email Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This tests the same flow that should happen when a new user signs up.
            </p>
            <Button 
              onClick={testWelcomeEmail} 
              disabled={isTestingWelcome || !user?.email}
            >
              {isTestingWelcome ? 'Testing...' : 'Test Welcome Email Flow'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Result Email Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This tests the same flow that should happen when you complete a quiz.
            </p>
            <Button 
              onClick={testQuizResultEmail} 
              disabled={isTestingQuizResult || !user?.email}
            >
              {isTestingQuizResult ? 'Testing...' : 'Test Quiz Result Email Flow'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>1. Open browser console (F12) to see detailed logs</p>
              <p>2. Click the test buttons above</p>
              <p>3. Check console for error messages</p>
              <p>4. Check your email inbox for test emails</p>
              <p>5. Compare with manual email test button on dashboard</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}