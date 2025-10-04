'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function TestPreferencesDebugPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('furqanrao091@gmail.com');
  const [isLoading, setIsLoading] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);

  const testPreferences = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/test-preferences-fix?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      setDebugData(data);
      
      if (data.success) {
        toast({
          title: 'Test Complete',
          description: 'Check the debug data below',
        });
      } else {
        toast({
          title: 'Test Failed',
          description: data.error,
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async () => {
    setIsLoading(true);
    try {
      const testPrefs = {
        quizResults: false,
        studyReminders: true,
        loginAlerts: true,
        promotions: false,
        newsletters: true,
        all: false
      };

      const response = await fetch('/api/test-preferences-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, preferences: testPrefs })
      });
      
      const data = await response.json();
      setDebugData(data);
      
      if (data.success) {
        toast({
          title: 'Preferences Updated',
          description: 'Test preferences have been saved',
        });
      } else {
        toast({
          title: 'Update Failed',
          description: data.error,
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testEmailSending = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-cron-simple');
      const data = await response.json();
      
      toast({
        title: data.success ? 'Email Test Complete' : 'Email Test Failed',
        description: data.message || data.error,
        variant: data.success ? 'default' : 'destructive'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Preferences Debug Tool</CardTitle>
            <CardDescription>Test and debug the email preferences system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email to test"
              />
            </div>
            
            <div className="flex gap-4">
              <Button onClick={testPreferences} disabled={isLoading}>
                {isLoading ? 'Testing...' : 'Test Current Preferences'}
              </Button>
              <Button onClick={updatePreferences} disabled={isLoading} variant="outline">
                {isLoading ? 'Updating...' : 'Update Test Preferences'}
              </Button>
              <Button onClick={testEmailSending} disabled={isLoading} variant="secondary">
                {isLoading ? 'Testing...' : 'Test Email Sending'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {debugData && (
          <Card>
            <CardHeader>
              <CardTitle>Debug Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(debugData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}