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
import { useQuizTimer } from '@/hooks/useQuizTimer';
import { initializePerformanceOptimizations, createFastLoadingState } from '@/lib/performance-optimizations';
import { secureLogger } from '@/lib/security-logger';

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
  
  // Host quiz participation state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Timer for current question
  const { timeLeft: timeRemaining, isActive: timerActive } = useQuizTimer(roomData?.questionStartTime, 30);

  const isHost = user && roomData?.hostId === user.uid;

  const loadRoomData = async () => {
    try {
      // OPTIMIZED: Load Firebase modules once and cache them
      const { firestore } = await import('@/lib/firebase');
      const { doc, getDoc } = await import('firebase/firestore');

      // FASTER: Only load room data initially, players will be loaded via listeners
      const roomRef = doc(firestore, 'quiz-rooms', roomCode);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Room loading timeout')), 5000)
      );
      
      const roomSnapshot = await Promise.race([getDoc(roomRef), timeoutPromise]) as any;

      if (!roomSnapshot.exists()) {
        throw new Error('Room not found');
      }

      const firebaseRoomData = roomSnapshot.data();
      
      // OPTIMIZED: Start with minimal data, let listeners fill in the rest
      const roomData: RoomData = {
        roomId: roomCode,
        hostId: firebaseRoomData.hostId,
        started: firebaseRoomData.started || false,
        finished: firebaseRoomData.finished || false,
        currentQuestion: firebaseRoomData.currentQuestion !== undefined ? firebaseRoomData.currentQuestion : -1,
        quiz: firebaseRoomData.quiz || [],
        playerCount: 0, // Will be updated by listeners
        players: [], // Will be updated by listeners
        questionStartTime: firebaseRoomData.questionStartTime || null
      };

      setRoomData(roomData);
      setQuizStarted(roomData.started);
    } catch (error) {
      secureLogger.error('Error loading room data', error, { category: 'HOST' });
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
          // Check if question changed to reset host's answer state
          const prevQuestion = roomData?.currentQuestion;
          const newQuestion = data.currentQuestion;
          
          if (prevQuestion !== newQuestion && newQuestion >= 0) {
            // Reset host's answer state for new question
            setSelectedAnswer(null);
            setHasSubmitted(false);
            setShowResults(false);
          }
          
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
      secureLogger.error('Error setting up listeners', error, { category: 'HOST' });
      return () => {};
    }
  };

  useEffect(() => {
    if (!roomCode || !user) return;

    // PERFORMANCE: Initialize optimizations immediately
    initializePerformanceOptimizations();
    
    let isMounted = true;
    let cleanup: (() => void) | undefined;
    let connectionInterval: NodeJS.Timeout | undefined;
    
    // PERFORMANCE: Use fast loading state management
    const { setFastLoading } = createFastLoadingState();
    const stopFastLoading = setFastLoading(setLoading, 5000); // Max 5 seconds loading

    const initializeHost = async () => {
      try {
        // OPTIMIZED: Load room data and setup listeners in parallel for faster loading
        const [roomDataResult] = await Promise.allSettled([
          loadRoomData(),
          // Setup listeners immediately without waiting for room data
          setupRoomListener()
        ]);
        
        if (!isMounted) return;

        // Handle room data result
        if (roomDataResult.status === 'rejected') {
          throw roomDataResult.reason;
        }

        // OPTIMIZED: Less frequent connection status checks to reduce overhead
        connectionInterval = setInterval(() => {
          if (isMounted) {
            setConnectionStatus(getConnectionStatus());
          }
        }, 10000); // Reduced from 5s to 10s

      } catch (error) {
        secureLogger.error('Failed to initialize host', error, { category: 'HOST' });
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
      
      // PERFORMANCE: Stop fast loading timeout
      stopFastLoading();
      
      if (cleanup) {
        try {
          cleanup();
        } catch (error) {
          secureLogger.warn('Error during cleanup', error, { category: 'HOST' });
        }
      }
      
      if (connectionInterval) {
        clearInterval(connectionInterval);
      }
    };
  }, [roomCode, user]);

  // Auto-submit when timer expires
  useEffect(() => {
    if (timeRemaining === 0 && !hasSubmitted && selectedAnswer !== null && timerActive) {
      console.log('Auto-submitting host answer due to timer expiry');
      handleHostSubmitAnswer();
    }
  }, [timeRemaining, hasSubmitted, selectedAnswer, timerActive]);

  // Auto-advance to next question after showing results (REAL-TIME GAME MODE)
  useEffect(() => {
    if (showResults && roomData && user) {
      const timer = setTimeout(async () => {
        try {
          const { QuizArena } = await import('@/lib/quiz-arena');
          
          if (roomData.currentQuestion < roomData.quiz.length - 1) {
            // Move to next question - ALL PARTICIPANTS GET UPDATE INSTANTLY
            console.log(`🎮 HOST: Auto-advancing to question ${roomData.currentQuestion + 2}`);
            await QuizArena.Host.nextQuestion(roomCode, user.uid);
            
            toast?.({
              title: `Question ${roomData.currentQuestion + 2}`,
              description: 'Next question loaded for all players!',
            });
          } else {
            // Finish quiz - REAL-TIME LEADERBOARD
            console.log('🏆 HOST: Finishing quiz - showing final leaderboard');
            await QuizArena.Host.finishQuiz(roomCode, user.uid);
            
            toast?.({
              title: 'Quiz Completed! 🏆',
              description: 'Final leaderboard is now live for all players!',
            });
          }
        } catch (error) {
          console.error('Error advancing question:', error);
          toast?.({
            title: 'Error',
            description: 'Failed to advance question. Please try manually.',
            variant: 'destructive'
          });
        }
      }, 4000); // Show results for 4 seconds (like online games)

      return () => clearTimeout(timer);
    }
  }, [showResults, roomData, user, roomCode]);

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
      
      // FIXED: Prevent multiple start attempts
      setQuizStarted(true);
      
      toast?.({
        title: 'Starting Quiz...',
        description: 'Get ready, players! Quiz begins now...',
      });

      // FIXED: Start immediately without countdown to prevent race conditions
      try {
        await QuizArena.Host.startQuiz(roomCode, user.uid);

        toast?.({
          title: 'Quiz Started! 🎯',
          description: 'Managing live quiz...',
        });
        
      } catch (startError: any) {
        console.error('Error starting quiz:', startError);
        
        // FIXED: Don't reset quizStarted if it's already started
        if (!startError.message?.includes('already started')) {
          setQuizStarted(false);
        }
        
        if (startError.message?.includes('already started')) {
          toast?.({
            title: 'Quiz Already Started',
            description: 'The quiz is already in progress.',
          });
        } else if (startError.message?.includes('Permission denied')) {
          toast?.({
            title: 'Permission Error',
            description: 'Firebase security rules need to be updated. Please check the console for instructions.',
            variant: 'destructive'
          });
        } else if (startError.code === 'failed-precondition') {
          toast?.({
            title: 'Quiz Starting...',
            description: 'Quiz is being started, please wait...',
          });
        } else {
          toast?.({
            title: 'Error Starting Quiz',
            description: startError.message || 'Please try again.',
            variant: 'destructive'
          });
        }
      }

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

  const handleHostSubmitAnswer = async () => {
    if (!user || selectedAnswer === null || !roomData) return;

    setHasSubmitted(true);

    try {
      // Submit host's answer using the same API as participants
      const { auth } = await import('@/lib/firebase');
      if (!auth.currentUser) return;

      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch('/api/quiz-arena/submit-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          roomCode: roomCode.toUpperCase(),
          questionIndex: roomData.currentQuestion,
          answerIndex: selectedAnswer,
          submittedAt: Date.now()
        })
      });

      const result = await response.json();

      if (response.ok) {
        setShowResults(true);
        toast?.({
          title: result.correct ? 'Correct! 🎉' : 'Incorrect',
          description: result.correct ? `+${result.points} points!` : `Correct answer: ${result.correctAnswer}`,
          variant: result.correct ? 'default' : 'destructive'
        });
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error: any) {
      console.error('Host answer submission error:', error);
      setHasSubmitted(false);
      toast?.({
        title: 'Submission Failed',
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
                <CardContent className="p-8">
                  {roomData?.quiz && roomData.currentQuestion >= 0 && roomData.currentQuestion < roomData.quiz.length ? (
                    <div className="space-y-6">
                      {/* Question Header with Timer */}
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Trophy className="w-5 h-5 text-yellow-500" />
                          <span className="text-sm font-semibold text-yellow-600">HOST COMPETING</span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">
                          Question {roomData.currentQuestion + 1} of {roomData.quiz.length}
                        </div>
                        
                        {/* Timer Display */}
                        {timerActive && (
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <div className={`text-2xl font-mono font-bold px-4 py-2 rounded-lg ${
                              timeRemaining <= 5 ? 'bg-red-500 text-white animate-bounce' :
                              timeRemaining <= 10 ? 'text-red-600 bg-red-100' :
                              timeRemaining <= 20 ? 'text-orange-500 bg-orange-100' : 'text-green-600 bg-green-100'
                            }`}>
                              {timeRemaining}s
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Current Question */}
                      <div>
                        <h2 className="text-2xl font-bold mb-6 text-center">
                          {roomData.quiz[roomData.currentQuestion].question}
                        </h2>
                      </div>

                      {/* Answer Options */}
                      <div className="space-y-3">
                        {roomData.quiz[roomData.currentQuestion].options?.map((option: string, index: number) => {
                          const isSelected = selectedAnswer === index;
                          const isCorrect = index === roomData.quiz[roomData.currentQuestion].correctIndex;
                          const isWrongSelection = showResults && isSelected && !isCorrect;

                          return (
                            <div
                              key={index}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md relative overflow-hidden ${
                                !showResults ? 'hover:scale-[1.02] active:scale-[0.98]' : ''
                              } ${
                                isSelected && !showResults
                                  ? 'border-primary bg-primary/15 shadow-lg scale-[1.02] ring-2 ring-primary/30'
                                  : showResults && isCorrect
                                  ? 'border-green-500 bg-green-500/15 shadow-lg animate-pulse'
                                  : showResults && isWrongSelection
                                  ? 'border-red-500 bg-red-500/15'
                                  : !showResults
                                  ? 'border-muted hover:border-primary/60 hover:bg-primary/5'
                                  : 'border-muted/50 bg-muted/30'
                              }`}
                              onClick={() => {
                                if (!hasSubmitted && !showResults) {
                                  setSelectedAnswer(index);
                                }
                              }}
                            >
                              {/* Selection pulse effect */}
                              {isSelected && !showResults && (
                                <div className="absolute inset-0 bg-primary/10 animate-pulse rounded-xl" />
                              )}
                              
                              {/* Correct answer glow */}
                              {showResults && isCorrect && (
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 animate-pulse rounded-xl" />
                              )}

                              <div className="flex items-center gap-4 relative z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                  isSelected && !showResults
                                    ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                                    : showResults && isCorrect
                                    ? 'bg-green-500 text-white shadow-lg animate-bounce'
                                    : showResults && isWrongSelection
                                    ? 'bg-red-500 text-white shadow-lg'
                                    : 'bg-muted/50 border-2 border-muted-foreground/20 text-muted-foreground hover:bg-primary/20 hover:border-primary/40'
                                }`}>
                                  {String.fromCharCode(65 + index)}
                                </div>

                                <span className={`flex-1 transition-all duration-300 ${
                                  isSelected && !showResults
                                    ? 'font-semibold text-primary'
                                    : showResults && isCorrect
                                    ? 'font-bold text-green-700'
                                    : showResults && isWrongSelection
                                    ? 'font-medium text-red-600'
                                    : 'text-foreground hover:text-primary'
                                }`}>
                                  {option}
                                </span>

                                {/* Result Indicators */}
                                {showResults && isCorrect && (
                                  <div className="flex items-center gap-2 ml-auto">
                                    <div className="text-right">
                                      <div className="text-sm font-bold text-green-600">CORRECT!</div>
                                      <div className="text-xs text-green-500">+10 points</div>
                                    </div>
                                  </div>
                                )}

                                {isSelected && !showResults && (
                                  <div className="flex items-center gap-2 ml-auto">
                                    <span className="text-sm font-semibold text-primary">SELECTED</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Submit Button for Host */}
                      {!hasSubmitted && selectedAnswer !== null && !showResults && (
                        <div className="text-center">
                          <Button
                            onClick={handleHostSubmitAnswer}
                            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                            size="lg"
                          >
                            SUBMIT ANSWER (HOST)
                          </Button>
                        </div>
                      )}

                      {hasSubmitted && !showResults && (
                        <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <span className="text-yellow-600 font-semibold">Answer submitted - Managing quiz...</span>
                        </div>
                      )}

                      {/* Host Controls */}
                      <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-muted-foreground mb-2">HOST CONTROLS</div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-green-500/10 rounded-lg p-3">
                              <div className="font-semibold text-green-600">Quiz Live</div>
                              <div className="text-green-500">Question {roomData.currentQuestion + 1}/{roomData.quiz.length}</div>
                            </div>
                            <div className="bg-blue-500/10 rounded-lg p-3">
                              <div className="font-semibold text-blue-600">Players</div>
                              <div className="text-blue-500">{roomData.playerCount} competing</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2 text-green-600">Quiz is Live!</h2>
                      <p className="text-muted-foreground mb-6">
                        Loading questions... Get ready to compete with your participants!
                      </p>
                    </div>
                  )}
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