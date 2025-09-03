'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Lock } from 'lucide-react';
import { FirebaseTest } from '@/lib/firebase-test';
import { useToast } from '@/hooks/use-toast';

export function AdminAccess() {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { toast } = useToast();

  const verifyCode = () => {
    const adminCode = 'QZ_ADMIN_2024_SECURE_DEV_ACCESS_KEY_XYZ789';
    
    if (code === adminCode) {
      setIsAuthorized(true);
      toast({
        title: 'Access Granted',
        description: 'Admin features unlocked'
      });
    } else {
      toast({
        title: 'Access Denied',
        description: 'Invalid admin code',
        variant: 'destructive'
      });
    }
  };

  const runTests = async () => {
    try {
      await FirebaseTest.runAllTests();
      toast({
        title: 'Tests Complete',
        description: 'Check console for results'
      });
    } catch (error) {
      toast({
        title: 'Test Failed',
        description: 'Error running tests',
        variant: 'destructive'
      });
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <Settings className="h-6 w-6" />
          <span className="text-xs">Admin</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Admin Access
          </DialogTitle>
        </DialogHeader>
        
        {!isAuthorized ? (
          <div className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter admin code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && verifyCode()}
              />
            </div>
            <Button onClick={verifyCode} className="w-full">
              Verify Access
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center text-green-600 font-medium">
              ✅ Admin Access Granted
            </div>
            
            <div className="space-y-2">
              <Button onClick={runTests} className="w-full">
                🧪 Test Firebase Storage
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  console.log('🗄️ Database Structure:');
                  console.log('- shared_quizzes/');
                  console.log('- question_bank/');
                  console.log('- users/{uid}/study_streak');
                  console.log('- quiz_likes/');
                }}
                className="w-full"
              >
                📋 Show DB Structure
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  toast({ title: 'Cache Cleared', description: 'Local storage cleared' });
                }}
                className="w-full"
              >
                🗑️ Clear Cache
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={() => {
                setIsAuthorized(false);
                setCode('');
              }}
              className="w-full"
            >
              🔒 Lock Admin Panel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}