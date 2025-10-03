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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/email/unsubscribe', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          preferences: { ...preferences, all: true } 
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          throw new Error(`Server error: ${response.status}`);
        }
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to unsubscribe');
      }

      setIsUnsubscribed(true);
      toast({
        title: 'Successfully Unsubscribed',
        description: 'You will no longer receive emails from us.',
      });
    } catch (error: any) {
      console.error('Unsubscribe error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to unsubscribe. Please try again.',
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/email/preferences', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          preferences 
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          throw new Error(`Server error: ${response.status}`);
        }
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to update preferences');
      }

      toast({
        title: 'Preferences Updated',
        description: 'Your email preferences have been saved successfully.',
      });
    } catch (error: any) {
      console.error('Update preferences error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update preferences. Please try again.',
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
              <div className="flex items-start space-x-3 p-4 rounded-xl border-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200 border-blue-200 dark:border-blue-800">
                <Checkbox
                  id="quizResults"
                  checked={preferences.quizResults}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, quizResults: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="quizResults" className="text-sm font-semibold cursor-pointer text-blue-900 dark:text-blue-100">
                    📊 Quiz Results
                  </label>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Receive your quiz scores and performance analysis
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-xl border-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all duration-200 border-green-200 dark:border-green-800">
                <Checkbox
                  id="studyReminders"
                  checked={preferences.studyReminders}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, studyReminders: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="studyReminders" className="text-sm font-semibold cursor-pointer text-green-900 dark:text-green-100">
                    📚 Study Reminders
                  </label>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Get reminded to practice and review weak areas
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-xl border-2 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 hover:from-red-100 hover:to-orange-100 dark:hover:from-red-900/30 dark:hover:to-orange-900/30 transition-all duration-200 border-red-200 dark:border-red-800">
                <Checkbox
                  id="loginAlerts"
                  checked={preferences.loginAlerts}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, loginAlerts: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="loginAlerts" className="text-sm font-semibold cursor-pointer text-red-900 dark:text-red-100">
                    🔒 Security Alerts
                  </label>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                    Important login and security notifications (recommended)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-xl border-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all duration-200 border-purple-200 dark:border-purple-800">
                <Checkbox
                  id="promotions"
                  checked={preferences.promotions}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, promotions: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="promotions" className="text-sm font-semibold cursor-pointer text-purple-900 dark:text-purple-100">
                    🎁 Promotions & Updates
                  </label>
                  <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                    Special offers, new features, and product updates
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-xl border-2 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 hover:from-teal-100 hover:to-cyan-100 dark:hover:from-teal-900/30 dark:hover:to-cyan-900/30 transition-all duration-200 border-teal-200 dark:border-teal-800">
                <Checkbox
                  id="newsletters"
                  checked={preferences.newsletters}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, newsletters: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="newsletters" className="text-sm font-semibold cursor-pointer text-teal-900 dark:text-teal-100">
                    📰 Educational Newsletter
                  </label>
                  <p className="text-xs text-teal-700 dark:text-teal-300 mt-1">
                    Study tips, educational content, and learning resources
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleUpdatePreferences}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  Save Preferences
                </>
              )}
            </Button>
            <Button
              onClick={handleUnsubscribeAll}
              disabled={isLoading}
              variant="destructive"
              className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <BellOff className="w-4 h-4 mr-2" />
                  Unsubscribe All
                </>
              )}
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
