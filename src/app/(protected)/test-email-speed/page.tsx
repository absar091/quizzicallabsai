'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function TestEmailSpeed() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const testEmailSpeed = async (emailType: string) => {
    if (!user?.email) return;
    
    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: emailType,
          to: user.email,
          userName: user.displayName || 'Test User',
          topic: 'Speed Test',
          score: 8,
          total: 10,
          percentage: 80
        })
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      const result = await response.json();
      
      setResults(prev => [...prev, {
        type: emailType,
        duration: `${duration}ms`,
        success: response.ok,
        message: result.message || result.error,
        timestamp: new Date().toLocaleTimeString()
      }]);
      
    } catch (error: any) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      setResults(prev => [...prev, {
        type: emailType,
        duration: `${duration}ms`,
        success: false,
        message: error.message,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Speed Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={() => testEmailSpeed('welcome')}
              disabled={isLoading}
            >
              Test Welcome Email
            </Button>
            <Button 
              onClick={() => testEmailSpeed('quiz-result')}
              disabled={isLoading}
            >
              Test Quiz Result Email
            </Button>
            <Button 
              onClick={() => testEmailSpeed('study-reminder')}
              disabled={isLoading}
            >
              Test Reminder Email
            </Button>
          </div>
          
          <Button 
            onClick={() => setResults([])}
            variant="outline"
          >
            Clear Results
          </Button>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results:</h3>
            {results.map((result, index) => (
              <div 
                key={index}
                className={`p-3 rounded border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{result.type}</span>
                  <span className="text-sm text-gray-500">{result.timestamp}</span>
                </div>
                <div className="text-sm">
                  Duration: <span className="font-mono">{result.duration}</span>
                </div>
                <div className="text-sm">
                  Status: <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                    {result.success ? 'Success' : 'Failed'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">{result.message}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}