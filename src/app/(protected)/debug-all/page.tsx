'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';

export default function DebugAllPage() {
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [isTestingBookmark, setIsTestingBookmark] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const testAllEmails = async () => {
    if (!user?.email) return;
    
    setIsTestingEmail(true);
    try {
      console.log('🧪 Testing all email types...');
      
      // Test welcome email
      console.log('🧪 Testing welcome email...');
      const welcomeResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'welcome',
          to: user.email,
          userName: user.displayName || user.email.split('@')[0],
          userEmail: user.email,
          accountType: 'Free',
          signUpDate: new Date().toLocaleDateString()
        })
      });
      
      const welcomeResult = await welcomeResponse.json();
      console.log('🧪 Welcome email result:', welcomeResult);

      // Test quiz result email
      console.log('🧪 Testing quiz result email...');
      const quizResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quiz-result',
          to: user.email,
          userName: user.displayName || user.email.split('@')[0],
          topic: 'Debug Test Quiz',
          score: 8,
          total: 10,
          percentage: 80,
          timeTaken: 300,
          date: new Date().toISOString()
        })
      });
      
      const quizResult = await quizResponse.json();
      console.log('🧪 Quiz result email result:', quizResult);

      // Test reminder email
      console.log('🧪 Testing reminder email...');
      const reminderResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'study-reminder',
          to: user.email,
          userName: user.displayName || user.email.split('@')[0]
        })
      });
      
      const reminderResult = await reminderResponse.json();
      console.log('🧪 Reminder email result:', reminderResult);

      const allSuccess = welcomeResult.success && quizResult.success && reminderResult.success;
      
      toast({
        title: allSuccess ? "All Emails Sent! ✅" : "Some Emails Failed ❌",
        description: `Welcome: ${welcomeResult.success ? '✅' : '❌'}, Quiz: ${quizResult.success ? '✅' : '❌'}, Reminder: ${reminderResult.success ? '✅' : '❌'}`,
        variant: allSuccess ? "default" : "destructive",
      });

    } catch (error) {
      console.error('❌ Email test error:', error);
      toast({
        title: "Email Test Failed",
        description: "Network error during email test",
        variant: "destructive",
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  const testBookmarkSystem = async () => {
    setIsTestingBookmark(true);
    try {
      console.log('🧪 Testing bookmark system...');
      
      // Test bookmark save
      const testBookmark = {
        userId: user?.uid || 'test',
        question: 'Test bookmark question for debugging',
        correctAnswer: 'Test answer',
        topic: 'Debug Test'
      };

      // Import the bookmark functions
      const { saveBookmark, getBookmarks, deleteBookmark } = await import('@/lib/indexed-db');
      
      console.log('🧪 Saving test bookmark...');
      await saveBookmark(testBookmark);
      
      console.log('🧪 Retrieving bookmarks...');
      const bookmarks = await getBookmarks(user?.uid || 'test');
      console.log('🧪 Retrieved bookmarks:', bookmarks);
      
      console.log('🧪 Deleting test bookmark...');
      await deleteBookmark(user?.uid || 'test', testBookmark.question);
      
      console.log('🧪 Verifying deletion...');
      const bookmarksAfterDelete = await getBookmarks(user?.uid || 'test');
      console.log('🧪 Bookmarks after delete:', bookmarksAfterDelete);
      
      toast({
        title: "Bookmark System Test Complete ✅",
        description: "Check console for detailed results",
      });

    } catch (error) {
      console.error('❌ Bookmark test error:', error);
      toast({
        title: "Bookmark Test Failed ❌",
        description: "Check console for error details",
        variant: "destructive",
      });
    } finally {
      setIsTestingBookmark(false);
    }
  };

  const forceQuizResultEmail = async () => {
    if (!user?.email) return;
    
    try {
      console.log('🧪 Force triggering quiz result email (simulating quiz completion)...');
      
      // This simulates the exact same call that should happen after quiz completion
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

      const result = await response.json();
      console.log('🧪 Force quiz result email response:', result);

      toast({
        title: result.success ? "Quiz Result Email Sent! ✅" : "Quiz Result Email Failed ❌",
        description: result.success ? `Email sent to ${user.email}` : result.error,
        variant: result.success ? "default" : "destructive",
      });

    } catch (error: any) {
      console.error('❌ Force quiz result email error:', error);
      toast({
        title: "Network Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader 
        title="Debug All Systems" 
        description="Comprehensive testing of all major features"
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email System Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Test all email types: welcome, quiz result, and study reminder.
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={testAllEmails} 
                disabled={isTestingEmail || !user?.email}
              >
                {isTestingEmail ? 'Testing...' : 'Test All Emails'}
              </Button>
              <Button 
                onClick={forceQuizResultEmail} 
                disabled={!user?.email}
                variant="outline"
              >
                Force Quiz Result Email
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookmark System Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Test bookmark save, retrieve, and delete functionality.
            </p>
            <Button 
              onClick={testBookmarkSystem} 
              disabled={isTestingBookmark || !user?.uid}
            >
              {isTestingBookmark ? 'Testing...' : 'Test Bookmark System'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>User:</strong> {user?.email || 'Not logged in'}</p>
              <p><strong>User ID:</strong> {user?.uid || 'None'}</p>
              <p><strong>Plan:</strong> {user?.plan || 'Unknown'}</p>
              <p><strong>Email Verified:</strong> {user?.emailVerified ? '✅' : '❌'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>1. Open browser console (F12) to see detailed logs</p>
              <p>2. Test each system individually</p>
              <p>3. Check your email inbox for test emails</p>
              <p>4. Report any errors you see in the console</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}