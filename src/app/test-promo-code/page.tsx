"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePlan } from "@/hooks/usePlan";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ref, get } from "firebase/database";
import { database } from "@/lib/firebase";
import { CheckCircle, XCircle, AlertCircle, Sparkles } from "lucide-react";

export default function TestPromoCodePage() {
  const { user, updateUserPlan } = useAuth();
  const { plan } = usePlan();
  const { toast } = useToast();
  
  const [testCode, setTestCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [availableCodes, setAvailableCodes] = useState<string[]>([]);
  const [firebaseData, setFirebaseData] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    // Load available codes
    const codes = process.env.NEXT_PUBLIC_PRO_ACCESS_CODES?.split(',') || [];
    setAvailableCodes(codes);
  }, []);

  useEffect(() => {
    // Load Firebase data
    if (user) {
      loadFirebaseData();
    }
  }, [user]);

  const loadFirebaseData = async () => {
    if (!user) return;
    
    try {
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      setFirebaseData(snapshot.val());
    } catch (error) {
      console.error('Error loading Firebase data:', error);
    }
  };

  const runTest = async (testName: string, code: string, shouldSucceed: boolean) => {
    setIsRedeeming(true);
    const startTime = Date.now();
    
    try {
      const proCodes = process.env.NEXT_PUBLIC_PRO_ACCESS_CODES?.split(',') || [];
      const isValid = proCodes.includes(code.trim().toUpperCase()) || code.trim().toUpperCase() === 'TEST123';
      
      if (isValid) {
        await updateUserPlan('Pro');
        const duration = Date.now() - startTime;
        
        setTestResults(prev => [...prev, {
          name: testName,
          code,
          success: true,
          expected: shouldSucceed,
          passed: shouldSucceed,
          duration,
          message: 'Code accepted and plan upgraded'
        }]);
        
        toast({ 
          title: "Test Passed ✅", 
          description: `${testName}: Code accepted`,
        });
        
        // Reload data
        await loadFirebaseData();
      } else {
        const duration = Date.now() - startTime;
        
        setTestResults(prev => [...prev, {
          name: testName,
          code,
          success: false,
          expected: shouldSucceed,
          passed: !shouldSucceed,
          duration,
          message: 'Code rejected as invalid'
        }]);
        
        toast({ 
          title: shouldSucceed ? "Test Failed ❌" : "Test Passed ✅", 
          description: `${testName}: Code rejected`,
          variant: shouldSucceed ? "destructive" : "default"
        });
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      
      setTestResults(prev => [...prev, {
        name: testName,
        code,
        success: false,
        expected: shouldSucceed,
        passed: false,
        duration,
        message: `Error: ${error}`
      }]);
      
      toast({ 
        title: "Test Error ⚠️", 
        description: `${testName}: ${error}`,
        variant: "destructive"
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    
    // Test 1: Valid code
    await runTest('Valid Code Test', 'QUIZPRO2024', true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 2: Invalid code
    await runTest('Invalid Code Test', 'INVALID123', false);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 3: Case insensitive
    await runTest('Case Insensitive Test', 'quizpro2024', true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 4: Whitespace handling
    await runTest('Whitespace Test', ' STUDYHARD ', true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 5: Test code
    await runTest('Test Code', 'TEST123', true);
  };

  const handleManualTest = async () => {
    if (!testCode.trim()) {
      toast({ title: "Please enter a code", variant: "destructive" });
      return;
    }
    
    await runTest('Manual Test', testCode, true);
    setTestCode('');
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Promo Code System Test</h1>
        <p className="text-muted-foreground">
          Test your promo code implementation and verify Firebase integration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">User:</span>
              <span className="font-medium">{user?.email || 'Not logged in'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Plan:</span>
              <Badge variant={plan === 'Pro' ? 'default' : 'secondary'}>
                {plan === 'Pro' && <Sparkles className="h-3 w-3 mr-1" />}
                {plan}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Available Codes:</span>
              <span className="font-medium">{availableCodes.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Firebase Data */}
        <Card>
          <CardHeader>
            <CardTitle>Firebase Data</CardTitle>
          </CardHeader>
          <CardContent>
            {firebaseData ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-medium">{firebaseData.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tokens Limit:</span>
                  <span className="font-medium">
                    {firebaseData.subscription?.tokens_limit?.toLocaleString() || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quizzes Limit:</span>
                  <span className="font-medium">
                    {firebaseData.subscription?.quizzes_limit || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">
                    {firebaseData.subscription?.subscription_status || 'N/A'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Loading...</p>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
              onClick={loadFirebaseData}
            >
              Refresh Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Available Codes */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Available Promo Codes</CardTitle>
          <CardDescription>
            These codes are loaded from NEXT_PUBLIC_PRO_ACCESS_CODES
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {availableCodes.map(code => (
              <Badge key={code} variant="outline" className="font-mono">
                {code}
              </Badge>
            ))}
            <Badge variant="outline" className="font-mono bg-blue-500/10">
              TEST123 (hardcoded)
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Manual Test */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Manual Test</CardTitle>
          <CardDescription>
            Enter a code to test the redemption flow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input 
              placeholder="Enter promo code..." 
              value={testCode}
              onChange={(e) => setTestCode(e.target.value)}
              disabled={isRedeeming}
            />
            <Button 
              onClick={handleManualTest}
              disabled={isRedeeming || !testCode.trim()}
            >
              {isRedeeming ? 'Testing...' : 'Test Code'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Automated Tests */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Automated Tests</CardTitle>
          <CardDescription>
            Run a suite of tests to verify all functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runAllTests}
            disabled={isRedeeming}
            className="w-full"
          >
            {isRedeeming ? 'Running Tests...' : 'Run All Tests'}
          </Button>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              {testResults.filter(t => t.passed).length} / {testResults.length} tests passed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.passed 
                      ? 'bg-green-500/10 border-green-500/20' 
                      : 'bg-red-500/10 border-red-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {result.passed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-medium">{result.name}</span>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      {result.duration}ms
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1 ml-7">
                    <div className="flex gap-2">
                      <span className="text-muted-foreground">Code:</span>
                      <span className="font-mono">{result.code}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-muted-foreground">Result:</span>
                      <span>{result.message}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Testing Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>1. Make sure you're logged in with a test account</p>
          <p>2. Check that your current plan is shown correctly</p>
          <p>3. Run manual tests with individual codes</p>
          <p>4. Run automated test suite to verify all scenarios</p>
          <p>5. Check Firebase data updates after each test</p>
          <p>6. Verify that Pro features become available after upgrade</p>
          <p className="text-muted-foreground mt-4">
            Note: If you're already on Pro plan, you may need to manually reset your plan in Firebase to test upgrades.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
