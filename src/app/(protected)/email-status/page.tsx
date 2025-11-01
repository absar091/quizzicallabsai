'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface EmailStatus {
  emailConfigured: boolean;
  missingConfig: string[];
  config: any;
  endpoints: any;
  automaticEmails: any;
  troubleshooting: string[];
}

export default function EmailStatusPage() {
  const [status, setStatus] = useState<EmailStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/email-status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch email status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Email System Status" description="Checking email configuration..." />
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Email System Status" description="Failed to load status" />
        <Button onClick={fetchStatus}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader 
        title="Email System Status" 
        description="Comprehensive overview of email configuration and functionality"
      />

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status.emailConfigured ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            Email Configuration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status.emailConfigured ? (
            <p className="text-green-600">✅ All email configuration is complete</p>
          ) : (
            <div>
              <p className="text-red-600 mb-2">❌ Missing configuration:</p>
              <ul className="list-disc list-inside space-y-1">
                {status.missingConfig.map((config) => (
                  <li key={config} className="text-red-600">{config}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Details */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>SMTP Host:</strong> {status.config.smtpHost || 'Not set'}
            </div>
            <div>
              <strong>SMTP Port:</strong> {status.config.smtpPort || 'Not set'}
            </div>
            <div>
              <strong>SMTP User:</strong> {status.config.smtpUser || 'Not set'}
            </div>
            <div>
              <strong>Email From:</strong> {status.config.emailFrom || 'Not set'}
            </div>
            <div>
              <strong>SMTP Password:</strong> {status.config.hasSmtpPass ? '✅ Set' : '❌ Not set'}
            </div>
            <div>
              <strong>Environment:</strong> {status.config.nodeEnv}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automatic Emails Status */}
      <Card>
        <CardHeader>
          <CardTitle>Automatic Email Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(status.automaticEmails).map(([key, email]: [string, any]) => (
              <div key={key} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {email.status === 'Configured' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <h4 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    email.status === 'Configured' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {email.status}
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <p><strong>Trigger:</strong> {email.trigger}</p>
                  <p><strong>Endpoint:</strong> {email.endpoint}</p>
                  <p><strong>Notes:</strong> {email.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {status.troubleshooting.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button onClick={fetchStatus} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
          <Button asChild>
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}