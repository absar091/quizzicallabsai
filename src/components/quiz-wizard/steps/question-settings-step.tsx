'use client';

import { useFormContext } from 'react-hook-form';
import { Puzzle, FileText, Brain, Lightbulb, BarChart, MessageSquareQuote, BookCopy, Settings } from 'lucide-react';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { EnhancedProgress } from '@/components/ui/enhanced-progress';
import { cn } from '@/lib/utils';

const questionTypeOptions = [
  {
    id: 'Multiple Choice',
    label: 'Multiple Choice',
    description: 'Traditional A, B, C, D format',
    icon: Puzzle,
    recommended: true
  },
  {
    id: 'Descriptive',
    label: 'Short/Long Answer',
    description: 'Open-ended written responses',
    icon: FileText,
    recommended: false
  }
];

const questionStyleOptions = [
  {
    id: 'Knowledge-based',
    label: 'Knowledge-based',
    description: 'Recall and recognition of facts',
    icon: Brain,
    category: 'Basic'
  },
  {
    id: 'Conceptual',
    label: 'Conceptual',
    description: 'Understanding core principles',
    icon: Lightbulb,
    category: 'Basic'
  },
  {
    id: 'Numerical',
    label: 'Numerical',
    description: 'Mathematical calculations and problems',
    icon: BarChart,
    category: 'Applied'
  },
  {
    id: 'Past Paper Style',
    label: 'Past Paper Style',
    description: 'Real exam question patterns',
    icon: BookCopy,
    category: 'Advanced'
  },
  {
    id: 'Comprehension-based MCQs',
    label: 'Comprehension-based',
    description: 'Reading passage with related questions',
    icon: MessageSquareQuote,
    category: 'Advanced'
  }
];

export function QuestionSettingsStep() {
  const { setValue, watch } = useFormContext();
  const selectedTypes = watch('questionTypes') || [];
  const selectedStyles = watch('questionStyles') || [];
  const numberOfQuestions = watch('numberOfQuestions') || 10;
  const timeLimit = watch('timeLimit') || 10;

  const handleTypeToggle = (typeId: string) => {
    const newTypes = selectedTypes.includes(typeId)
      ? selectedTypes.filter(t => t !== typeId)
      : [...selectedTypes, typeId];
    setValue('questionTypes', newTypes, { shouldValidate: true });
  };

  const handleStyleToggle = (styleId: string) => {
    const newStyles = selectedStyles.includes(styleId)
      ? selectedStyles.filter(s => s !== styleId)
      : [...selectedStyles, styleId];
    setValue('questionStyles', newStyles, { shouldValidate: true });
  };

  const estimatedTime = numberOfQuestions * (timeLimit / numberOfQuestions);
  const questionsPerMinute = Math.round(numberOfQuestions / timeLimit);

  return (
    <div className="space-y-8">
      {/* Question Types */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Question Types</h3>
          <p className="text-muted-foreground text-sm">
            Choose the format of questions for your quiz
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questionTypeOptions.map((type) => {
            const TypeIcon = type.icon;
            const isSelected = selectedTypes.includes(type.id);

            return (
              <EnhancedCard
                key={type.id}
                className={cn(
                  'cursor-pointer transition-all duration-300 hover:scale-105',
                  isSelected && 'ring-2 ring-primary shadow-lg'
                )}
                onClick={() => handleTypeToggle(type.id)}
              >
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={cn(
                      'p-2 rounded-lg',
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{type.label}</h4>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                    {type.recommended && (
                      <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                </div>
              </EnhancedCard>
            );
          })}
        </div>
      </div>

      {/* Question Styles */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Question Styles</h3>
          <p className="text-muted-foreground text-sm">
            Select the cognitive level and approach for your questions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {questionStyleOptions.map((style) => {
            const StyleIcon = style.icon;
            const isSelected = selectedStyles.includes(style.id);

            return (
              <EnhancedCard
                key={style.id}
                className={cn(
                  'cursor-pointer transition-all duration-300 hover:scale-105',
                  isSelected && 'ring-2 ring-primary shadow-lg'
                )}
                onClick={() => handleStyleToggle(style.id)}
              >
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={cn(
                      'p-2 rounded-lg',
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}>
                      <StyleIcon className="w-4 h-4" />
                    </div>
                    <h4 className="font-medium text-sm">{style.label}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{style.description}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded">
                    {style.category}
                  </span>
                </div>
              </EnhancedCard>
            );
          })}
        </div>
      </div>

      {/* Quiz Configuration */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Quiz Configuration</h3>
          <p className="text-muted-foreground text-sm">
            Fine-tune the number of questions and time limit
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Number of Questions */}
          <EnhancedCard>
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Settings className="w-5 h-5 text-primary" />
                <h4 className="font-medium">Number of Questions</h4>
              </div>

              <div className="space-y-4">
                <input
                  type="range"
                  min="1"
                  max="55"
                  value={numberOfQuestions}
                  onChange={(e) => setValue('numberOfQuestions', parseInt(e.target.value), { shouldValidate: true })}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1</span>
                  <span className="font-medium text-primary text-lg">{numberOfQuestions}</span>
                  <span>55</span>
                </div>
              </div>
            </div>
          </EnhancedCard>

          {/* Time Limit */}
          <EnhancedCard>
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Settings className="w-5 h-5 text-primary" />
                <h4 className="font-medium">Time Limit (Minutes)</h4>
              </div>

              <div className="space-y-4">
                <input
                  type="range"
                  min="1"
                  max="120"
                  value={timeLimit}
                  onChange={(e) => setValue('timeLimit', parseInt(e.target.value), { shouldValidate: true })}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1 min</span>
                  <span className="font-medium text-primary text-lg">{timeLimit}</span>
                  <span>120 min</span>
                </div>
              </div>
            </div>
          </EnhancedCard>
        </div>
      </div>

      {/* Quiz Summary */}
      <EnhancedCard variant="glass" className="border-primary/20 bg-primary/5">
        <div className="p-6">
          <h4 className="font-semibold text-primary mb-4">Quiz Summary</h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{numberOfQuestions}</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-primary">{selectedTypes.length}</div>
              <div className="text-sm text-muted-foreground">Question Types</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-primary">{selectedStyles.length}</div>
              <div className="text-sm text-muted-foreground">Question Styles</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-primary">{timeLimit}</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Questions per minute:</span>
              <span className="font-medium">{questionsPerMinute}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Estimated completion:</span>
              <span className="font-medium">{Math.round(estimatedTime)} minutes</span>
            </div>
          </div>
        </div>
      </EnhancedCard>
    </div>
  );
}
