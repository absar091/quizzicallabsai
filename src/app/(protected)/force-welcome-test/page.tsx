'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';

export default function ForceWelcomeTestPage() {
  const [isTesting, setIsTesting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const forceWelcomeEmail = async () => {
    if (!user?.email) return;
    
    setIsTesting(true);
    try {
      console.log('🧪 Force triggering welcome email...');
      
      // Simulate the exact same call that AuthContext makes
      const response = await fetch('/api/notifications/welcome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          idToken: 'test-token',
          userEmail: user.email,
          userName: user.displayName || user.email.split('@')[0] || 'Student'
        })
      });

      console.log('🧪 Welcome email response status:', response.status);
      const responseData = await response.json();
      console.log('🧪 Welcome email response data:', responseData);

      if (response.ok && responseData.success) {
        toast({
          title: "Welcome Email Sent! ✅",
          description: `Check ${user.email} inbox`,
        });
      } else {
        toast({
          title: "Welcome Email Failed ❌",
          description: responseData.error || 'Unknown error',
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('❌ Welcome email error:', error);
      toast({
        title: "Network Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const forceQuizResultEmail = async () => {
    if (!user?.email) return;
    
    setIsTesting(true);
    try {
      console.log('🧪 Force triggering quiz result email...');
      
      // Simulate the exact same call that quiz submission makes
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quiz-result',
          to: user.email,
          userName: user.displayName || user.email.split('@')[0] || 'Student',
          topic: 'Force Test Quiz',
          score: 8,
          total: 10,
          percentage: 80,
          timeTaken: 300,
          date: new Date().toISOString()
        })
      });

      console.log('🧪 Quiz result email response status:', response.status);
      const responseData = await response.json();
      console.log('🧪 Quiz result email response data:', responseData);

      if (response.ok && responseData.success) {
        toast({
          title: "Quiz Result Email Sent! ✅",
          description: `Check ${user.email} inbox`,
        });
      } else {
        toast({
          title: "Quiz Result Email Failed ❌",
          description: responseData.error || 'Unknown error',
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('❌ Quiz result email error:', error);
      toast({
        title: "Network Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader 
        title="Force Email Test" 
        description="Test the exact same API calls that automatic emails use"
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Force Welcome Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This makes the exact same API call that AuthContext makes for new users.
            </p>
            <Button 
              onClick={forceWelcomeEmail} 
              disabled={isTesting || !user?.email}
            >
              {isTesting ? 'Sending...' : 'Force Send Welcome Email'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Force Quiz Result Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This makes the exact same API call that quiz submission makes.
            </p>
            <Button 
              onClick={forceQuizResultEmail} 
              disabled={isTesting || !user?.email}
            >
              {isTesting ? 'Sending...' : 'Force Send Quiz Result Email'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>User Email:</strong> {user?.email || 'Not logged in'}</p>
              <p><strong>Display Name:</strong> {user?.displayName || 'None'}</p>
              <p><strong>User ID:</strong> {user?.uid || 'None'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}