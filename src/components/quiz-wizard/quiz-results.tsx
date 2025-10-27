"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download } from "lucide-react";
import { Redo } from "lucide-react";
import { RefreshCw } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Brain } from "lucide-react";
import { Lightbulb } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import RichContentRenderer from "@/components/rich-content-renderer";
import { PageHeader } from "@/components/page-header";
import { BookmarkButton } from "@/components/bookmark-button";
import Link from "next/link";

export type QuizResult = {
  score: number;
  percentage: number;
  totalScorable: number;
  questions: any[];
  formValues: any;
  userAnswers: any[];
};

// Temporary implementation - will be replaced in the actual component
export default function QuizResults({
  quiz,
  userAnswers,
  formValues,
  calculateScore,
  getExplanation,
  getSimpleExplanation,
  handleGenerateFlashcards,
  resetQuiz,
  retryIncorrect,
  downloadQuestions,
  downloadResultCard,
  timeLeft = 0,
  isGeneratingFlashcards = false
}: any) {
  if (!quiz || !userAnswers || !formValues) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60svh] text-center p-4">
        <div className="relative">
          <div className="h-12 w-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground mt-4">Loading results...</p>
      </div>
    );
  }

  const { score, percentage, totalScorable } = calculateScore();
  const incorrectAnswers = quiz.filter((q: any, i: number) => q.correctAnswer !== userAnswers[i] && q.type !== 'descriptive');

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Quiz Results" description={`You scored ${score} out of ${totalScorable}.`} />
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Result Details</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={downloadQuestions}>
                <Download className="mr-2 h-4 w-4" /> Questions
              </Button>
              <Button onClick={downloadResultCard}>
                <Download className="mr-2 h-4 w-4" /> Result Card
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
            <Card className="p-4 bg-muted/50">
              <CardTitle className="text-3xl font-bold">{score}/{totalScorable}</CardTitle>
              <CardDescription>Score</CardDescription>
            </Card>
            <Card className="p-4 bg-muted/50">
              <CardTitle className="text-3xl font-bold">{percentage.toFixed(0)}%</CardTitle>
              <CardDescription>Percentage</CardDescription>
            </Card>
            <Card className={cn(
              "p-4 bg-muted/50",
              percentage >= 50 ? "border-primary/20 bg-primary/5" : "border-destructive/20 bg-destructive/5"
            )}>
              <CardTitle className={cn(
                "text-3xl font-bold",
                percentage >= 50 ? "text-primary" : "text-destructive"
              )}>
                {percentage >= 50 ? 'Pass' : 'Fail'}
              </CardTitle>
              <CardDescription>Status</CardDescription>
            </Card>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Review Your Answers</h3>
            <div className="space-y-4">
              {quiz.map((q: any, index: number) => {
                const isCorrect = q.correctAnswer === userAnswers[index];

                return (
                  <Card key={index} className={cn(
                    "bg-muted/30",
                    isCorrect ? "border-primary/20" : "border-destructive/20"
                  )}>
                    <CardHeader className="flex flex-row justify-between items-start pb-2">
                      <div className="font-semibold flex-1 pr-4">
                        <RichContentRenderer content={`${index + 1}. ${q.question}`} smiles={q.smiles} />
                      </div>
                      {q.correctAnswer && (
                        <BookmarkButton 
                          quiz={{
                            id: `${formValues?.topic || 'quiz'}-${index}`,
                            title: q.question.substring(0, 50) + '...',
                            subject: formValues?.topic || 'General',
                            difficulty: formValues?.difficulty || 'medium',
                            questionCount: 1,
                            tags: [formValues?.topic || 'quiz']
                          }}
                          variant="ghost"
                          size="icon"
                        />
                      )}
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-2">
                      <div className="text-sm mt-2 space-y-1">
                        <p className={cn("flex items-start gap-2", isCorrect ? 'text-primary' : 'text-destructive')}>
                          {isCorrect ? '✓' : '✗'} Your answer: <RichContentRenderer content={userAnswers[index] || "Skipped"} />
                        </p>
                        {!isCorrect && q.correctAnswer && (
                          <p className="text-primary flex items-start gap-2">
                            Correct answer: <RichContentRenderer content={q.correctAnswer} />
                          </p>
                        )}
                      </div>

                      {!isCorrect && q.type !== 'descriptive' && (
                        <div className="mt-4 space-y-2">
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => getExplanation(index)}>
                              <Brain className="mr-1 h-3 w-3" /> Explanation
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => getSimpleExplanation(index)}>
                              <Lightbulb className="mr-1 h-3 w-3" /> Explain Simply
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-center gap-2 pt-4 border-t">
          <Button onClick={resetQuiz}>
            <Redo className="mr-2 h-4 w-4" /> Take Another Quiz
          </Button>
          {incorrectAnswers.length > 0 && (
            <Button onClick={retryIncorrect} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Retry Incorrect
            </Button>
          )}
          {incorrectAnswers.length > 0 && (
            <Button onClick={handleGenerateFlashcards} variant="outline" disabled={isGeneratingFlashcards}>
              {isGeneratingFlashcards ? "..." : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Flashcards
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/">
              <LayoutDashboard className="mr-2 h-4 w-4"/> Back to Dashboard
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
