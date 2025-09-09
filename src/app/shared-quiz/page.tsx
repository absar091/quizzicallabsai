'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Users, Eye, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { SharedQuiz, QuizSharingManager } from '@/lib/quiz-sharing';
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
  const [sharedQuiz, setSharedQuiz] = useState<SharedQuiz | null>(null);

  const shareCode = searchParams.get('code');

  useEffect(() => {
    const handleSharedQuizAccess = async () => {
      if (!shareCode) {
        setError('No share code provided');
        setLoading(false);
        return;
      }

      try {
        // Try to get quiz by share code
        const quiz = await QuizSharingManager.getQuizByShareCode(shareCode.toUpperCase());

        if (!quiz) {
          setError('Quiz not found. Please check the share code and try again.');
          setLoading(false);
          return;
        }

        setSharedQuiz(quiz);

        // Update quiz stats (attempts counter)
        try {
          await QuizSharingManager.updateQuizStats(quiz.id, 0);
        } catch (statError) {
          // Silently handle stat update errors
          console.error('Failed to update quiz stats:', statError);
        }

        // Prepare quiz data for generate-quiz page
        const quizData = {
          quiz: quiz.questions,
          formValues: {
            topic: quiz.title,
            difficulty: (quiz.difficulty as any) || 'medium',
            numberOfQuestions: quiz.questions.length,
            questionTypes: ['Multiple Choice'],
            questionStyles: ['Shared Quiz'],
            timeLimit: Math.max(10, Math.ceil(quiz.questions.length * 0.75)), // 3/4 minute per question
            specificInstructions: quiz.description || ''
          }
        };

        // Store in sessionStorage for the generate-quiz page to pick up
        sessionStorage.setItem('sharedQuizData', JSON.stringify(quizData));

        // Automatically redirect to generate-quiz page after a short delay for user feedback
        setTimeout(() => {
          // For authenticated users, redirect to protected route
          if (user) {
            router.push('/generate-quiz?shared=true');
          } else {
            // For non-authenticated users, redirect to login flow
            router.push(`/login?redirect=/generate-quiz?shared=true&message=${encodeURIComponent('Welcome! Please sign in to access the shared quiz.')}`);
          }
        }, 2000); // 2 second delay to show the user what quiz they're getting

      } catch (err) {
        console.error('Error accessing shared quiz:', err);
        setError('Failed to load quiz. Please try again later.');
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
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sharedQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20">
        <Card className="max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-xl mb-2">Quiz Found!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{sharedQuiz.title}</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Created by:</strong> {sharedQuiz.creatorName}</p>
                <p><strong>Topic:</strong> {sharedQuiz.topic}</p>
                <p><strong>Difficulty:</strong> <Badge variant="secondary">{sharedQuiz.difficulty}</Badge></p>
                <p><strong>Questions:</strong> {sharedQuiz.questions.length}</p>
                {sharedQuiz.description && (
                  <p><strong>Description:</strong> {sharedQuiz.description}</p>
                )}

                <div className="flex items-center justify-center gap-6 pt-3 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{sharedQuiz.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{sharedQuiz.attempts}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {user
                  ? "Redirecting you to the quiz..."
                  : "You'll need to sign in to access this quiz. Don't worry, it's quick and easy!"
                }
              </p>

              {!user && (
                <div className="flex gap-2 justify-center mb-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/login?redirect=/generate-quiz?shared=true&message=${encodeURIComponent('Please sign in to access the shared quiz.')}`}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/signup?redirect=/generate-quiz?shared=true&message=${encodeURIComponent('Create your account to access the shared quiz!')}`}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
