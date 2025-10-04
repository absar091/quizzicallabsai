'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function TestDeviceDetectionPage() {
  const { toast } = useToast();
  const [userId, setUserId] = useState('test-user-123');
  const [isLoading, setIsLoading] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);

  const testDeviceDetection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/debug-device-detection?userId=${encodeURIComponent(userId)}`);
      const data = await response.json();
      setDebugData(data);
      
      if (data.success) {
        toast({
          title: 'Device Detection Test Complete',
          description: `Should send notification: ${data.debug.shouldSendNotification ? 'YES' : 'NO'}`,
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

  const simulateLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/debug-device-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'simulate-login' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Login Simulated',
          description: `Notification before: ${data.results.shouldNotifyBefore ? 'YES' : 'NO'}, after: ${data.results.shouldNotifyAfter ? 'YES' : 'NO'}`,
        });
        // Refresh the debug data
        await testDeviceDetection();
      } else {
        toast({
          title: 'Simulation Failed',
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

  const clearCredentials = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/debug-device-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'clear-credentials' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Credentials Cleared',
          description: 'All stored device credentials have been removed',
        });
        setDebugData(null);
      } else {
        toast({
          title: 'Clear Failed',
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

  const testEmailTemplate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-email-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'furqanrao091@gmail.com',
          emailType: 'loginAlerts',
          actualSend: true 
        })
      });
      
      const data = await response.json();
      
      toast({
        title: data.success ? 'Email Sent' : 'Email Failed',
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
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Detection & Login Notification Test</CardTitle>
            <CardDescription>Test and debug the device detection and email notification system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID to test"
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button onClick={testDeviceDetection} disabled={isLoading}>
                {isLoading ? 'Testing...' : 'Test Device Detection'}
              </Button>
              <Button onClick={simulateLogin} disabled={isLoading} variant="outline">
                {isLoading ? 'Simulating...' : 'Simulate Login'}
              </Button>
              <Button onClick={clearCredentials} disabled={isLoading} variant="destructive">
                {isLoading ? 'Clearing...' : 'Clear Credentials'}
              </Button>
              <Button onClick={testEmailTemplate} disabled={isLoading} variant="secondary">
                {isLoading ? 'Sending...' : 'Test Email Template'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {debugData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Device Info</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(debugData.debug.currentDeviceInfo, null, 2)}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stored Credentials ({debugData.debug.storedCredentials.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-auto text-sm max-h-96">
                  {JSON.stringify(debugData.debug.storedCredentials, null, 2)}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Decision</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${debugData.debug.shouldSendNotification ? 'bg-red-100 dark:bg-red-900/20 border border-red-200' : 'bg-green-100 dark:bg-green-900/20 border border-green-200'}`}>
                    <p className={`font-semibold ${debugData.debug.shouldSendNotification ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}`}>
                      {debugData.debug.shouldSendNotification ? '🚨 SEND NOTIFICATION' : '✅ NO NOTIFICATION NEEDED'}
                    </p>
                    <p className="text-sm mt-2">
                      {debugData.debug.shouldSendNotification 
                        ? 'This login is from a new or suspicious device/location'
                        : 'This login matches a trusted device'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Login Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(debugData.debug.loginStats, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">✅ Trusted Device</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Same device, browser, OS, and location as previous logins. No notification sent.
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">🚨 New/Suspicious Device</h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Different device, browser, OS, or location. Security notification sent.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Location Change</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Same device but different IP/location (VPN detection). Notification sent.
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">🎉 First Login</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Welcome notification sent for first-time login.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}