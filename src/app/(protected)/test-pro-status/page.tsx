"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePlan } from "@/hooks/usePlan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TestProStatusPage() {
  const { user } = useAuth();
  const { plan, isPro } = usePlan();

  const testEmail = async () => {
    try {
      const response = await fetch('/api/test-quiz-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      console.log('Test email result:', result);
      alert(result.success ? 'Test email sent!' : `Error: ${result.error}`);
    } catch (error) {
      console.error('Test email error:', error);
      alert('Test email failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Pro Status Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>User ID:</strong> {user?.uid || 'Not logged in'}
          </div>
          <div>
            <strong>Email:</strong> {user?.email || 'No email'}
          </div>
          <div>
            <strong>Plan:</strong> {plan}
          </div>
          <div>
            <strong>Is Pro:</strong> {isPro ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Raw User Plan:</strong> {user?.plan || 'undefined'}
          </div>
          
          <Button onClick={testEmail} className="w-full">
            Test Quiz Result Email
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}