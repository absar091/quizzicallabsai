'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Users, Eye, Loader2, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { SharedQuiz, SharedQuizMetadata, QuizSharingManager } from '@/lib/quiz-sharing';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function SharedQuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizMetadata, setQuizMetadata] = useState<SharedQuizMetadata | null>(null);
  const [fullQuiz, setFullQuiz] = useState<SharedQuiz | null>(null);

  const shareCode = searchParams.get('code');

  useEffect(() => {
    if (!shareCode) {
      setError('No share code provided');
      setLoading(false);
      return;
    }

    const handleSharedQuizAccess = async () => {
      try {
        // Always get quiz metadata first for public display
        const metadata = await QuizSharingManager.getQuizMetadataByShareCode(shareCode.toUpperCase());

        if (!metadata) {
          setError('Quiz not found. Please check the share code and try again.');
          setLoading(false);
          return;
        }

        setQuizMetadata(metadata);

        // If user is authenticated, get full quiz data
        if (user) {
          const fullQuizData = await QuizSharingManager.getQuizByShareCode(shareCode.toUpperCase());
          if (fullQuizData) {
            setFullQuiz(fullQuizData);

            // Update quiz stats (attempts counter)
            try {
              await QuizSharingManager.updateQuizStats(fullQuizData.id, 0);
            } catch (statError) {
              // Silently handle stat update errors
              console.error('Failed to update quiz stats:', statError);
            }

            // Prepare quiz data for generate-quiz page
            const quizData = {
              quiz: fullQuizData.questions,
              formValues: {
                topic: fullQuizData.title,
                difficulty: (fullQuizData.difficulty as any) || 'medium',
                numberOfQuestions: fullQuizData.questions.length,
                questionTypes: ['Multiple Choice'],
                questionStyles: ['Shared Quiz'],
                timeLimit: Math.max(10, Math.ceil(fullQuizData.questions.length * 0.75)), // 3/4 minute per question
                specificInstructions: fullQuizData.description || ''
              }
            };

            // Store in sessionStorage for the generate-quiz page to pick up
            sessionStorage.setItem('sharedQuizData', JSON.stringify(quizData));

            // Automatically redirect to generate-quiz page after showing success
            setTimeout(() => {
              router.push('/generate-quiz?shared=true');
            }, 2000);
          }
        }

      } catch (err: any) {
        console.error('Error accessing shared quiz:', err);
        let errorMessage = 'Failed to load quiz. Please try again later.';

        if (err.message?.includes('permission-denied')) {
          errorMessage = 'This quiz may have been deleted or is no longer available.';
        } else if (err.message?.includes('not-found')) {
          errorMessage = 'Quiz not found. The share link may be invalid.';
        } else if (err.message?.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    handleSharedQuizAccess();
  }, [shareCode, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Loading Shared Quiz...</h2>
            <p className="text-muted-foreground">
              Please wait while we prepare your shared quiz experience.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-destructive/20 to-destructive/10">
        <Card className="max-w-md mx-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Quiz Not Found</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/">Go Home</Link>
              </Button>
              <Button asChild>
                <Link href="/">Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizMetadata) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20">
        <Card className="max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {user && fullQuiz ? (
                <CheckCircle className="h-12 w-12 text-green-500" />
              ) : (
                <Lock className="h-12 w-12 text-primary" />
              )}
            </div>
            <CardTitle className="text-xl mb-2">
              {user && fullQuiz ? "Quiz Ready!" : "Quiz Preview"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{quizMetadata.title}</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Created by:</strong> {quizMetadata.creatorName}</p>
                <p><strong>Topic:</strong> {quizMetadata.topic}</p>
                <p><strong>Difficulty:</strong> <Badge variant="secondary">{quizMetadata.difficulty}</Badge></p>
                <p><strong>Questions:</strong> {fullQuiz ? fullQuiz.questions.length : "Multiple"}</p>
                {fullQuiz && fullQuiz.description && (
                  <p><strong>Description:</strong> {fullQuiz.description}</p>
                )}

                {!fullQuiz && (
                  <div className="bg-primary/5 p-3 rounded-lg border border-primary/20 mt-3">
                    <p className="text-sm text-primary flex items-center gap-2 font-medium">
                      <Lock className="h-4 w-4" />
                      Sign in to view full quiz details and play
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-center gap-6 pt-3 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{quizMetadata.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{quizMetadata.attempts}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {user
                  ? fullQuiz
                    ? "Redirecting you to the quiz..."
                    : "Loading quiz content..."
                  : "Sign in to access this quiz and track your progress!"
                }
              </p>

              {!user && shareCode && (
                <div className="flex gap-2 justify-center mb-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/login?redirect=${encodeURIComponent(`/shared-quiz?code=${shareCode.toUpperCase()}`)}`}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/signup?redirect=${encodeURIComponent(`/shared-quiz?code=${shareCode.toUpperCase()}`)}`}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                This quiz requires an account to play and track your performance history.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
