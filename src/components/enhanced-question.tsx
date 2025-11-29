'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RichTextRenderer, ChemistryEquation, PhysicsFormula, MathExpression } from '@/components/latex-renderer';
import { cn } from '@/lib/utils';

interface EnhancedQuestionProps {
  question: {
    id: string;
    text: string;
    options?: string[];
    correctAnswer?: string | number;
    explanation?: string;
    type: 'multiple-choice' | 'descriptive' | 'true-false';
    subject?: string;
    difficulty?: string;
    hasLatex?: boolean;
  };
  showAnswer?: boolean;
  selectedAnswer?: string | number;
  onAnswerSelect?: (answer: string | number) => void;
  className?: string;
}

export function EnhancedQuestion({
  question,
  showAnswer = false,
  selectedAnswer,
  onAnswerSelect,
  className
}: EnhancedQuestionProps) {
  const isCorrect = selectedAnswer === question.correctAnswer;
  const isAnswered = selectedAnswer !== undefined;

  return (
    <Card className={cn('transition-all', className)}>
      <CardContent className="p-6 space-y-4">
        {/* Question Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {question.subject && (
                <Badge variant="secondary">{question.subject}</Badge>
              )}
              {question.difficulty && (
                <Badge variant="outline">{question.difficulty}</Badge>
              )}
              {question.hasLatex && (
                <Badge variant="default" className="bg-purple-600">
                  LaTeX
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Question Text with LaTeX Support */}
        <div className="text-lg font-medium leading-relaxed">
          <RichTextRenderer content={question.text} />
        </div>

        {/* Options for Multiple Choice */}
        {question.type === 'multiple-choice' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = selectedAnswer === index;
              const isCorrectOption = question.correctAnswer === index;
              
              let optionStyle = 'border-2 hover:border-primary cursor-pointer';
              
              if (showAnswer) {
                if (isCorrectOption) {
                  optionStyle = 'border-2 border-green-500 bg-green-50 dark:bg-green-950';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'border-2 border-red-500 bg-red-50 dark:bg-red-950';
                }
              } else if (isSelected) {
                optionStyle = 'border-2 border-primary bg-primary/10';
              }

              return (
                <div
                  key={index}
                  className={cn(
                    'p-4 rounded-lg transition-all',
                    optionStyle,
                    !showAnswer && 'hover:shadow-md'
                  )}
                  onClick={() => !showAnswer && onAnswerSelect?.(index)}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-primary min-w-[24px]">
                      {optionLetter}.
                    </span>
                    <div className="flex-1">
                      <RichTextRenderer content={option} />
                    </div>
                    {showAnswer && isCorrectOption && (
                      <Badge className="bg-green-600">Correct</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Answer and Explanation */}
        {showAnswer && question.explanation && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
              Explanation:
            </h4>
            <div className="text-blue-800 dark:text-blue-200">
              <RichTextRenderer content={question.explanation} />
            </div>
          </div>
        )}

        {/* Result Badge */}
        {showAnswer && isAnswered && (
          <div className="flex items-center justify-center">
            <Badge
              variant={isCorrect ? 'default' : 'destructive'}
              className={cn(
                'text-lg py-2 px-4',
                isCorrect && 'bg-green-600'
              )}
            >
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Preview component for quiz generation
export function QuestionPreview({ question }: { question: any }) {
  return (
    <div className="space-y-2">
      <RichTextRenderer content={question.text} className="font-medium" />
      {question.options && (
        <div className="pl-4 space-y-1 text-sm">
          {question.options.map((opt: string, i: number) => (
            <div key={i}>
              <span className="font-semibold">{String.fromCharCode(65 + i)}.</span>{' '}
              <RichTextRenderer content={opt} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
