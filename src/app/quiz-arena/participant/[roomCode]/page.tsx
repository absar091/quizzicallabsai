'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Users, Crown, Timer, ArrowLeft, CheckCircle, Trophy, LogOut, AlertTriangle } from 'lucide-react';
import { QuizArena, ArenaPlayer } from '@/lib/quiz-arena';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function ParticipantArenaPage() {
  const { roomCode } = useParams() as { roomCode: string };
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [roomData, setRoomData] = useState<any>(null);
  const [players, setPlayers] = useState<ArenaPlayer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    if (!roomCode || !user) {
      router.push(`/quiz-arena/join/${roomCode}`);
      return;
    }

    const initializeParticipant = async () => {
      try {
        // Validate room and user access
        const isValid = await QuizArena.Discovery.validateRoom(roomCode.toUpperCase());
        if (!isValid) {
          toast?.({
            title: 'Room Not Found',
            description: 'The room has expired or been deleted.',
            variant: 'destructive'
          });
          router.push('/dashboard');
          return;
        }

        // Listen to room state changes
        const unsubscribeRoom = QuizArena.Player.listenToRoom(
          roomCode.toUpperCase(),
          async (data) => {
            setRoomData(data);

            if (data.finished) {
              toast?.({
                title: 'Quiz Finished!',
                description: 'The host ended the quiz.',
              });
              router.push('/dashboard');
              return;
            }

            if (data.quiz?.length > 0) {
              const questionIndex = data.currentQuestion || 0;
              if (questionIndex >= 0 && questionIndex < data.quiz.length) {
                setCurrentQuestion(data.quiz[questionIndex]);
                setTimeRemaining(30); // Reset timer for new question
                setHasSubmitted(false);
                setSelectedAnswer(null);
                setShowResults(false);
                setIsAnswered(false);
              }
            }
          }
        );

        // Listen to leaderboard changes
        const unsubscribePlayers = QuizArena.Player.listenToLeaderboard(
          roomCode.toUpperCase(),
          (playerList) => {
            setPlayers(playerList);
          }
        );

        setLoading(false);

        return () => {
          unsubscribeRoom();
          unsubscribePlayers();
        };

      } catch (error) {
        console.error('Error initializing participant');
        toast?.({
          title: 'Connection Failed',
          description: 'Unable to join the room. Please try again.',
          variant: 'destructive'
        });
        router.push(`/quiz-arena/join/${roomCode}`);
      }
    };

    initializeParticipant();
  }, [roomCode, user, router]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !hasSubmitted) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !hasSubmitted && currentQuestion) {
      // Auto-submit when time runs out
      handleSubmitAnswer();
    }
  }, [timeRemaining, hasSubmitted, currentQuestion]);

  const handleSubmitAnswer = async () => {
    if (hasSubmitted || !selectedAnswer || !currentQuestion) return;

    setHasSubmitted(true);
    setIsAnswered(true);

    try {
      // Server-side answer submission with authentication
      const idToken = await user.getIdToken();
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
      
      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      // Show results immediately
      setShowResults(true);
      
      toast?.({
        title: result.correct ? 'Correct! 🎉' : 'Incorrect',
        description: result.correct ? `+${result.points} points!` : `Correct answer: ${result.correctAnswer}`,
        variant: result.correct ? 'default' : 'destructive'
      });

    } catch (error: any) {
      console.error('Error submitting answer');
      setHasSubmitted(false); // Allow retry on error
      setIsAnswered(false);

      toast?.({
        title: 'Submission Failed',
        description: error.message || 'Your answer may not have been recorded. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const leaveRoom = async () => {
    if (leaving) return;

    setLeaving(true);
    try {
      await QuizArena.Player.leaveRoom(roomCode.toUpperCase(), user.uid);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error leaving room');
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
                      <Badge className="bg-green-500/10 text-green-400">
                        QUIZ IN PROGRESS
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

                {/* Enhanced Timer */}
                {roomData.started && !hasSubmitted && (
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

                    {/* Critical time warning */}
                    {timeRemaining <= 10 && (
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
                    Question {Math.min((roomData.currentQuestion || 0) + 1, roomData.quiz?.length || 0)} of {roomData.quiz?.length || 0}
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
                            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                            size="lg"
                          >
                            SUBMIT ANSWER
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
