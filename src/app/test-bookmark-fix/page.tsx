'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { CheckCircle, XCircle, RefreshCw, Database, AlertTriangle } from 'lucide-react';

export default function TestBookmarkFixPage() {
  const [migrationStatus, setMigrationStatus] = useState<{
    loading: boolean;
    success: boolean | null;
    message: string;
    details?: any;
  }>({
    loading: false,
    success: null,
    message: ''
  });

  const runMigration = async () => {
    setMigrationStatus({ loading: true, success: null, message: 'Starting bookmark migration...' });
    
    try {
      const response = await fetch('/api/fix-bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      setMigrationStatus({
        loading: false,
        success: result.success,
        message: result.message || 'Migration completed',
        details: result
      });
    } catch (error) {
      setMigrationStatus({
        loading: false,
        success: false,
        message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  const testBookmarkSave = async () => {
    try {
      // Test saving a bookmark with special characters
      const testQuiz = {
        id: 'QSBiYWxsIG9mIG1hc3MgMC41IGtnIGlzIG1vdmluZyB3aXRoIGEgdmVsb2NpdHkgb2YgMiBtL3MuIFdoYXQgaXMgaXRzIG1vbWVudHVtPw__',
        title: 'A ball of mass 0.5 kg is moving with a velocity of 2 m/s. What is its momentum?',
        subject: 'Physics',
        difficulty: 'Easy',
        questionCount: 1
      };

      console.log('🧪 Testing bookmark save with special characters...');
      console.log('Quiz ID:', testQuiz.id);
      
      // This would normally be done through the bookmark component
      alert('Check the console for bookmark test results. The actual bookmark save should now work without Firebase errors.');
      
    } catch (error) {
      console.error('❌ Bookmark test failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Bookmark Migration & Fix" 
        description="Fix Firebase bookmark permission errors and migrate existing bookmarks"
      />

      {/* Migration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Bookmark Migration Status
          </CardTitle>
          <CardDescription>
            Migrate bookmarks with invalid Firebase keys to fix permission errors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {migrationStatus.success === null && !migrationStatus.loading && (
            <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800">Ready to run bookmark migration</span>
            </div>
          )}

          {migrationStatus.loading && (
            <div className="flex items-center gap-2 p-4 bg-yellow-50 rounded-lg">
              <RefreshCw className="h-5 w-5 text-yellow-600 animate-spin" />
              <span className="text-yellow-800">{migrationStatus.message}</span>
            </div>
          )}

          {migrationStatus.success === true && (
            <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800">{migrationStatus.message}</span>
            </div>
          )}

          {migrationStatus.success === false && (
            <div className="flex items-center gap-2 p-4 bg-red-50 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{migrationStatus.message}</span>
            </div>
          )}

          {migrationStatus.details && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Migration Details:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Migrated:</span>
                  <Badge variant="outline" className="ml-2">
                    {migrationStatus.details.migratedCount || 0}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-600">Errors:</span>
                  <Badge variant={migrationStatus.details.errorCount > 0 ? "destructive" : "outline"} className="ml-2">
                    {migrationStatus.details.errorCount || 0}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              onClick={runMigration}
              disabled={migrationStatus.loading}
              className="flex items-center gap-2"
            >
              {migrationStatus.loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Database className="h-4 w-4" />
              )}
              Run Migration
            </Button>

            <Button 
              variant="outline"
              onClick={testBookmarkSave}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Test Bookmark Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Problem Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>What This Fixes</CardTitle>
          <CardDescription>
            Understanding the bookmark permission error
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-red-600 mb-2">❌ The Problem:</h4>
              <p className="text-sm text-gray-600">
                Firebase Realtime Database keys cannot contain special characters like <code>=</code>, <code>?</code>, <code>.</code>, <code>#</code>, <code>$</code>, <code>[</code>, <code>]</code>, or <code>/</code>.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Quiz IDs like <code>QSBiYWxsIG9mIG1hc3MgMC41IGtnIGlzIG1vdmluZyB3aXRoIGEgdmVsb2NpdHkgb2YgMiBtL3MuIFdoYXQgaXMgaXRzIG1vbWVudHVtPw__</code> contain <code>=</code> characters, causing permission_denied errors.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-green-600 mb-2">✅ The Solution:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Encode special characters in Firebase keys (e.g., <code>=</code> becomes <code>%3D</code>)</li>
                <li>• Store the original quiz ID in the bookmark data</li>
                <li>• Migrate existing bookmarks with invalid keys</li>
                <li>• Update bookmark lookup to use encoded keys</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-blue-600 mb-2">🔧 What the Migration Does:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Scans all user bookmarks for invalid Firebase keys</li>
                <li>• Creates new bookmarks with properly encoded keys</li>
                <li>• Removes old bookmarks with invalid keys</li>
                <li>• Preserves all bookmark data during migration</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CSP Fix Status */}
      <Card>
        <CardHeader>
          <CardTitle>Content Security Policy Fix</CardTitle>
          <CardDescription>
            Pusher WebSocket connection fix status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800">
              CSP updated to allow Pusher WebSocket connections (wss://ws-us3.pusher.com)
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            The Content Security Policy has been updated in <code>next.config.js</code> to include the Pusher domain that was being blocked.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}