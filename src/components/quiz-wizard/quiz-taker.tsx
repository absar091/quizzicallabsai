"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import RichContentRenderer from "@/components/rich-content-renderer";

export type Question = {
  question: string;
  answers?: string[];
  correctAnswer?: string;
  type: 'multiple-choice' | 'descriptive';
  smiles?: string;
};

interface QuizTakerProps {
  quiz: Question[];
  currentQuestion: number;
  userAnswers: (string | null)[];
  timeLeft: number;
  comprehensionText?: string;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function QuizTaker({
  quiz,
  currentQuestion,
  userAnswers,
  timeLeft,
  comprehensionText,
  onAnswer,
  onNext,
  onBack,
  onSubmit
}: QuizTakerProps) {
  const currentQ = quiz[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.length) * 100;

  if (!currentQ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60svh] text-center p-4">
        <div className="h-12 w-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground mt-4">Loading question...</p>
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="flex flex-col">
      {/* Header with progress and timer */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">
          Question {currentQuestion + 1} of {quiz.length}
        </p>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

      <Progress value={progress} className="h-2 w-full mb-6" />

      {/* Comprehension passage if available */}
      {comprehensionText && (
        <Card className="w-full max-w-4xl mx-auto mb-8 bg-muted/50">
          <CardContent className="prose prose-sm dark:prose-invert max-h-48 overflow-y-auto p-6">
            <h3 className="font-semibold mb-4">Reading Passage</h3>
            <RichContentRenderer content={comprehensionText} />
          </CardContent>
        </Card>
      )}

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <div className="space-y-6">
            <div className="text-center text-xl sm:text-2xl font-semibold leading-relaxed min-h-[6rem]">
              <RichContentRenderer content={currentQ.question} smiles={currentQ.smiles} />
            </div>

            {/* Answer options */}
            {currentQ.type === 'descriptive' ? (
              <div className="w-full max-w-2xl mx-auto">
                <textarea
                  value={userAnswers[currentQuestion] || ""}
                  onChange={(e) => onAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={6}
                  className="w-full p-4 text-base border border-input rounded-lg bg-background resize-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            ) : (
              <div className="w-full max-w-2xl mx-auto">
                <div className="grid gap-3">
                  {currentQ.answers?.map((answer, index) => {
                    const isSelected = userAnswers[currentQuestion] === answer;
                    return (
                      <Button
                        key={index}
                        onClick={() => onAnswer(answer)}
                        variant="outline"
                        className={cn(
                          "text-left p-4 h-auto justify-start whitespace-normal",
                          isSelected && "border-primary bg-primary/5"
                        )}
                      >
                        <span className="font-medium mr-3 text-primary">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <RichContentRenderer content={answer} />
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="mt-8 flex justify-between w-full">
        <Button onClick={onBack} size="lg" variant="outline" disabled={currentQuestion === 0}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <Button
          onClick={currentQuestion === quiz.length - 1 ? onSubmit : onNext}
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {currentQuestion === quiz.length - 1 ? "Submit Quiz" : "Next Question"}
          {currentQuestion !== quiz.length - 1 && <ArrowRight className="ml-2 h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
