'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProgressPersistence } from '@/hooks/useProgressPersistence';
import { useCloudSync } from '@/lib/cloud-sync';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { CheckCircle, XCircle, RefreshCw, Database, User, Cloud, HardDrive, Wifi, WifiOff, Clock, Save, Loader2 } from 'lucide-react';

export default function TestRememberingWorkPage() {
  const { user, loading: authLoading } = useAuth();
  const { syncStatus, forceSync } = useCloudSync();
  const { saveProgress, loadProgress, clearProgress } = useProgressPersistence('test-quiz-123');

  const [testResults, setTestResults] = useState<{
    authPersistence: boolean | null;
    progressPersistence: boolean | null;
    cloudSync: boolean | null;
    localStorage: boolean | null;
    sessionStorage: boolean | null;
  }>({
    authPersistence: null,
    progressPersistence: null,
    cloudSync: null,
    localStorage: null,
    sessionStorage: null
  });

  const [testing, setTesting] = useState(false);
  const [testProgress, setTestProgress] = useState('');

  // Test Authentication Persistence
  useEffect(() => {
    if (!authLoading) {
      setTestResults(prev => ({
        ...prev,
        authPersistence: !!user
      }));
    }
  }, [user, authLoading]);

  // Test Local Storage
  useEffect(() => {
    try {
      const testKey = 'quizzicallabs_test_key';
      const testValue = 'test_value_' + Date.now();
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      setTestResults(prev => ({
        ...prev,
        localStorage: retrieved === testValue
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        localStorage: false
      }));
    }
  }, []);

  // Test Session Storage
  useEffect(() => {
    try {
      const testKey = 'quizzicallabs_session_test';
      const testValue = 'session_test_' + Date.now();
      
      sessionStorage.setItem(testKey, testValue);
      const retrieved = sessionStorage.getItem(testKey);
      sessionStorage.removeItem(testKey);
      
      setTestResults(prev => ({
        ...prev,
        sessionStorage: retrieved === testValue
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        sessionStorage: false
      }));
    }
  }, []);

  const runComprehensiveTest = async () => {
    if (!user) {
      alert('Please log in to test remembering functionality');
      return;
    }

    setTesting(true);
    setTestProgress('Starting comprehensive remembering test...');

    try {
      // Test 1: Progress Persistence
      setTestProgress('Testing progress persistence...');
      const testProgressData = {
        answers: ['A', 'B', null, 'C'],
        currentQuestion: 2,
        timeSpent: 120000
      };

      saveProgress(testProgressData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for save

      const loadedProgress = await loadProgress();
      const progressWorks = loadedProgress && 
        loadedProgress.currentQuestion === testProgressData.currentQuestion &&
        loadedProgress.timeSpent === testProgressData.timeSpent;

      setTestResults(prev => ({
        ...prev,
        progressPersistence: !!progressWorks
      }));

      // Test 2: Cloud Sync
      setTestProgress('Testing cloud synchronization...');
      try {
        await forceSync();
        setTestResults(prev => ({
          ...prev,
          cloudSync: true
        }));
      } catch (error) {
        setTestResults(prev => ({
          ...prev,
          cloudSync: false
        }));
      }

      setTestProgress('All tests completed!');

    } catch (error) {
      console.error('Test failed:', error);
      setTestProgress('Test failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setTesting(false);
    }
  };

  const runRememberingFix = async () => {
    if (!user) {
      alert('Please log in to run remembering fixes');
      return;
    }

    setTesting(true);
    setTestProgress('Running remembering work fixes...');

    try {
      // Get Firebase ID token
      const { auth } = await import('@/lib/firebase');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Could not get authentication token');
      }

      const response = await fetch('/api/fix-remembering-work', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const result = await response.json();
      
      if (result.success) {
        setTestProgress(`✅ Fixes applied successfully! ${Object.values(result.fixes).filter(Boolean).length} issues resolved.`);
        
        // Re-run tests after fixes
        setTimeout(() => {
          runComprehensiveTest();
        }, 2000);
      } else {
        setTestProgress(`❌ Fix failed: ${result.error}`);
      }

    } catch (error) {
      setTestProgress(`❌ Fix failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTimeout(() => {
        setTesting(false);
      }, 3000);
    }
  };

  const clearTestData = async () => {
    try {
      clearProgress();
      localStorage.removeItem('test_data');
      sessionStorage.removeItem('test_session_data');
      alert('Test data cleared successfully');
    } catch (error) {
      alert('Failed to clear test data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <Clock className="h-5 w-5 text-gray-400" />;
    return status ? 
      <CheckCircle className="h-5 w-5 text-green-600" /> : 
      <XCircle className="h-5 w-5 text-red-600" />;
  };

  const getStatusColor = (status: boolean | null) => {
    if (status === null) return 'bg-gray-50 border-gray-200';
    return status ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  };

  const getStatusText = (status: boolean | null) => {
    if (status === null) return 'Testing...';
    return status ? 'Working' : 'Failed';
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Remembering Work Test" 
        description="Test user session persistence, progress saving, and data synchronization"
      />

      {/* User Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Authentication Status
          </CardTitle>
          <CardDescription>
            Current user session and authentication state
          </CardDescription>
        </CardHeader>
        <CardContent>
          {authLoading ? (
            <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              <span className="text-blue-800">Loading authentication state...</span>
            </div>
          ) : user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800">User authenticated successfully</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Email:</span>
                  <Badge variant="outline" className="ml-2">{user.email}</Badge>
                </div>
                <div>
                  <span className="text-gray-600">Plan:</span>
                  <Badge variant="outline" className="ml-2">{user.plan}</Badge>
                </div>
                <div>
                  <span className="text-gray-600">Email Verified:</span>
                  <Badge variant={user.emailVerified ? "default" : "destructive"} className="ml-2">
                    {user.emailVerified ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-600">Display Name:</span>
                  <Badge variant="outline" className="ml-2">{user.displayName || 'Not set'}</Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-4 bg-red-50 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">No user authenticated - please log in</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remembering Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Remembering Functionality Tests
          </CardTitle>
          <CardDescription>
            Test various data persistence and synchronization mechanisms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Authentication Persistence */}
            <div className={`p-4 rounded-lg border ${getStatusColor(testResults.authPersistence)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Auth Persistence</span>
                {getStatusIcon(testResults.authPersistence)}
              </div>
              <div className="text-sm text-gray-600">
                User session remembering across page reloads
              </div>
              <Badge variant="outline" className="mt-2">
                {getStatusText(testResults.authPersistence)}
              </Badge>
            </div>

            {/* Progress Persistence */}
            <div className={`p-4 rounded-lg border ${getStatusColor(testResults.progressPersistence)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Progress Persistence</span>
                {getStatusIcon(testResults.progressPersistence)}
              </div>
              <div className="text-sm text-gray-600">
                Quiz progress saving and loading
              </div>
              <Badge variant="outline" className="mt-2">
                {getStatusText(testResults.progressPersistence)}
              </Badge>
            </div>

            {/* Cloud Sync */}
            <div className={`p-4 rounded-lg border ${getStatusColor(testResults.cloudSync)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Cloud Sync</span>
                {getStatusIcon(testResults.cloudSync)}
              </div>
              <div className="text-sm text-gray-600">
                Cross-device data synchronization
              </div>
              <Badge variant="outline" className="mt-2">
                {getStatusText(testResults.cloudSync)}
              </Badge>
            </div>

            {/* Local Storage */}
            <div className={`p-4 rounded-lg border ${getStatusColor(testResults.localStorage)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Local Storage</span>
                {getStatusIcon(testResults.localStorage)}
              </div>
              <div className="text-sm text-gray-600">
                Browser local storage functionality
              </div>
              <Badge variant="outline" className="mt-2">
                {getStatusText(testResults.localStorage)}
              </Badge>
            </div>

            {/* Session Storage */}
            <div className={`p-4 rounded-lg border ${getStatusColor(testResults.sessionStorage)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Session Storage</span>
                {getStatusIcon(testResults.sessionStorage)}
              </div>
              <div className="text-sm text-gray-600">
                Browser session storage functionality
              </div>
              <Badge variant="outline" className="mt-2">
                {getStatusText(testResults.sessionStorage)}
              </Badge>
            </div>

            {/* Network Status */}
            <div className={`p-4 rounded-lg border ${syncStatus.isOnline ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Network Status</span>
                {syncStatus.isOnline ? 
                  <Wifi className="h-5 w-5 text-green-600" /> : 
                  <WifiOff className="h-5 w-5 text-red-600" />
                }
              </div>
              <div className="text-sm text-gray-600">
                Internet connectivity status
              </div>
              <Badge variant="outline" className="mt-2">
                {syncStatus.isOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>
          </div>

          {/* Test Progress */}
          {testing && (
            <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
              <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
              <span className="text-blue-800">{testProgress}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 flex-wrap">
            <Button 
              onClick={runComprehensiveTest}
              disabled={testing || !user}
              className="flex items-center gap-2"
            >
              {testing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Database className="h-4 w-4" />
              )}
              Run Comprehensive Test
            </Button>

            <Button 
              onClick={runRememberingFix}
              disabled={testing || !user}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              {testing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Fix Remembering Issues
            </Button>

            <Button 
              variant="outline"
              onClick={clearTestData}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Clear Test Data
            </Button>

            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sync Status Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Cloud Sync Status
          </CardTitle>
          <CardDescription>
            Real-time synchronization status and details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                {syncStatus.isOnline ? 
                  <Wifi className="h-8 w-8 text-green-600" /> : 
                  <WifiOff className="h-8 w-8 text-red-600" />
                }
              </div>
              <h3 className="font-medium mb-1">Connection</h3>
              <p className="text-sm text-muted-foreground">
                {syncStatus.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                {syncStatus.syncInProgress ? 
                  <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" /> : 
                  <CheckCircle className="h-8 w-8 text-green-600" />
                }
              </div>
              <h3 className="font-medium mb-1">Sync Status</h3>
              <p className="text-sm text-muted-foreground">
                {syncStatus.syncInProgress ? 'Syncing...' : 'Ready'}
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <HardDrive className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-medium mb-1">Pending Changes</h3>
              <p className="text-sm text-muted-foreground">
                {syncStatus.pendingChanges} items
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-medium mb-1">Last Sync</h3>
              <p className="text-sm text-muted-foreground">
                {syncStatus.lastSync ? new Date(parseInt(syncStatus.lastSync)).toLocaleTimeString() : 'Never'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Test Remembering Work</CardTitle>
          <CardDescription>
            Steps to verify that your data is being remembered correctly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-green-600 mb-2">✅ What Should Work:</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• User login state persists across page reloads</li>
                <li>• Quiz progress is saved automatically during quizzes</li>
                <li>• Bookmarks are remembered across sessions</li>
                <li>• Study streaks and achievements are preserved</li>
                <li>• Data syncs across different devices when logged in</li>
                <li>• Offline changes sync when connection is restored</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-blue-600 mb-2">🧪 Manual Testing Steps:</h4>
              <ol className="text-sm text-gray-600 space-y-1 ml-4">
                <li>1. Log in to your account</li>
                <li>2. Start a quiz and answer a few questions</li>
                <li>3. Refresh the page - quiz progress should be restored</li>
                <li>4. Bookmark a quiz</li>
                <li>5. Log out and log back in - bookmark should still be there</li>
                <li>6. Try accessing from a different device - data should sync</li>
              </ol>
            </div>

            <div>
              <h4 className="font-medium text-red-600 mb-2">❌ If Something's Not Working:</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Check browser console for errors</li>
                <li>• Verify internet connection for cloud sync</li>
                <li>• Clear browser cache and try again</li>
                <li>• Check if cookies and local storage are enabled</li>
                <li>• Try in an incognito/private window</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}