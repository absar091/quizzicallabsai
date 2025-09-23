'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Mail } from 'lucide-react';

export function EmailTestButton() {
  const [isSending, setIsSending] = useState(false);
  const [testType, setTestType] = useState<'quiz-result' | 'welcome' | 'reminder'>('quiz-result');
  const { toast } = useToast();
  const { user } = useAuth();

  const sendTestEmail = async () => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "Please log in to test email functionality",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    
    try {
      console.log(`📧 Testing ${testType} email...`);
      
      let requestBody: any = {
        type: testType === 'reminder' ? 'study-reminder' : testType,
        to: user.email,
      };

      switch (testType) {
        case 'quiz-result':
          requestBody = {
            ...requestBody,
            userName: user.displayName || user.email.split('@')[0] || 'Test User',
            topic: 'Email System Test',
            score: 9,
            total: 10,
            percentage: 90,
            timeTaken: 180,
            date: new Date().toISOString()
          };
          break;
        case 'welcome':
          requestBody = {
            ...requestBody,
            userName: user.displayName || user.email.split('@')[0] || 'Test User',
            userEmail: user.email,
            accountType: 'Free',
            signUpDate: new Date().toLocaleDateString()
          };
          break;
        case 'reminder':
          requestBody = {
            ...requestBody,
            userName: user.displayName || user.email.split('@')[0] || 'Test User'
          };
          break;
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Test email sent:', result);
        toast({
          title: "Test Email Sent! 📧",
          description: `${testType} email sent to ${user.email}`,
          duration: 5000,
        });
      } else {
        const error = await response.json();
        console.error('❌ Email test failed:', error);
        toast({
          title: "Email Test Failed",
          description: error.error || 'Unknown error occurred',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Email test error:', error);
      toast({
        title: "Email Test Error",
        description: 'Failed to send test email',
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2 border rounded-lg">
      <select 
        value={testType} 
        onChange={(e) => setTestType(e.target.value as any)}
        className="text-xs p-1 border rounded"
        disabled={isSending}
      >
        <option value="quiz-result">Quiz Result</option>
        <option value="welcome">Welcome</option>
        <option value="reminder">Reminder</option>
      </select>
      <Button 
        onClick={sendTestEmail} 
        disabled={isSending || !user?.email}
        variant="outline"
        size="sm"
      >
        <Mail className="h-4 w-4 mr-2" />
        <span className="text-xs">{isSending ? 'Sending...' : 'Test Email'}</span>
      </Button>
    </div>
  );
}