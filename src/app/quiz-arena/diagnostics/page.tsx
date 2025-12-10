'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Wrench, 
  ArrowLeft,
  Settings,
  Database,
  Zap,
  Users,
  Play
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import QuizArenaDiagnosticsComponent from '@/components/QuizArenaDiagnostics';

export default function QuizArenaDiagnosticsPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isTestingQuickFix, setIsTestingQuickFix] = useState(false);

  // Quick fixes for common issues
  const quickFixes = [
    {
      id: 'refresh-page',
      title: 'Refresh Page',
      description: 'Clear cache and reload the page',
      icon: RefreshCw,
      action: () => window.location.reload()
    },
    {
      id: 'clear-storage',
      title: 'Clear Local Storage',
      description: 'Clear browser storage and cookies',
      icon: Database,
      action: () => {
        localStorage.clear();
        sessionStorage.clear();
        toast?.({
          title: 'Storage Cleared',
          description: 'Local storage has been cleared. Please refresh the page.',
        });
      }
    },
    {
      id: 'test-connection',
      title: 'Test Firebase Connection',
      description: 'Verify Firebase connectivity',
      icon: Zap,
      action: async () => {
        try {
          const { firestore } = await import('@/lib/firebase');
          const { doc, getDoc } = await import('firebase/firestore');
          
          const testDoc = doc(firestore, 'test', 'connection');
          await getDoc(testDoc);
          
          toast?.({
            title: 'Connection Test Passed',
            description: 'Firebase connection is working properly.',
          });
        } catch (error: any) {
          toast?.({
            title: 'Connection Test Failed',
            description: `Firebase connection error: ${error.message}`,
            variant: 'destructive'
          });
        }
      }
    },
    {
      id: 'test-auth',
      title: 'Test Authentication',
      description: 'Verify user authentication status',
      icon: Users,
      action: async () => {
        try {
          if (!user) {
            throw new Error('No user authenticated');
          }
          
          const token = await user.getIdToken();
          if (token) {
            toast?.({
              title: 'Authentication Test Passed',
              description: `User ${user.uid} is properly authenticated.`,
            });
          }
        } catch (error: any) {
          toast?.({
            title: 'Authentication Test Failed',
            description: `Auth error: ${error.message}`,
            variant: 'destructive'
          });
        }
      }
    },
    {
      id: 'test-quiz-generation',
      title: 'Test Quiz Generation',
      description: 'Test AI quiz generation endpoint',
      icon: Play,
      action: async () => {
        setIsTestingQuickFix(true);
        try {
          if (!user) {
            throw new Error('Please log in first');
          }

          const token = await user.getIdToken();
          const response = await fetch('/api/ai/custom-quiz', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              topic: 'Basic Mathematics',
              difficulty: 'easy',
              numberOfQuestions: 1,
              questionTypes: ['Multiple Choice'],
              questionStyles: ['Conceptual'],
              timeLimit: 30,
              userClass: 'Test',
              isPro: false,
              specificInstructions: 'Generate a simple test question'
            })
          });

          if (response.ok) {
            const result = await response.json();
            if (result.quiz && result.quiz.length > 0) {
              toast?.({
                title: 'Quiz Generation Test Passed',
                description: 'AI quiz generation is working properly.',
              });
            } else {
              throw new Error('Empty quiz returned');
            }
          } else {
            const error = await response.text();
            throw new Error(`API Error: ${response.status} - ${error}`);
          }
        } catch (error: any) {
          toast?.({
            title: 'Quiz Generation Test Failed',
            description: `Error: ${error.message}`,
            variant: 'destructive'
          });
        } finally {
          setIsTestingQuickFix(false);
        }
      }
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading diagnostics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Arena Diagnostics</h1>
            <p className="text-slate-400">Diagnose and fix Quiz Arena issues</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/quiz-arena">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quiz Arena
            </Link>
          </Button>
        </div>

        {/* Authentication Warning */}
        {!user && (
          <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need to be logged in to run full diagnostics. Some tests may not work properly.
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Fixes */}
        <Card className="mb-8 bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Fixes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickFixes.map((fix) => {
                const IconComponent = fix.icon;
                return (
                  <Card key={fix.id} className="bg-slate-800/50 border-slate-600 hover:border-slate-500 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-slate-300" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{fix.title}</h3>
                          <p className="text-sm text-slate-400">{fix.description}</p>
                        </div>
                      </div>
                      <Button 
                        onClick={fix.action}
                        disabled={isTestingQuickFix && fix.id === 'test-quiz-generation'}
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                      >
                        {isTestingQuickFix && fix.id === 'test-quiz-generation' ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          'Run Fix'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Full Diagnostics */}
        <QuizArenaDiagnosticsComponent />

        {/* Common Issues */}
        <Card className="mt-8 bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Common Issues & Solutions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 border border-slate-600 rounded-lg">
                <h3 className="font-medium text-white mb-2">Questions Not Generating</h3>
                <p className="text-slate-400 text-sm mb-3">
                  If AI questions are not generating, this could be due to:
                </p>
                <ul className="text-slate-400 text-sm space-y-1 ml-4">
                  <li>• API key issues or quota limits</li>
                  <li>• Network connectivity problems</li>
                  <li>• Authentication token expiration</li>
                  <li>• AI service temporary unavailability</li>
                </ul>
                <p className="text-slate-300 text-sm mt-3">
                  <strong>Solution:</strong> Run the "Test Quiz Generation" quick fix above.
                </p>
              </div>

              <div className="p-4 border border-slate-600 rounded-lg">
                <h3 className="font-medium text-white mb-2">Participants Cannot Join</h3>
                <p className="text-slate-400 text-sm mb-3">
                  If participants can't join rooms, check:
                </p>
                <ul className="text-slate-400 text-sm space-y-1 ml-4">
                  <li>• Firebase security rules are properly deployed</li>
                  <li>• Room code is correct (6 characters)</li>
                  <li>• User authentication is working</li>
                  <li>• Firebase connection is stable</li>
                </ul>
                <p className="text-slate-300 text-sm mt-3">
                  <strong>Solution:</strong> Run full diagnostics to identify the specific issue.
                </p>
              </div>

              <div className="p-4 border border-slate-600 rounded-lg">
                <h3 className="font-medium text-white mb-2">Quiz Not Starting</h3>
                <p className="text-slate-400 text-sm mb-3">
                  If the host cannot start the quiz:
                </p>
                <ul className="text-slate-400 text-sm space-y-1 ml-4">
                  <li>• Check if at least 1 player has joined</li>
                  <li>• Verify host permissions in Firebase</li>
                  <li>• Ensure quiz questions were generated properly</li>
                  <li>• Check for JavaScript errors in browser console</li>
                </ul>
                <p className="text-slate-300 text-sm mt-3">
                  <strong>Solution:</strong> Use "Test Firebase Connection" and run full diagnostics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="mt-8 bg-slate-900/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <h3 className="font-medium text-white mb-2">Still Having Issues?</h3>
            <p className="text-slate-400 text-sm mb-4">
              If the diagnostics don't resolve your issues, please check the browser console for errors
              and ensure your Firebase configuration is correct.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => window.open('https://console.firebase.google.com', '_blank')}>
                Open Firebase Console
              </Button>
              <Button variant="outline" onClick={() => {
                console.log('Quiz Arena Debug Info:', {
                  user: user ? { uid: user.uid, email: user.email } : null,
                  timestamp: new Date().toISOString(),
                  userAgent: navigator.userAgent,
                  url: window.location.href
                });
                toast?.({
                  title: 'Debug Info Logged',
                  description: 'Check browser console for debug information.',
                });
              }}>
                Log Debug Info
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}