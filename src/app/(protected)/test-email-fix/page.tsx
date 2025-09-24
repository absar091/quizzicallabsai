'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TestEmailFixPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testEmailSystem = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/test-email-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      setTestResult(result);
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.message,
        details: { message: 'Network or fetch error' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testWelcomeEmail = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'welcome',
          to: 'test@example.com',
          userName: 'Test User',
          userEmail: 'test@example.com'
        })
      });
      
      const result = await response.json();
      setTestResult({
        success: result.success,
        message: result.success ? 'Welcome email test successful!' : 'Welcome email test failed',
        error: result.error,
        details: result
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.message,
        details: { message: 'Network or fetch error during welcome email test' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email System Diagnostics</CardTitle>
          <CardDescription>
            Test and diagnose the email system to fix the "createTransporter" error
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={testEmailSystem} disabled={isLoading}>
              {isLoading ? 'Testing...' : 'Test Email System'}
            </Button>
            <Button onClick={testWelcomeEmail} disabled={isLoading} variant="outline">
              {isLoading ? 'Testing...' : 'Test Welcome Email'}
            </Button>
          </div>
          
          {testResult && (
            <Card className={testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant={testResult.success ? 'default' : 'destructive'}>
                    {testResult.success ? 'SUCCESS' : 'FAILED'}
                  </Badge>
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {testResult.message && (
                  <div>
                    <strong>Message:</strong> {testResult.message}
                  </div>
                )}
                
                {testResult.error && (
                  <div className="text-red-600">
                    <strong>Error:</strong> {testResult.error}
                  </div>
                )}
                
                {testResult.checks && (
                  <div>
                    <strong>System Checks:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Nodemailer Import: {testResult.checks.nodemailerImport ? '✅' : '❌'}</li>
                      <li>Environment Variables: {Object.values(testResult.checks.environmentVariables).every(Boolean) ? '✅' : '❌'}</li>
                      <li>Transporter Creation: {testResult.checks.transporterCreation ? '✅' : '❌'}</li>
                      <li>SMTP Connection: {testResult.checks.smtpConnection ? '✅' : '❌'}</li>
                    </ul>
                  </div>
                )}
                
                {testResult.details && (
                  <details className="mt-4">
                    <summary className="cursor-pointer font-medium">Technical Details</summary>
                    <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
                      {JSON.stringify(testResult.details, null, 2)}
                    </pre>
                  </details>
                )}
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Email System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>🔧 <strong>Issue:</strong> "d.createTransporter is not a function"</div>
              <div>✅ <strong>Root Cause:</strong> Method name was wrong - should be "createTransport" not "createTransporter"</div>
              <div>🛠️ <strong>Fix Applied:</strong> Corrected method name + dynamic import</div>
              <div>📧 <strong>SMTP Config:</strong> Gmail SMTP (smtp.gmail.com:587)</div>
              <div>🎨 <strong>Templates:</strong> Updated with app color scheme</div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}