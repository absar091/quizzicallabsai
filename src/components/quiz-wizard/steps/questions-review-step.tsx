'use client';

import { useFormContext } from 'react-hook-form';
import { Eye, CheckCircle, FileText, Brain, Settings, Sparkles } from 'lucide-react';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { cn } from '@/lib/utils';

export function QuestionsReviewStep() {
  const { watch } = useFormContext();
  const formData = watch();

  const {
    topic,
    difficulty,
    numberOfQuestions
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Eye className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Review Your Settings</h3>
        <p className="text-muted-foreground">
          Please review your practice questions configuration
        </p>
      </div>

      {/* Settings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <Brain className="w-5 h-5 text-primary" />
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

        {/* Question Count */}
        <EnhancedCard className="relative overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold">Questions</h4>
            </div>
            <p className="text-lg font-medium text-primary">{numberOfQuestions}</p>
            <div className="absolute top-4 right-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </EnhancedCard>
      </div>

      {/* What You'll Get */}
      <EnhancedCard>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-semibold">What You'll Get</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h5 className="font-medium text-primary">Question Features:</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Multiple choice questions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Correct answers provided</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Detailed explanations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>PDF download option</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-medium text-primary">Difficulty Level:</h5>
              <div className="text-sm text-muted-foreground">
                {difficulty === 'easy' && 'Perfect for beginners and quick reviews'}
                {difficulty === 'medium' && 'Balanced challenge for regular practice'}
                {difficulty === 'hard' && 'Advanced questions for exam preparation'}
                {difficulty === 'master' && 'Expert-level questions for mastery'}
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Questions:</span>
                  <span className="font-medium text-primary">{numberOfQuestions}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </EnhancedCard>

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
                {numberOfQuestions > 0 ? '✓' : '✗'}
              </div>
              <div className="text-sm text-muted-foreground">Questions Configured</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white/50 rounded-lg">
            <p className="text-sm text-center text-muted-foreground">
              Your practice questions are ready to be generated.
              Click "Generate Questions" to proceed.
            </p>
          </div>
        </div>
      </EnhancedCard>
    </div>
  );
}
