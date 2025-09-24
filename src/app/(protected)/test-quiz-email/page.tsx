'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';

export default function TestQuizEmailPage() {
  const [isTesting, setIsTesting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const testQuizResultEmail = async () => {
    if (!user?.email) return;
    
    setIsTesting(true);
    try {
      console.log('🧪 Testing quiz result email (exact same call as quiz submission)...');
      
      // This is the EXACT same call that the quiz submission makes
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quiz-result',
          to: user.email,
          userName: user.displayName || user.email?.split('@')[0] || 'Student',
          topic: 'Test Quiz Topic',
          score: 8,
          total: 10,
          percentage: 80,
          timeTaken: 300,
          date: new Date().toISOString()
        })
      });
      
      console.log('🧪 Email response status:', emailResponse.status);
      console.log('🧪 Email response headers:', Object.fromEntries(emailResponse.headers.entries()));
      
      const emailResult = await emailResponse.json();
      console.log('🧪 Email response data:', emailResult);
      
      if (emailResponse.ok && emailResult.success) {
        console.log('✅ Quiz result email sent successfully:', emailResult.messageId);
        toast({
          title: "Test Email Sent! 📧",
          description: `Results sent to ${user.email}. Check your inbox!`,
          duration: 5000,
        });
      } else {
        console.error('❌ Email sending failed:', {
          status: emailResponse.status,
          statusText: emailResponse.statusText,
          error: emailResult.error,
          details: emailResult
        });
        toast({
          title: "Email Test Failed",
          description: `Email failed: ${emailResult.error || 'Unknown error'}`,
          variant: "destructive",
        });
      }
    } catch (emailError: any) {
      console.error('❌ Email sending network error:', {
        message: emailError.message,
        stack: emailError.stack,
        name: emailError.name
      });
      toast({
        title: "Network Error",
        description: `Email network error: ${emailError.message}`,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const testIndexedDBSave = async () => {
    try {
      console.log('🧪 Testing IndexedDB save...');
      
      const { saveQuizResult } = await import('@/lib/indexed-db');
      
      const testResult = {
        id: `test-${Date.now()}`,
        userId: user?.uid || 'test',
        topic: 'Test Topic',
        score: 8,
        total: 10,
        percentage: 80,
        date: new Date().toISOString(),
        timeTaken: 300,
        createdAt: Date.now(),
      };

      console.log('🧪 Saving test result:', testResult);
      await saveQuizResult(testResult);
      console.log('✅ IndexedDB save successful');
      
      toast({
        title: "IndexedDB Test Successful ✅",
        description: "Check console for details",
      });

    } catch (error: any) {
      console.error('❌ IndexedDB test failed:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      toast({
        title: "IndexedDB Test Failed ❌",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader 
        title="Test Quiz Email System" 
        description="Test the exact same email call that quiz submission makes"
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Result Email Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This makes the EXACT same API call that happens after quiz completion.
            </p>
            <Button 
              onClick={testQuizResultEmail} 
              disabled={isTesting || !user?.email}
            >
              {isTesting ? 'Sending...' : 'Test Quiz Result Email'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>IndexedDB Save Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Test if IndexedDB save is causing the issue.
            </p>
            <Button 
              onClick={testIndexedDBSave} 
              disabled={!user?.uid}
            >
              Test IndexedDB Save
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
              <p><strong>User ID:</strong> {user?.uid || 'None'}</p>
              <p><strong>Display Name:</strong> {user?.displayName || 'None'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expected Console Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-xs font-mono">
              <p>After quiz completion, you should see:</p>
              <p>🔄 About to save to IndexedDB...</p>
              <p>✅ Local IndexedDB save successful</p>
              <p>🔄 Proceeding to cleanup and email...</p>
              <p>🔄 About to send quiz result email...</p>
              <p>📧 Sending quiz result email...</p>
              <p>✅ Quiz result email sent successfully</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}