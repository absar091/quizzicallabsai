"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function TestAISimplePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testCustomQuiz = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        throw new Error('Please sign in first');
      }

      const response = await fetch('/api/ai/custom-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topic: 'Basic Math',
          difficulty: 'easy',
          numberOfQuestions: 2,
          questionTypes: ['Multiple Choice'],
          questionStyles: ['Conceptual'],
          timeLimit: 5,
          isPro: user?.plan === 'Pro'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testStudyGuide = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        throw new Error('Please sign in first');
      }

      const response = await fetch('/api/ai/study-guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topic: 'Photosynthesis',
          isPro: user?.plan === 'Pro'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate study guide');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const syncUserPlan = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        throw new Error('Please sign in first');
      }

      const response = await fetch('/api/admin/sync-user-plan', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync plan');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">AI System Test Page</h1>

      <div className="grid gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>User Info</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Email:</strong> {user?.email || 'Not logged in'}</p>
            <p><strong>Plan:</strong> {user?.plan || 'Unknown'}</p>
            <p><strong>User ID:</strong> {user?.uid || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test AI Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={testCustomQuiz} 
              disabled={loading}
              className="w-full"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Test Custom Quiz (2 questions)
            </Button>

            <Button 
              onClick={testStudyGuide} 
              disabled={loading}
              className="w-full"
              variant="secondary"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Test Study Guide
            </Button>

            <Button 
              onClick={syncUserPlan} 
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sync User Plan
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-500">
            <CardHeader>
              <CardTitle className="text-red-500">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="border-green-500">
            <CardHeader>
              <CardTitle className="text-green-500">Success!</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
