'use client';

import { useFormContext } from 'react-hook-form';
import { Clock, Hash, Settings } from 'lucide-react';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { cn } from '@/lib/utils';

export function QuizConfigStep() {
  const { setValue, watch } = useFormContext();
  const numberOfQuestions = watch('numberOfQuestions') || 10;
  const timeLimit = watch('timeLimit') || 10;

  const questionsPerMinute = Math.round(numberOfQuestions / timeLimit);
  const estimatedTime = Math.round(numberOfQuestions / questionsPerMinute);

  return (
    <div className="space-y-6">
      {/* Number of Questions */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Hash className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Number of Questions</h3>
        </div>

        <div className="px-4">
          <input
            type="range"
            min="1"
            max="55"
            value={numberOfQuestions}
            onChange={(e) => setValue('numberOfQuestions', parseInt(e.target.value), { shouldValidate: true })}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>1</span>
            <span className="font-medium text-primary text-xl">{numberOfQuestions}</span>
            <span>55</span>
          </div>
        </div>
      </div>

      {/* Time Limit */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Time Limit (Minutes)</h3>
        </div>

        <div className="px-4">
          <input
            type="range"
            min="1"
            max="120"
            value={timeLimit}
            onChange={(e) => setValue('timeLimit', parseInt(e.target.value), { shouldValidate: true })}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>1 min</span>
            <span className="font-medium text-primary text-xl">{timeLimit}</span>
            <span>120 min</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <EnhancedCard variant="glass" className="border-primary/20 bg-primary/5">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Settings className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-primary">Quiz Summary</h4>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">{numberOfQuestions}</div>
              <div className="text-xs text-muted-foreground">Questions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary">{timeLimit}</div>
              <div className="text-xs text-muted-foreground">Minutes</div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="text-xs text-muted-foreground text-center">
              ~{questionsPerMinute} questions per minute
            </div>
          </div>
        </div>
      </EnhancedCard>
    </div>
  );
}
