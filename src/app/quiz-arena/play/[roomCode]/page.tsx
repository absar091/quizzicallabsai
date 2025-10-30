'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { Users, Clock, Play, AlertCircle } from 'lucide-react';

interface PageProps {
  params: {
    roomCode: string;
  };
}

export default function QuizArenaPlayPage({ params }: PageProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      // Redirect unauthenticated users to join page (which handles signup)
      router.push(`/quiz-arena/join/${params.roomCode}`);
    }
  }, [user, loading, router, params.roomCode]);

  const joinRoom = async () => {
    setJoining(true);
    setError(null);

    try {
      // Redirect to join page where user can properly join the room
      router.push(`/quiz-arena/join/${params.roomCode}`);
    } catch (error) {
      setError('Failed to join room. Please try again.');
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Join Room ${params.roomCode}`}
        description="Join this quiz arena room to compete with other players"
      />

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="h-5 w-5" />
              Quiz Arena Room
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {params.roomCode}
              </div>
              <p className="text-muted-foreground">
                Room Code
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">Player:</span>
                <Badge variant="outline">{user.displayName || user.email}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">Status:</span>
                <Badge variant="secondary">Ready to Join</Badge>
              </div>
            </div>

            <Button 
              onClick={joinRoom}
              disabled={joining}
              className="w-full"
              size="lg"
            >
              {joining ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Joining Room...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Join Room
                </>
              )}
            </Button>

            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => router.push('/quiz-arena')}
                className="text-sm"
              >
                Back to Quiz Arena
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}