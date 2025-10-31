'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Play, X, Copy, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getConnectionStatus, forceReconnect } from '@/lib/firebase-connection';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  type: string;
}

interface RoomPlayer {
  userId: string;
  name: string;
  score: number;
  joinedAt: any;
}

interface RoomData {
  roomId: string;
  hostId: string;
  started: boolean;
  finished: boolean;
  currentQuestion: number;
  quiz: QuizQuestion[];
  playerCount: number;
  players: RoomPlayer[];
  questionStartTime?: any;
}

export default function RoomHostPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;
  const { user } = useAuth();
  const { toast } = useToast();

  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ isOnline: true, reconnectAttempts: 0 });

  const isHost = user && roomData?.hostId === user.uid;

  const loadRoomData = async () => {
    try {
      const { firestore } = await import('@/lib/firebase');
      const { doc, getDoc, collection, getDocs } = await import('firebase/firestore');

      const roomRef = doc(firestore, 'quiz-rooms', roomCode);
      const roomSnapshot = await getDoc(roomRef);

      if (!roomSnapshot.exists()) {
        throw new Error('Room not found');
      }

      const firebaseRoomData = roomSnapshot.data();
      const roomPlayers: RoomPlayer[] = [];
      
      try {
        const playersRef = collection(firestore, 'quiz-rooms', roomCode, 'players');
        const playersSnapshot = await getDocs(playersRef);

        playersSnapshot.forEach((doc) => {
          const playerData = doc.data();
          roomPlayers.push({
            userId: doc.id,
            name: playerData.name || 'Unknown Player',
            score: playerData.score || 0,
            joinedAt: playerData.joinedAt || new Date()
          });
        });
      } catch (error) {
        console.warn('Could not load players data:', error);
      }

      const roomData: RoomData = {
        roomId: roomCode,
        hostId: firebaseRoomData.hostId,
        started: firebaseRoomData.started || false,
        finished: firebaseRoomData.finished || false,
        currentQuestion: firebaseRoomData.currentQuestion !== undefined ? firebaseRoomData.currentQuestion : -1,
        quiz: firebaseRoomData.quiz || [],
        playerCount: roomPlayers.length,
        players: roomPlayers,
        questionStartTime: firebaseRoomData.questionStartTime || null
      };

      setRoomData(roomData);
      setQuizStarted(roomData.started);
    } catch (error) {
      console.error('Error loading room data:', error);
      toast?.({
        title: 'Error Loading Room',
        description: 'Could not load room data. Please check the room code.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRoomListener = async () => {
    if (!roomCode || !user) return () => {};

    try {
      const { QuizArena } = await import('@/lib/quiz-arena');

      const unsubscribeRoom = QuizArena.Host.listenToRoom(roomCode, (data: any) => {
        if (data) {
          setRoomData(prev => ({ ...prev, ...data }));
          setQuizStarted(data.started || false);
        }
      });

      const unsubscribePlayers = QuizArena.Player.listenToLeaderboard(roomCode, (players: any[]) => {
        setRoomData(prev => prev ? ({ ...prev, players, playerCount: players.length }) : null);
      });

      return () => {
        unsubscribeRoom?.();
        unsubscribePlayers?.();
      };
    } catch (error) {
      console.error('Error setting up listeners:', error);
      return () => {};
    }
  };

  useEffect(() => {
    if (!roomCode || !user) return;

    let isMounted = true;
    let cleanup: (() => void) | undefined;
    let connectionInterval: NodeJS.Timeout | undefined;

    const initializeHost = async () => {
      try {
        await loadRoomData();
        
        if (!isMounted) return;

        const cleanupFn = await setupRoomListener();
        if (isMounted) {
          cleanup = cleanupFn;
        } else {
          cleanupFn?.();
          return;
        }

        connectionInterval = setInterval(() => {
          if (isMounted) {
            setConnectionStatus(getConnectionStatus());
          }
        }, 5000);

      } catch (error) {
        console.error('Failed to initialize host:', error);
        if (isMounted) {
          toast?.({
            title: 'Initialization Failed',
            description: 'Failed to set up room. Please refresh the page.',
            variant: 'destructive'
          });
        }
      }
    };

    initializeHost();

    return () => {
      isMounted = false;
      
      if (cleanup) {
        try {
          cleanup();
        } catch (error) {
          console.warn('Error during cleanup:', error);
        }
      }
      
      if (connectionInterval) {
        clearInterval(connectionInterval);
      }
    };
  }, [roomCode, user]);

  const handleStartQuiz = async () => {
    if (!roomData || !user) return;

    if (roomData.started || quizStarted) {
      toast?.({
        title: 'Quiz Already Started',
        description: 'The quiz is already in progress.',
        variant: 'destructive'
      });
      return;
    }

    if (roomData.playerCount < 1) {
      toast?.({
        title: 'Cannot Start Quiz Yet',
        description: 'You need at least 1 player to start the quiz.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { QuizArena } = await import('@/lib/quiz-arena');
      
      setQuizStarted(true);
      
      toast?.({
        title: 'Starting Quiz...',
        description: 'Get ready, players! Quiz begins in 3 seconds...',
      });

      let countdown = 3;
      const countdownInterval = setInterval(() => {
        if (countdown > 0) {
          toast?.({
            title: `Quiz Starting in ${countdown}...`,
            description: 'Get ready to compete!',
          });
          countdown--;
        } else {
          clearInterval(countdownInterval);
        }
      }, 1000);

      setTimeout(async () => {
        try {
          await QuizArena.Host.startQuiz(roomCode, user.uid);

          toast?.({
            title: 'Quiz Started! 🎯',
            description: 'Managing live quiz...',
          });
          
        } catch (startError: any) {
          console.error('Error starting quiz:', startError);
          setQuizStarted(false);
          
          if (startError.message?.includes('already started')) {
            toast?.({
              title: 'Quiz Already Started',
              description: 'The quiz is already in progress.',
              variant: 'destructive'
            });
          } else {
            toast?.({
              title: 'Error Starting Quiz',
              description: startError.message || 'Please try again.',
              variant: 'destructive'
            });
          }
        }
      }, 3000);

    } catch (error: any) {
      console.error('Error in handleStartQuiz:', error);
      setQuizStarted(false);
      toast?.({
        title: 'Error Starting Quiz',
        description: error.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const copyRoomCode = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(roomCode);
      toast?.({
        title: 'Room Code Copied!',
        description: 'Share this with your friends to invite them to the quiz.',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold mb-2">Loading Room...</h2>
            <p className="text-muted-foreground">Setting up your quiz session</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Room Not Found</h2>
            <p className="text-muted-foreground mb-6">The room code is invalid or has expired.</p>
            <Button asChild>
              <Link href="/quiz-arena">Back to Quiz Arena</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Quiz Room: {roomCode}</h1>
            <p className="text-muted-foreground">
              {roomData.quiz.length} Questions • {roomData.playerCount} Players
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={copyRoomCode}>
              <Copy className="mr-2 h-4 w-4" />
              {roomCode}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {!quizStarted ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Ready to Start?</h2>
                  <p className="text-muted-foreground mb-6">
                    All players should join before you start the quiz
                  </p>
                  {isHost && (
                    <Button 
                      size="lg" 
                      onClick={handleStartQuiz} 
                      className="bg-accent"
                      disabled={roomData?.playerCount < 1 || quizStarted}
                    >
                      <Play className="mr-2 h-5 w-5" />
                      {quizStarted ? 'Quiz Starting...' : 'Start Quiz'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-green-600">Quiz is Live!</h2>
                  <p className="text-muted-foreground mb-6">
                    Players are now answering questions. Monitor their progress below.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="font-semibold">Current Question</div>
                      <div className="text-2xl font-bold text-primary">
                        {(roomData?.currentQuestion ?? 0) + 1} / {roomData?.quiz?.length || 0}
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="font-semibold">Active Players</div>
                      <div className="text-2xl font-bold text-green-600">
                        {roomData?.playerCount || 0}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <CardTitle className="text-lg">Players ({roomData.playerCount})</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roomData.players.map((player) => (
                    <div key={player.userId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Joined at {player.joinedAt?.toDate?.().toLocaleTimeString() || new Date(player.joinedAt).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{player.score}</div>
                        <div className="text-sm text-muted-foreground">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Room Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="secondary">
                    {quizStarted ? 'Quiz Live' : 'Waiting Room'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Questions</span>
                  <span>{roomData.quiz.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Players Joined</span>
                  <span>{roomData.playerCount}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <Button variant="outline" asChild>
            <Link href="/quiz-arena">Back to Quiz Arena</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}