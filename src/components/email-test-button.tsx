'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Mail } from 'lucide-react';

export function EmailTestButton() {
  const [isSending, setIsSending] = useState(false);
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
      console.log('📧 Testing email system...');
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quiz-result',
          to: user.email,
          userName: user.displayName || user.email.split('@')[0] || 'Test User',
          topic: 'Email System Test',
          score: 9,
          total: 10,
          percentage: 90,
          timeTaken: 180, // 3 minutes
          date: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Test email sent:', result);
        toast({
          title: "Test Email Sent! 📧",
          description: `Check your inbox at ${user.email}`,
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
    <Button 
      onClick={sendTestEmail} 
      disabled={isSending || !user?.email}
      variant="outline"
      className="h-20 flex-col gap-2"
    >
      <Mail className="h-6 w-6" />
      <span className="text-sm">{isSending ? 'Sending...' : 'Test Email'}</span>
    </Button>
  );
}