'use client';

import { useFormContext } from 'react-hook-form';
import { Eye, CheckCircle, AlertTriangle, Clock, Target, FileText, Brain, Sparkles } from 'lucide-react';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { cn } from '@/lib/utils';

export function ReviewStep() {
  const { watch } = useFormContext();
  const formData = watch();

  const {
    topic,
    difficulty,
    numberOfQuestions,
    questionTypes,
    questionStyles,
    timeLimit,
    specificInstructions
  } = formData;

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'hard': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'master': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const estimatedTime = Math.round(numberOfQuestions * (timeLimit / numberOfQuestions));
  const questionsPerMinute = Math.round(numberOfQuestions / timeLimit);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Eye className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Review Your Quiz Settings</h3>
        <p className="text-muted-foreground">
          Please review your selections before generating the quiz
        </p>
      </div>

      {/* Quiz Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Topic */}
        <EnhancedCard className="relative overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold">Topic</h4>
            </div>
            <p className="text-lg font-medium text-primary">{topic || 'Not selected'}</p>
            <div className="absolute top-4 right-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </EnhancedCard>

        {/* Difficulty */}
        <EnhancedCard className="relative overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold">Difficulty</h4>
            </div>
            <div className={cn(
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
              getDifficultyColor(difficulty)
            )}>
              {difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : 'Not selected'}
            </div>
            <div className="absolute top-4 right-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </EnhancedCard>

        {/* Time Limit */}
        <EnhancedCard className="relative overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold">Time Limit</h4>
            </div>
            <p className="text-lg font-medium text-primary">{timeLimit} minutes</p>
            <div className="absolute top-4 right-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </EnhancedCard>
      </div>

      {/* Detailed Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Question Configuration */}
        <EnhancedCard>
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold">Question Configuration</h4>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Question Types</p>
                <div className="flex flex-wrap gap-2">
                  {questionTypes?.length > 0 ? (
                    questionTypes.map((type: string) => (
                      <span
                        key={type}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                      >
                        {type}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">None selected</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Question Styles</p>
                <div className="flex flex-wrap gap-2">
                  {questionStyles?.length > 0 ? (
                    questionStyles.map((style: string) => (
                      <span
                        key={style}
                        className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full"
                      >
                        {style}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">None selected</span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Questions:</span>
                  <span className="font-semibold text-primary">{numberOfQuestions}</span>
                </div>
              </div>
            </div>
          </div>
        </EnhancedCard>

        {/* Quiz Statistics */}
        <EnhancedCard>
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold">Quiz Statistics</h4>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Questions per minute:</span>
                <span className="font-medium">{questionsPerMinute}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Estimated completion:</span>
                <span className="font-medium">{estimatedTime} minutes</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Question types:</span>
                <span className="font-medium">{questionTypes?.length || 0}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Question styles:</span>
                <span className="font-medium">{questionStyles?.length || 0}</span>
              </div>
            </div>
          </div>
        </EnhancedCard>
      </div>

      {/* Special Instructions */}
      {specificInstructions && (
        <EnhancedCard variant="glass" className="border-accent/20 bg-accent/5">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-accent" />
              </div>
              <h4 className="font-semibold text-accent">Special Instructions</h4>
            </div>
            <p className="text-sm text-muted-foreground bg-white/50 rounded p-3">
              {specificInstructions}
            </p>
          </div>
        </EnhancedCard>
      )}

      {/* Validation Summary */}
      <EnhancedCard variant="glass" className="border-primary/20 bg-primary/5">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-semibold text-primary">Ready to Generate</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">
                {topic ? '✓' : '✗'}
              </div>
              <div className="text-sm text-muted-foreground">Topic Selected</div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">
                {difficulty ? '✓' : '✗'}
              </div>
              <div className="text-sm text-muted-foreground">Difficulty Set</div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">
                {questionTypes?.length > 0 ? '✓' : '✗'}
              </div>
              <div className="text-sm text-muted-foreground">Question Types</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white/50 rounded-lg">
            <p className="text-sm text-center text-muted-foreground">
              Your quiz is ready to be generated with {numberOfQuestions} questions
              in {timeLimit} minutes. Click "Generate Quiz" to proceed.
            </p>
          </div>
        </div>
      </EnhancedCard>
    </div>
  );
}
