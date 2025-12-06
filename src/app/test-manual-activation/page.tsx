'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function ManualActivationPage() {
  const [userId, setUserId] = useState('4nihPCHdN1T90vNpsbUaQPa3q4q1');
  const [userEmail, setUserEmail] = useState('ahmadraoabsar@gmail.com');
  const [plan, setPlan] = useState<'basic' | 'pro' | 'premium'>('pro');
  const [adminSecret, setAdminSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/admin/activate-user-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userEmail,
          plan,
          adminSecret,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to activate plan');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Manual Plan Activation</CardTitle>
            <CardDescription>
              Manually activate a user's plan when webhook fails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">User ID</label>
              <Input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Firebase User ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">User Email</label>
              <Input
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="user@example.com"
                type="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Plan</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as 'basic' | 'pro' | 'premium')}
                className="w-full p-2 border rounded-md"
              >
                <option value="basic">Basic (250k tokens)</option>
                <option value="pro">Pro (500k tokens)</option>
                <option value="premium">Premium (1M tokens)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Admin Secret</label>
              <Input
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                placeholder="Enter admin secret"
                type="password"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get this from .env.local (ADMIN_SECRET)
              </p>
            </div>

            <Button
              onClick={handleActivate}
              disabled={loading || !userId || !plan || !adminSecret}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Activating...
                </>
              ) : (
                'Activate Plan'
              )}
            </Button>

            {result && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="font-semibold mb-2">Success!</div>
                  <pre className="text-xs bg-white p-2 rounded overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="bg-red-50 border-red-200">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <div className="font-semibold mb-2">Error</div>
                  <p>{error}</p>
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Enter the user's Firebase User ID</li>
                <li>Enter the user's email address</li>
                <li>Select the plan to activate</li>
                <li>Enter the admin secret from .env.local</li>
                <li>Click "Activate Plan"</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">Current User Info:</h3>
              <div className="text-sm text-yellow-800 space-y-1">
                <p><strong>User ID:</strong> nihPCHdN1T90vNpsbUaQPa3q4q1</p>
                <p><strong>Email:</strong> ahmadraoabsar@gmail.com</p>
                <p><strong>Current Plan:</strong> Free</p>
                <p><strong>Issue:</strong> Payment successful but plan not activated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
