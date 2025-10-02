'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Bell, BellOff, Mail, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function UnsubscribePage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [preferences, setPreferences] = useState({
    quizResults: true,
    studyReminders: true,
    loginAlerts: true,
    promotions: true,
    newsletters: true
  });

  const handleUnsubscribeAll = async () => {
    if (!email.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with actual unsubscribe logic
      await new Promise(resolve => setTimeout(resolve, 1500));

      // TODO: Call your unsubscribe API endpoint
      // const response = await fetch('/api/email/unsubscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, preferences: { ...preferences, all: true } })
      // });

      setIsUnsubscribed(true);
      toast({
        title: 'Successfully Unsubscribed',
        description: 'You will no longer receive emails from us.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to unsubscribe. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePreferences = async () => {
    if (!email.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with actual update logic
      await new Promise(resolve => setTimeout(resolve, 1500));

      // TODO: Call your preferences API endpoint
      // const response = await fetch('/api/email/preferences', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, preferences })
      // });

      toast({
        title: 'Preferences Updated',
        description: 'Your email preferences have been saved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update preferences. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isUnsubscribed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Successfully Unsubscribed</CardTitle>
            <CardDescription>
              You have been unsubscribed from all Quizzicallabzᴬᴵ emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              We're sorry to see you go. You will no longer receive any emails from us.
              If this was a mistake, you can always resubscribe from your account settings.
            </p>
            <div className="flex gap-3">
              <Button asChild className="flex-1" variant="outline">
                <Link href="/">Return Home</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <BellOff className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Email Preferences</CardTitle>
              <CardDescription>Manage your email subscription settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Preference Options */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Choose which emails you want to receive:</h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <Checkbox
                  id="quizResults"
                  checked={preferences.quizResults}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, quizResults: checked as boolean })
                  }
                />
                <div className="flex-1">
                  <label htmlFor="quizResults" className="text-sm font-medium cursor-pointer">
                    Quiz Results
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Receive your quiz scores and performance analysis
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <Checkbox
                  id="studyReminders"
                  checked={preferences.studyReminders}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, studyReminders: checked as boolean })
                  }
                />
                <div className="flex-1">
                  <label htmlFor="studyReminders" className="text-sm font-medium cursor-pointer">
                    Study Reminders
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Get reminded to practice and review weak areas
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <Checkbox
                  id="loginAlerts"
                  checked={preferences.loginAlerts}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, loginAlerts: checked as boolean })
                  }
                />
                <div className="flex-1">
                  <label htmlFor="loginAlerts" className="text-sm font-medium cursor-pointer">
                    Security Alerts
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Important login and security notifications (recommended)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <Checkbox
                  id="promotions"
                  checked={preferences.promotions}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, promotions: checked as boolean })
                  }
                />
                <div className="flex-1">
                  <label htmlFor="promotions" className="text-sm font-medium cursor-pointer">
                    Promotions & Updates
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Special offers, new features, and product updates
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <Checkbox
                  id="newsletters"
                  checked={preferences.newsletters}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, newsletters: checked as boolean })
                  }
                />
                <div className="flex-1">
                  <label htmlFor="newsletters" className="text-sm font-medium cursor-pointer">
                    Educational Newsletter
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Study tips, educational content, and learning resources
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              onClick={handleUpdatePreferences}
              disabled={isLoading}
              className="flex-1"
            >
              <Bell className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Preferences'}
            </Button>
            <Button
              onClick={handleUnsubscribeAll}
              disabled={isLoading}
              variant="destructive"
              className="flex-1"
            >
              <BellOff className="w-4 h-4 mr-2" />
              {isLoading ? 'Processing...' : 'Unsubscribe All'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-4">
            You can change these preferences anytime from your{' '}
            <Link href="/profile" className="text-primary hover:underline">
              account settings
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
