'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Users, Crown, Timer, ArrowLeft, CheckCircle, Trophy, LogOut, AlertTriangle, WifiOff } from 'lucide-react';
import type { ArenaPlayer, QuizArenaRoom, QuizQuestion } from '@/lib/quiz-arena';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useQuizTimer } from '@/hooks/useQuizTimer';
import { useConnectionRecovery } from '@/hooks/useConnectionRecovery';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { initializePerformanceOptimizations, createFastLoadingState } from '@/lib/performance-optimizations';

import ErrorBoundary from '@/components/ErrorBoundary';

function ParticipantArenaPageContent() {
  const { roomCode } = useParams() as { roomCode: string };
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [roomData, setRoomData] = useState<QuizArenaRoom | null>(null);
  const [players, setPlayers] = useState<ArenaPlayer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { timeLeft: timeRemaining, isActive: timerActive } = useQuizTimer(roomData?.questionStartTime, 30);
  const { isOnline, reconnecting, reconnect } = useConnectionRecovery();
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [QuizArena, setQuizArena] = useState<any>(null);
  const [hostPresent, setHostPresent] = useState(true);
  const hasRedirectedRef = useRef(false);
  const submissionRef = useRef(false);
  const hostCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load QuizArena module once
  useEffect(() => {
    const loadQuizArena = async () => {
      const module = await import('@/lib/quiz-arena');
      setQuizArena(module.QuizArena);
    };
    loadQuizArena();
  }, []);

  useEffect(() => {
    // PERFORMANCE: Initialize optimizations immediately
    initializePerformanceOptimizations();
    
    // Fix redirect loop: use ref to prevent multiple redirects
    if (!roomCode || !user || !QuizArena) {
      if (!hasRedirectedRef.current && roomCode) {
        hasRedirectedRef.current = true;
        router.push(`/quiz-arena/join/${roomCode}`);
      }
      return;
    }
    
    // PERFORMANCE: Use fast loading state management
    const { setFastLoading } = createFastLoadingState();
    const stopFastLoading = setFastLoading(setLoading, 5000); // Max 5 seconds loading

    const initializeParticipant = async () => {
      try {
        // OPTIMIZED: Skip room validation for faster loading - listeners will handle invalid rooms
        // const isValid = await QuizArena.Discovery.validateRoom(roomCode.toUpperCase());
        
        // FASTER: Start listeners immediately without validation
        const unsubscribeRoom = QuizArena.Player.listenToRoom(
          roomCode.toUpperCase(),
          async (data) => {
            // Handle invalid room in the listener callback
            if (!data) {
              toast?.({
                title: 'Room Not Found',
                description: 'The room has expired or been deleted.',
                variant: 'destructive'
              });
              router.push('/dashboard');
              return;
            }
            console.log('Participant - Room data updated:', {
              started: data?.started,
              currentQuestion: data?.currentQuestion,
              quizLength: data?.quiz?.length,
              finished: data?.finished
            });
            
            // Check if quiz just started
            const wasStarted = roomData?.started;
            const isNowStarted = data?.started;
            
            if (!wasStarted && isNowStarted) {
              console.log('🎮 GAME STARTED! Real-time quiz mode activated!');
              toast?.({
                title: '🎮 GAME STARTED!',
                description: 'Live multiplayer quiz is now active! Compete in real-time!',
              });
              
              // Add game start sound effect (optional)
              if (typeof window !== 'undefined' && window.navigator?.vibrate) {
                window.navigator.vibrate([200, 100, 200]); // Vibration for mobile
              }
            }

            setRoomData(data);

            if (data.finished) {
              toast?.({
                title: 'Quiz Finished!',
                description: 'The host ended the quiz.',
              });
              router.push('/dashboard');
              return;
            }

            // FIXED: Handle quiz questions when quiz is started - REAL-TIME GAME MODE
            if (data.started && data.quiz && Array.isArray(data.quiz) && data.quiz.length > 0) {
              const questionIndex = data.currentQuestion !== undefined ? data.currentQuestion : 0;
              console.log('🎮 GAME UPDATE: Question', questionIndex + 1, 'of', data.quiz.length);
              
              // FIXED: Validate question index before accessing
              if (questionIndex >= 0 && questionIndex < data.quiz.length) {
                const newQuestion = data.quiz[questionIndex];
                
                // FIXED: Validate question structure
                if (newQuestion && newQuestion.question && Array.isArray(newQuestion.options)) {
                  console.log('🎯 Loading question:', newQuestion.question);
                  
                  // FIXED: Reset states in correct order to prevent race conditions
                  setHasSubmitted(false);
                  setSelectedAnswer(null);
                  setShowResults(false);
                  setIsAnswered(false);
                  
                  // Set question last to ensure other states are ready
                  setCurrentQuestion(newQuestion);
                  
                  // Show question transition notification (like online games)
                  if (questionIndex > 0) {
                    toast?.({
                      title: `Question ${questionIndex + 1}`,
                      description: 'New question loaded! Answer quickly!',
                    });
                  }
                } else {
                  console.error('🚨 Invalid question structure:', newQuestion);
                  toast?.({
                    title: 'Error: Invalid Question',
                    description: 'Question data is corrupted. Please refresh.',
                    variant: 'destructive'
                  });
                }
              } else if (questionIndex >= data.quiz.length) {
                console.log('🏆 Quiz completed - all questions answered');
                // Quiz is finished
                setCurrentQuestion(null);
              }
            } else if (data.started && (!data.quiz || data.quiz.length === 0)) {
              console.error('🚨 Quiz started but no questions found in database!');
              toast?.({
                title: 'Error: No Questions',
                description: 'Quiz started but questions are missing from database.',
                variant: 'destructive'
              });
              setCurrentQuestion(null);
            } else if (data.started && data.currentQuestion === -1) {
              console.log('🎮 Quiz started but waiting for first question...');
              setCurrentQuestion(null);
            }
          }
        );

        // Listen to leaderboard changes - REAL-TIME GAMING
        const unsubscribePlayers = QuizArena.Player.listenToLeaderboard(
          roomCode.toUpperCase(),
          (playerList) => {
            console.log('🏆 LIVE LEADERBOARD UPDATE:', playerList.length, 'players');
            
            // FIXED: Check for score changes with proper state management
            setPlayers(prevPlayers => {
              const currentUser = playerList.find(p => p.userId === user?.uid);
              const previousUser = prevPlayers.find(p => p.userId === user?.uid);
              
              // FIXED: Only show notification if we have valid previous data
              if (currentUser && previousUser && currentUser.score > previousUser.score) {
                const pointsGained = currentUser.score - previousUser.score;
                
                // Use setTimeout to ensure toast shows after state update
                setTimeout(() => {
                  toast?.({
                    title: `+${pointsGained} Points! 🎉`,
                    description: `Your score: ${currentUser.score}`,
                  });
                }, 100);
              }
              
              return playerList;
            });
          }
        );

        // Monitor host presence
        const checkHostPresence = async () => {
          if (!QuizArena || !roomCode) return;
          
          try {
            const isPresent = await QuizArena.Host.checkHostPresence(roomCode.toUpperCase());
            setHostPresent(isPresent);
            
            if (!isPresent && roomData?.started && !roomData?.finished) {
              toast?.({
                title: 'Host Disconnected',
                description: 'The host appears to have left. Looking for a new host...',
                variant: 'destructive'
              });
              
              // Try to handle host abandonment
              const newHostId = await QuizArena.Host.handleHostAbandonment(roomCode.toUpperCase());
              if (newHostId) {
                toast?.({
                  title: 'New Host Found',
                  description: 'A participant has been promoted to host. Quiz continues!',
                });
              }
            }
          } catch (error) {
            console.error('Error checking host presence:', error);
          }
        };

        // OPTIMIZED: Check host presence less frequently to reduce overhead
        hostCheckIntervalRef.current = setInterval(checkHostPresence, 60000); // Reduced from 30s to 60s
        
        setLoading(false);

        return () => {
          // PERFORMANCE: Stop fast loading timeout
          stopFastLoading();
          
          unsubscribeRoom();
          unsubscribePlayers();
          
          if (hostCheckIntervalRef.current) {
            clearInterval(hostCheckIntervalRef.current);
            hostCheckIntervalRef.current = null;
          }
        };

      } catch (error) {
        console.error('Error initializing participant:', error);
        toast?.({
          title: 'Connection Failed',
          description: 'Unable to join the room. Please try again.',
          variant: 'destructive'
        });
        if (!hasRedirectedRef.current) {
          hasRedirectedRef.current = true;
          router.push(`/quiz-arena/join/${roomCode}`);
        }
      }
    };

    initializeParticipant();
  }, [roomCode, user, QuizArena]); // Added QuizArena to dependencies

  const handleSubmitAnswer = useCallback(async () => {
    // Create a unique submission ID for this attempt
    const submissionId = `${Date.now()}-${Math.random()}`;
    
    // Atomic check and set using a more robust approach
    if (hasSubmitted || selectedAnswer === null || !currentQuestion || submitting) {
      console.log('Submission blocked by state check');
      return;
    }

    // Double-check with ref to prevent race conditions
    if (submissionRef.current) {
      console.log('Submission blocked by ref check');
      return;
    }

    // Set submission lock immediately
    submissionRef.current = true;
    
    // Create a local copy of critical data to prevent changes during submission
    const submissionData = {
      roomCode: roomCode.toUpperCase(),
      questionIndex: roomData?.currentQuestion,
      answerIndex: selectedAnswer,
      submittedAt: Date.now(),
      submissionId
    };

    // Validate submission data
    if (submissionData.questionIndex === undefined || submissionData.answerIndex === null) {
      submissionRef.current = false;
      console.error('Invalid submission data');
      return;
    }

    // Set UI states
    setSubmitting(true);
    setHasSubmitted(true);
    setIsAnswered(true);

    try {
      // Server-side answer submission with authentication
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const idToken = await auth.currentUser.getIdToken();
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('/api/quiz-arena/submit-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(submissionData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 409) {
          // Answer already submitted - this is actually success
          console.log('Answer already submitted (409), treating as success');
          setShowResults(true);
          return;
        }
        throw new Error(result.error || `Submission failed (${response.status})`);
      }

      // Show results immediately
      setShowResults(true);

      // Log success for debugging
      console.log('Answer submitted successfully:', {
        submissionId,
        correct: result.correct,
        points: result.points,
        questionIndex: submissionData.questionIndex
      });

      toast?.({
        title: result.correct ? 'Correct! 🎉' : 'Incorrect',
        description: result.correct ? `+${result.points} points!` : `Correct answer: ${result.correctAnswer}`,
        variant: result.correct ? 'default' : 'destructive'
      });

    } catch (error: any) {
      console.error('Error submitting answer:', error);
      
      // Only reset states if this was a real error, not a duplicate submission
      if (!error.message?.includes('already submitted')) {
        setHasSubmitted(false);
        setIsAnswered(false);
      }

      // Handle different error types
      let errorMessage = 'Your answer may not have been recorded. Please try again.';
      if (error.name === 'AbortError') {
        errorMessage = 'Submission timed out. Please check your connection.';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error. Your answer may have been submitted.';
      }

      toast?.({
        title: 'Submission Failed',
        description: error.message || errorMessage,
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
      submissionRef.current = false;
    }
  }, [hasSubmitted, selectedAnswer, currentQuestion, submitting, roomData, roomCode, user, toast]);

  // Auto-submit when timer expires with better logic
  useEffect(() => {
    // Only auto-submit if:
    // 1. Timer has expired (timeRemaining === 0)
    // 2. User hasn't submitted yet (!hasSubmitted)
    // 3. There's a current question
    // 4. Timer was active (to prevent auto-submit on page load)
    // 5. User has selected an answer (selectedAnswer !== null)
    // 6. Not currently submitting
    if (
      timeRemaining === 0 && 
      !hasSubmitted && 
      !submitting &&
      currentQuestion && 
      timerActive && 
      selectedAnswer !== null &&
      !submissionRef.current
    ) {
      console.log('Auto-submitting answer due to timer expiry');
      handleSubmitAnswer();
    }
  }, [timeRemaining, hasSubmitted, submitting, currentQuestion, timerActive, selectedAnswer, handleSubmitAnswer]);

  const leaveRoom = async () => {
    if (leaving || !QuizArena || !user?.uid) return;

    setLeaving(true);
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
    } finally {
      setLeaving(false);
    }
  };

  if (loading || !roomData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Loading Arena...</h2>
            <p className="text-muted-foreground">
              Preparing your battleground experience...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (roomData.finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Quiz Finished!</h2>
            <p className="text-muted-foreground mb-4">
              The host has ended the quiz session.
            </p>
            <Button asChild>
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPlayerData = players.find(p => p.userId === user.uid);
  const hostData = players.find(p => p.userId === roomData.hostId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={leaveRoom}
              disabled={leaving}
              className="text-destructive hover:text-destructive/80"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {leaving ? 'Leaving...' : 'LEAVE BATTLE'}
            </Button>

            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
                PARTICIPANT
              </Badge>
              <span className="font-semibold text-white">Room {roomCode.toUpperCase()}</span>
              
              {/* Connection Status Indicators */}
              {!isOnline && (
                <Badge variant="destructive" className="animate-pulse">
                  <WifiOff className="h-3 w-3 mr-1" />
                  OFFLINE
                </Badge>
              )}
              
              {reconnecting && (
                <Badge variant="outline" className="animate-pulse">
                  🔄 RECONNECTING
                </Badge>
              )}
              
              {!hostPresent && roomData?.started && (
                <Badge variant="destructive">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  HOST AWAY
                </Badge>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-muted-foreground">Your Score</div>
            <div className="text-2xl font-bold text-cyan-400">{currentPlayerData?.score || 0}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Main Quiz Area */}
          <div className="lg:col-span-2 space-y-6">

            {/* Status Bar */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    <span className="font-semibold">{hostData?.name || 'Host'}</span>
                    {roomData.started && (
                      <Badge className="bg-green-500/10 text-green-400 animate-pulse">
                        🎮 LIVE GAME
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm">
                      {!roomData.started && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span>{roomData.started ? 'Live Battle' : 'Waiting for Host'}</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Timer - Always show when quiz started */}
                {roomData.started && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Timer className={`h-5 w-5 ${timeRemaining <= 10 ? 'text-red-500 animate-pulse' : 'text-orange-500'}`} />
                      <div className="flex-1">
                        <Progress
                          value={(timeRemaining / 30) * 100}
                          className={`h-3 transition-colors ${
                            timeRemaining <= 10 ? 'bg-red-500/20' :
                            timeRemaining <= 20 ? 'bg-yellow-500/20' : 'bg-primary/20'
                          }`}
                        />
                      </div>
                      <span className={`text-lg font-mono font-bold px-2 py-1 rounded ${
                        timeRemaining <= 5 ? 'bg-red-500 text-white animate-bounce' :
                        timeRemaining <= 10 ? 'text-red-600' :
                        timeRemaining <= 20 ? 'text-orange-500' : 'text-green-600'
                      }`}>
                        {timeRemaining}s
                      </span>
                    </div>

                    {/* Critical time warning - only if not submitted */}
                    {timeRemaining <= 10 && !hasSubmitted && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2">
                        <div className="flex items-center justify-center gap-2 text-red-600 font-semibold text-sm">
                          <AlertTriangle className="h-4 w-4 animate-pulse" />
                          Time is running out! Submit your answer soon.
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Progress */}
                {roomData.started && (
                  <div className="text-sm text-muted-foreground">
                    Question {Math.min(((roomData.currentQuestion !== undefined ? roomData.currentQuestion : 0) + 1), roomData.quiz?.length || 0)} of {roomData.quiz?.length || 0}
                  </div>
                )}
              </CardHeader>
            </Card>

            {/* Question Area */}
            <Card className="min-h-96">
              <CardContent className="p-8">
                {roomData.started ? (
                  <div>
                    {currentQuestion ? (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold mb-6">{currentQuestion.question}</h2>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                          {currentQuestion.options?.map((option: string, index: number) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrect = index === currentQuestion.correctIndex;
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
                                    ? 'border-red-500 bg-red-500/15 animate-shake'
                                    : !showResults
                                    ? 'border-muted hover:border-primary/60 hover:bg-primary/5'
                                    : 'border-muted/50 bg-muted/30'
                                }`}
                                onClick={() => {
                                  if (!hasSubmitted) {
                                    setSelectedAnswer(index);
                                    // Add click feedback
                                    const element = document.getElementById(`option-${index}`);
                                    element?.classList.add('animate-bounce');
                                    setTimeout(() => element?.classList.remove('animate-bounce'), 300);
                                  }
                                }}
                                id={`option-${index}`}
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
                                  {/* Letter Badge */}
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

                                  {/* Option Text */}
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
                                    <div className="flex items-center gap-2 ml-auto animate-fadeIn">
                                      <CheckCircle className="h-6 w-6 text-green-500 animate-bounce" />
                                      <div className="text-right">
                                        <div className="text-sm font-bold text-green-600">CORRECT!</div>
                                        <div className="text-xs text-green-500">+10 points</div>
                                      </div>
                                    </div>
                                  )}

                                  {showResults && isWrongSelection && (
                                    <div className="flex items-center gap-2 ml-auto animate-fadeIn">
                                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">✕</span>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-sm font-bold text-red-600">WRONG</div>
                                        <div className="text-xs text-red-500">0 points</div>
                                      </div>
                                    </div>
                                  )}

                                  {isSelected && !showResults && (
                                    <div className="flex items-center gap-2 ml-auto">
                                      <CheckCircle className="h-6 w-6 text-primary animate-pulse" />
                                      <span className="text-sm font-semibold text-primary">SELECTED</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Submit Button */}
                        {!hasSubmitted && selectedAnswer !== null && timeRemaining > 0 && (
                          <Button
                            onClick={handleSubmitAnswer}
                            disabled={submitting}
                            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                            size="lg"
                          >
                            {submitting ? 'SUBMITTING...' : 'SUBMIT ANSWER'}
                          </Button>
                        )}

                        {hasSubmitted && showResults && (
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              {selectedAnswer === currentQuestion.correctIndex ? (
                                <>
                                  <CheckCircle className="h-6 w-6 text-green-500" />
                                  <span className="text-green-500 font-semibold text-lg">Correct! +10 points</span>
                                </>
                              ) : (
                                <>
                                  <Timer className="h-6 w-6 text-red-500" />
                                  <span className="text-red-500 font-semibold text-lg">Times up - Wait for next question</span>
                                </>
                              )}
                            </div>
                            {selectedAnswer !== currentQuestion.correctIndex && (
                              <p className="text-muted-foreground">
                                Correct answer: {currentQuestion.options[currentQuestion.correctIndex]}
                              </p>
                            )}
                          </div>
                        )}

                        {hasSubmitted && !showResults && (
                          <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <span className="text-yellow-600 font-semibold">Answer submitted - Wait for results...</span>
                          </div>
                        )}

                        {timeRemaining === 0 && !hasSubmitted && (
                          <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <span className="text-red-500 font-semibold">Time's up! Auto-submitting...</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Waiting for Question...</h3>
                        <p className="text-muted-foreground">
                          The host will start the quiz soon. Get ready!
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Waiting Room</h3>
                    <p className="text-muted-foreground mb-4">
                      Waiting for the host to start the quiz. Good luck, champion!
                    </p>
                    <Badge className="bg-blue-500/10 text-blue-400">
                      Host will begin soon
                    </Badge>
                    
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          console.log('Manual refresh requested');
                          window.location.reload();
                        }}
                      >
                        🔄 Refresh Status
                      </Button>
                    </div>

                    {/* Real-time Game Debug Panel */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="mt-4 p-3 bg-gray-900 border border-green-500 rounded text-xs text-left text-green-400">
                        <strong>🎮 REAL-TIME GAME STATUS:</strong><br/>
                        Database Connected: {isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}<br/>
                        Quiz Started: {roomData?.started ? '🟢 LIVE' : '🟡 WAITING'}<br/>
                        Current Question: {roomData?.currentQuestion !== undefined ? `${roomData.currentQuestion + 1}/${roomData?.quiz?.length || 0}` : 'None'}<br/>
                        Questions in DB: {roomData?.quiz?.length || 0}<br/>
                        Question Loaded: {currentQuestion ? '🟢 YES' : '🔴 NO'}<br/>
                        Players Online: {players.length}<br/>
                        Your Score: {players.find(p => p.userId === user?.uid)?.score || 0}
                      </div>
                    )}
                    
                    {/* Debug info - remove in production */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-left">
                        <strong>Debug Info:</strong><br/>
                        Room Started: {roomData?.started ? 'Yes' : 'No'}<br/>
                        Current Question: {roomData?.currentQuestion ?? 'None'}<br/>
                        Quiz Length: {roomData?.quiz?.length || 0}<br/>
                        Has Current Question: {currentQuestion ? 'Yes' : 'No'}<br/>
                        <button 
                          onClick={() => window.location.reload()} 
                          className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
                        >
                          Force Refresh
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {players.slice(0, 10).map((player, index) => (
                    <div key={player.userId} className={`flex items-center justify-between p-3 rounded-lg ${
                      player.userId === user.uid ? 'bg-primary/10 border border-primary/20' : 'bg-muted/20'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-600' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index < 9 ? `#${index + 1}` : '...'}
                        </div>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          {player.userId === user.uid && (
                            <span className="text-xs text-primary">(You)</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{player.score}</div>
                        <div className="text-xs text-muted-foreground">pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Room Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Room Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Players</span>
                  <span className="font-bold">{players.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Questions</span>
                  <span className="font-bold">{roomData.quiz?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Rank</span>
                  <span className="font-bold">#{players.findIndex(p => p.userId === user.uid) + 1}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ParticipantArenaPage() {
  return (
    <ErrorBoundary>
      <ParticipantArenaPageContent />
    </ErrorBoundary>
  );
}
