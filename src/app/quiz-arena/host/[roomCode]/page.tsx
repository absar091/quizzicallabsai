'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Clock, Trophy, Play, Pause, Settings, CheckCircle, X, Share2, Copy, MessageCircle, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useQuizTimer } from '@/hooks/useQuizTimer';
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
  joinedAt: string;
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
}

export default function RoomHostPage() {
  const params = useParams();
  const roomCode = params.roomCode as string;
  const { user } = useAuth();
  const { toast } = useToast();

  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const { timeLeft, isActive: timerActive } = useQuizTimer(roomData?.questionStartTime, 30);
  const [connectionStatus, setConnectionStatus] = useState({ isOnline: true, reconnectAttempts: 0 });

  useEffect(() => {
    if (!roomCode || !user) return;

    loadRoomData();

    // Set up real-time listener
    const cleanup = setupRoomListener();
    
    // Monitor connection status
    const connectionInterval = setInterval(() => {
      setConnectionStatus(getConnectionStatus());
    }, 5000);
    
    return () => {
      cleanup?.();
      clearInterval(connectionInterval);
    };
  }, [roomCode, user]);

  // Auto advance when timer expires
  useEffect(() => {
    if (timeLeft === 0 && !timerActive && isHost && currentQuestionIndex >= 0) {
      if (currentQuestionIndex < (roomData?.quiz.length || 0) - 1) {
        setTimeout(() => handleNextQuestion(), 2000);
      } else {
        setTimeout(() => handleFinishQuiz(), 2000);
      }
    }
  }, [timeLeft, timerActive, isHost, currentQuestionIndex, roomData?.quiz.length]);

  const loadRoomData = async () => {
    try {
      // Loading room data

      // Load room data from Firestore using QuizArena Discovery
      const { QuizArena } = await import('@/lib/quiz-arena');

      // Try to get room data from Firestore
      const { firestore } = await import('@/lib/firebase');
      const { doc, getDoc } = await import('firebase/firestore');

      // Get room data from Firestore
      const roomRef = doc(firestore, 'quiz-rooms', roomCode);
      const roomSnapshot = await getDoc(roomRef);

      if (!roomSnapshot.exists()) {
        throw new Error('Room not found');
      }

      const firebaseRoomData = roomSnapshot.data();

      // Room data loaded

      // Transform Firebase room data to component format
      const roomPlayers = [];
      try {
        const { collection, getDocs } = await import('firebase/firestore');
        const playersRef = collection(firestore, 'quiz-rooms', roomCode, 'players');
        const playersSnapshot = await getDocs(playersRef);

        playersSnapshot.forEach((doc) => {
          const playerData = doc.data();
          roomPlayers.push({
            userId: doc.id,
            name: playerData.name || 'Unknown Player',
            score: playerData.score || 0,
            joinedAt: playerData.joinedAt?.toDate()?.toISOString() || new Date().toISOString()
          });
        });
      } catch (error) {
        console.warn('Could not load players data:', error);
        // Add host as default player
        roomPlayers.push({
          userId: user?.uid || '',
          name: user?.displayName || 'Host',
          score: 0,
          joinedAt: new Date().toISOString()
        });
      }

      // Convert room data to component format
      const roomData: RoomData = {
        roomId: roomCode,
        hostId: firebaseRoomData.hostId,
        started: firebaseRoomData.started || false,
        finished: firebaseRoomData.finished || false,
        currentQuestion: firebaseRoomData.currentQuestion || -1,
        quiz: firebaseRoomData.quiz || [],
        playerCount: roomPlayers.length,
        players: roomPlayers
      };

      // Room data loaded successfully

      setRoomData(roomData);
      setCurrentQuestionIndex(roomData.currentQuestion);
      setQuizStarted(roomData.started);

    } catch (error) {
      console.error('Error loading room data');
      toast?.({
        title: 'Error Loading Room',
        description: 'Could not load room data. Please check the room code.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRoomListener = () => {
    if (!roomCode || !user) return;

    try {
      const { QuizArena } = require('@/lib/quiz-arena');

      // Real-time room state listener
      const unsubscribeRoom = QuizArena.Host.listenToRoom(
        roomCode,
        (data: any) => {
          if (data) {
            setRoomData(prev => ({ ...prev, ...data }));
            setCurrentQuestionIndex(data.currentQuestion || -1);
            setQuizStarted(data.started || false);
          }
        }
      );

      // Real-time players listener
      const unsubscribePlayers = QuizArena.Player.listenToLeaderboard(
        roomCode,
        (players: any[]) => {
          console.log('Host - Leaderboard updated:', players);
          setRoomData(prev => ({
            ...prev,
            players,
            playerCount: players.length
          }));
        }
      );

      return () => {
        unsubscribeRoom?.();
        unsubscribePlayers?.();
      };
    } catch (error) {
      console.error('Error setting up listeners:', error);
    }
  };

  const handleStartQuiz = async () => {
    if (!roomData) return;

    // Require at least 2 players (host + 1 other)
    if (roomData.playerCount < 2) {
      toast?.({
        title: 'Cannot Start Quiz Yet',
        description: 'You need at least 2 players (host + 1 participant) to start the quiz.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { QuizArena } = await import('@/lib/quiz-arena');

      toast?.({
        title: 'Starting Quiz...',
        description: 'Get ready, players! Quiz begins in 3 seconds...',
      });

      // Start countdown
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

      // Small delay to let participants prepare
      setTimeout(async () => {
        // Start quiz in Firebase
        await QuizArena.Host.startQuiz(roomCode, user!.uid);

        setQuizStarted(true);
        setCurrentQuestionIndex(0);

        toast?.({
          title: 'Quiz Started! 🎯',
          description: 'Good luck to all players!',
        });
      }, 3000);

    } catch (error) {
      console.error('Error starting quiz');
      toast?.({
        title: 'Error Starting Quiz',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleNextQuestion = async () => {
    if (!roomData || currentQuestionIndex >= roomData.quiz.length - 1) return;

    try {
      const { QuizArena } = await import('@/lib/quiz-arena');

      // Move to next question in Firebase
      await QuizArena.Host.nextQuestion(roomCode, user!.uid);

      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);

      toast?.({
        title: 'Next Question',
        description: `Question ${nextIndex + 1} of ${roomData.quiz.length}`,
      });

    } catch (error) {
      console.error('Error advancing question');
    }
  };

  const handleFinishQuiz = async () => {
    try {
      const { QuizArena } = await import('@/lib/quiz-arena');

      // Finish quiz in Firebase
      await QuizArena.Host.finishQuiz(roomCode, user!.uid);

      setQuizStarted(false);
      setCurrentQuestionIndex(-1);

      toast?.({
        title: 'Quiz Finished! 🏆',
        description: 'Time to see the results!',
      });

    } catch (error) {
      console.error('Error finishing quiz');
    }
  };

  const handlePauseQuiz = async () => {
    toast?.({
      title: 'Pause/Unpause Feature',
      description: 'This feature will be implemented with the buzzer system.',
    });
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast?.({
      title: 'Room Code Copied!',
      description: 'Share this with your friends to invite them to the quiz.',
    });
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

  // Define isHost early to prevent undefined behavior
  const isHost = user && roomData?.hostId === user.uid;
  const currentQuestion = roomData?.quiz[currentQuestionIndex];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Quiz Room: {roomCode}</h1>
            <p className="text-muted-foreground">
              {roomData.quiz.length} Questions • {roomData.playerCount} Players
            </p>
          </div>

          <div className="flex gap-2">
            {/* Connection Status Indicator */}
            {!connectionStatus.isOnline && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={forceReconnect}
                className="animate-pulse"
              >
                📴 Offline - Tap to Reconnect
              </Button>
            )}
            {connectionStatus.reconnectAttempts > 0 && connectionStatus.isOnline && (
              <Button variant="outline" size="sm" disabled>
                🔄 Reconnecting... ({connectionStatus.reconnectAttempts})
              </Button>
            )}
            
            <Button variant="outline" onClick={copyRoomCode}>
              <Copy className="mr-2 h-4 w-4" />
              {roomCode}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const joinLink = `${window.location.origin}/quiz-arena/join/${roomCode}`;
                navigator.clipboard.writeText(joinLink);
                toast?.({
                  title: 'Link Copied to Clipboard!',
                  description: 'Share this link with your friends to invite them to the quiz.',
                });
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Join Link
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const message = `🎯 Join my live quiz battle!\n\nRoom: ${roomCode}\n\nLink: ${window.location.origin}/quiz-arena/join/${roomCode}\n\nGet ready for some epic competition! 🏆`;
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Quiz Area */}
          <div className="lg:col-span-2 space-y-6">
            {!quizStarted && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Ready to Start?</h2>
                  <p className="text-muted-foreground mb-6">
                    All players should join before you start the quiz
                  </p>
                  {isHost && (
                    <Button size="lg" onClick={handleStartQuiz} className="bg-accent">
                      <Play className="mr-2 h-5 w-5" />
                      Start Quiz
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {quizStarted && currentQuestion && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        Question {currentQuestionIndex + 1}
                      </Badge>
                      <Badge variant={timeLeft <= 10 ? "destructive" : "outline"}>
                        <Clock className="mr-1 h-3 w-3" />
                        {timeLeft}s
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentQuestionIndex + 1} of {roomData.quiz.length}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isCorrect = index === currentQuestion.correctIndex;

                    return (
                      <div
                        key={index}
                        className={cn(
                          "p-4 border rounded-lg transition-colors relative",
                          isCorrect
                            ? "bg-green-500/10 border-green-500/50"
                            : "bg-muted/50 border-muted"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                              isCorrect
                                ? "bg-green-500 text-white"
                                : "bg-muted text-muted-foreground"
                            )}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className={cn(
                              "text-lg font-medium",
                              isCorrect && "text-green-700 font-semibold"
                            )}>
                              {option}
                            </span>
                          </div>
                          {isCorrect && (
                            <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-500/50">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Correct Answer
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
                <CardContent className="pt-0">
                  {isHost && (
                    <div className="flex gap-2">
                      {currentQuestionIndex < roomData.quiz.length - 1 ? (
                        <Button onClick={handleNextQuestion} className="flex-1">
                          Next Question
                        </Button>
                      ) : (
                        <Button onClick={handleFinishQuiz} className="flex-1 bg-green-600 hover:bg-green-700">
                          Finish Quiz
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Host Controls - Show BEFORE and DURING quiz */}
            {isHost && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Host Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!quizStarted ? (
                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">
                        {roomData?.playerCount > 2
                          ? `${roomData.playerCount - 1} friends ready. Start the battle!`
                          : "Waiting for more players to join..."
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          toast?.({
                            title: 'Timer Control',
                            description: 'Timer is controlled automatically by the quiz system',
                          });
                        }}
                      >
                        <Pause className="mr-2 h-4 w-4" />
                        Timer Control
                      </Button>
                      <Button variant="outline">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Players List */}
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
                          Joined at {new Date(player.joinedAt).toLocaleTimeString()}
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

            {/* Leaderboard */}
            {quizStarted && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    <CardTitle className="text-lg">Leaderboard</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[...roomData.players]
                      .sort((a, b) => b.score - a.score)
                      .map((player, index) => (
                        <div key={player.userId} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={index === 0 ? "default" : "secondary"}>
                              #{index + 1}
                            </Badge>
                            <span className="font-medium">{player.name}</span>
                          </div>
                          <span className="font-bold">{player.score}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Room Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Room Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={quizStarted ? "default" : "secondary"}>
                    {quizStarted ? "Active" : "Waiting"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Questions</span>
                  <span>{roomData.quiz.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current</span>
                  <span>{currentQuestionIndex + 1}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Button variant="outline" asChild>
            <Link href="/quiz-arena">Back to Quiz Arena</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
