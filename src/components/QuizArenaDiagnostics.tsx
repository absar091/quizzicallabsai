'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, AlertCircle, RefreshCw, Wrench } from 'lucide-react';
import { QuizArenaDiagnostics, DiagnosticResult } from '@/lib/quiz-arena-diagnostics';

export default function QuizArenaDiagnosticsComponent() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isFixing, setIsFixing] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    try {
      const diagnostics = new QuizArenaDiagnostics();
      const diagnosticResults = await diagnostics.runFullDiagnostic();
      setResults(diagnosticResults);
    } catch (error) {
      console.error('Diagnostics failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runAutoFix = async () => {
    setIsFixing(true);
    try {
      const diagnostics = new QuizArenaDiagnostics();
      await diagnostics.autoFix();
      // Re-run diagnostics after fix
      await runDiagnostics();
    } catch (error) {
      console.error('Auto-fix failed:', error);
    } finally {
      setIsFixing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/50">PASS</Badge>;
      case 'fail':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">FAIL</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">WARNING</Badge>;
      default:
        return null;
    }
  };

  const failedCount = results.filter(r => r.status === 'fail').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const passedCount = results.filter(r => r.status === 'pass').length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Quiz Arena Diagnostics
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning}
            variant="outline"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Diagnostics
              </>
            )}
          </Button>
          
          {failedCount > 0 && (
            <Button 
              onClick={runAutoFix} 
              disabled={isFixing}
              variant="destructive"
            >
              {isFixing ? (
                <>
                  <Wrench className="h-4 w-4 mr-2 animate-spin" />
                  Fixing...
                </>
              ) : (
                <>
                  <Wrench className="h-4 w-4 mr-2" />
                  Auto-Fix ({failedCount})
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {results.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Click "Run Diagnostics" to check Quiz Arena health
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="text-2xl font-bold text-green-400">{passedCount}</div>
                <div className="text-sm text-green-300">Passed</div>
              </div>
              <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="text-2xl font-bold text-yellow-400">{warningCount}</div>
                <div className="text-sm text-yellow-300">Warnings</div>
              </div>
              <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="text-2xl font-bold text-red-400">{failedCount}</div>
                <div className="text-sm text-red-300">Failed</div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-3">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <div className="font-medium">{result.component}</div>
                      <div className="text-sm text-muted-foreground">{result.message}</div>
                    </div>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
              ))}
            </div>

            {/* Overall Status */}
            <div className="mt-6 p-4 rounded-lg border">
              {failedCount === 0 ? (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Quiz Arena is healthy!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">
                    Quiz Arena has {failedCount} issue{failedCount !== 1 ? 's' : ''} that need attention
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}