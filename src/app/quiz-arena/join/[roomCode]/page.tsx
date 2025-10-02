'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Users, Crown, Timer, ArrowLeft, CheckCircle, Lock, Gamepad2 } from 'lucide-react';
import { QuizArena, ArenaPlayer } from '@/lib/quiz-arena';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function JoinQuizPage() {
  const { roomCode } = useParams() as { roomCode: string };
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [roomValid, setRoomValid] = useState<boolean | null>(null);
  const [roomData, setRoomData] = useState<any>(null);
  const [players, setPlayers] = useState<ArenaPlayer[]>([]);

  useEffect(() => {
    // Redirect unauthenticated users with proper flow
    if (!user && !loading) {
      const redirectUrl = `/quiz-arena/join/${roomCode}?autoJoin=true`;
      localStorage.setItem('quizArenaRedirectUrl', redirectUrl);
      router.push('/signup');
      return;
    }

    if (!roomCode || !user) {
      setLoading(false);
      return;
    }

    // IMMEDIATE VALIDATION: Try to speed up validation
    const quickValidate = async () => {
      try {
        // Ultra-fast validation (under 1 second)
        const response = await fetch(`/api/quick-room-check?code=${roomCode.toUpperCase()}`, {
          signal: AbortSignal.timeout(1000) // 1 second timeout
        });

        if (response.ok) {
          const data = await response.json();
          setRoomValid(data.exists);
        } else if (response.status === 404) {
          setRoomValid(false);
        }
      } catch (error) {
        // Fallback to Firebase validation if API fails
        try {
          const isValid = await QuizArena.Discovery.validateRoom(roomCode.toUpperCase());
          setRoomValid(isValid);
        } catch {
          setRoomValid(false);
        }
      }
    };

    const setupRealTimeListeners = () => {
      try {
        // OPTIMIZED LISTENERS: Better performance with reduced re-renders
        const unsubscribeRoom = QuizArena.Player.listenToRoom(
          roomCode.toUpperCase(),
          (data) => {
            if (!data) {
              setRoomValid(false);
              setLoading(false);
              return;
            }

            setRoomData(data);
            setLoading(false);

            // AUTO-JOIN FIX: Only auto-join once, don't keep retrying
            if (user && data && !data.started && !data.finished && !joining) {
              joinRoom(data);
            }
          }
        );

        // Listen to player changes - OPTIMIZED
        const unsubscribePlayers = QuizArena.Player.listenToLeaderboard(
          roomCode.toUpperCase(),
          (playerList) => {
            setPlayers(playerList);
          }
        );

        return () => {
          unsubscribeRoom?.();
          unsubscribePlayers?.();
        };

      } catch (error) {
        console.error('Error setting up listeners:', error);
        setRoomValid(false);
        setLoading(false);
      }
    };

    // Execute validation and setup
    quickValidate();
    return setupRealTimeListeners();
  }, [roomCode, user]); // Removed 'joining' dependency to prevent re-setup

  const joinRoom = async (roomData: any) => {
    if (!user || !roomData || joining) return;

    setJoining(true);
    try {
      await QuizArena.Player.joinRoom(
        roomCode.toUpperCase(),
        user.uid,
        user.displayName || 'Anonymous'
      );

      // Redirect to participant view
      router.push(`/quiz-arena/participant/${roomCode}?joined=true`);

    } catch (error: any) {
      console.error('Error joining room:', error);
      toast?.({
        title: 'Failed to Join Room',
        description: error.message || 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setJoining(false);
    }
  };

  const leaveRoom = async () => {
    if (!user || !roomData) return;

    try {
      await QuizArena.Player.leaveRoom(roomCode.toUpperCase(), user.uid);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error leaving room:', error);
      toast?.({
        title: 'Failed to Leave Room',
        description: error.message || 'Please try again',
        variant: 'destructive'
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Finding Room {roomCode?.toUpperCase()}</h2>
            <p className="text-muted-foreground">
              Validating room code and checking availability...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Room not found
  if (roomValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-destructive/20 to-destructive/10">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-xl mb-2">Room Not Found</CardTitle>
            <p className="text-muted-foreground mb-4">
              The room "{roomCode?.toUpperCase()}" doesn't exist or has finished.
            </p>
            <div className="flex gap-2 justify-center">
              <Button asChild variant="outline">
                <Link href="/">Go Home</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not logged in - Redirect to quiz arena page with redirect
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl mb-4">Access Required</CardTitle>
            <p className="text-muted-foreground mb-6">
              Live quiz arenas require an account to track your progress and enable multiplayer features.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting you to create an account...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading room data or joining
  if (!roomData || joining) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {joining ? 'Joining Battle...' : 'Loading Room Details...'}
            </h2>
            <p className="text-muted-foreground">
              {joining
                ? `Entering ${roomCode?.toUpperCase()} as ${user.displayName || 'Anonymous'}`
                : 'Preparing room information...'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show room preview and join options
  const currentPlayer = players.find(p => p.userId === user.uid);
  const isHost = roomData.hostId === user.uid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            BACK
          </Button>

          <div className="flex items-center gap-2">
            <Gamepad2 style={{ color: 'primary' }} className="w-5 h-5" />
            <span className="text-primary font-semibold">JOIN ARENA</span>
          </div>
        </div>

        {/* Room Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">Room {roomCode.toUpperCase()}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Crown className="h-4 w-4" />
                    Host: {players.find(p => p.userId === roomData.hostId)?.name || 'Unknown'}
                  </div>
                  {!roomData.started && (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-400">
                      WAITING ROOM
                    </Badge>
                  )}
                </div>
              </div>
              {isHost && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  HOST
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Players ({players.length})</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {players.slice(0, 8).map((player, index) => (
                    <div key={player.userId} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                      <div className="flex items-center gap-2">
                        {index === 0 ? (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <span className="text-sm text-muted-foreground">#{index + 1}</span>
                        )}
                        <span className="font-medium">{player.name}</span>
                        {player.userId === user.uid && (
                          <Badge variant="secondary">(You)</Badge>
                        )}
                      </div>
                      {roomData.started && (
                        <span className="text-sm font-medium">{player.score} pts</span>
                      )}
                    </div>
                  ))}
                  {players.length > 8 && (
                    <div className="text-sm text-muted-foreground text-center py-2">
                      +{players.length - 8} more players
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Room Settings</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={roomData.started ? "default" : "secondary"}>
                      {roomData.started ? 'IN PROGRESS' : 'WAITING'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Questions:</span>
                    <span>{roomData.quiz?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timer:</span>
                    <span>30s per question</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Privacy:</span>
                    <Badge variant="outline">
                      {roomData.isPublic ? 'PUBLIC' : 'PRIVATE'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6 justify-center">
              {!currentPlayer && !roomData.started ? (
                <Button
                  onClick={() => joinRoom(roomData)}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <Users className="mr-2 h-4 w-4" />
                  JOIN BATTLE
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline">
                    <Link href="/dashboard">
                      EXIT TO DASHBOARD
                    </Link>
                  </Button>
                  {!isHost && !roomData.started && (
                    <Button
                      onClick={leaveRoom}
                      variant="destructive"
                      size="sm"
                    >
                      LEAVE ROOM
                    </Button>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {currentPlayer && (
          <div className="flex justify-center gap-4">
            {isHost ? (
              <Button asChild className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                <Link href={`/quiz-arena/host/${roomCode}`}>
                  <Crown className="mr-2 h-4 w-4" />
                  ENTER AS HOST
                </Link>
              </Button>
            ) : (
              <Button asChild className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                <Link href={`/quiz-arena/participant/${roomCode}`}>
                  <Users className="mr-2 h-4 w-4" />
                  ENTER AS PARTICIPANT
                </Link>
              </Button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
