'use client';

import { useFormContext } from 'react-hook-form';
import { Clock, Hash } from 'lucide-react';

export function QuizConfigStep() {
  const { setValue, watch } = useFormContext();
  const numberOfQuestions = watch('numberOfQuestions') || 10;
  const timeLimit = watch('timeLimit') || 10;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Questions & Time</h2>
        <p className="text-muted-foreground">Set the number of questions and time limit</p>
      </div>

      <div className="max-w-md mx-auto space-y-8">
        {/* Number of Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Hash className="w-5 h-5 text-primary" />
              <span className="font-medium">Questions</span>
            </div>
            <span className="text-2xl font-bold text-primary">{numberOfQuestions}</span>
          </div>

          <input
            type="range"
            min="1"
            max="55"
            value={numberOfQuestions}
            onChange={(e) => setValue('numberOfQuestions', parseInt(e.target.value), { shouldValidate: true })}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>1</span>
            <span>55</span>
          </div>
        </div>

        {/* Time Limit */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium">Time (minutes)</span>
            </div>
            <span className="text-2xl font-bold text-primary">{timeLimit}</span>
          </div>

          <input
            type="range"
            min="1"
            max="120"
            value={timeLimit}
            onChange={(e) => setValue('timeLimit', parseInt(e.target.value), { shouldValidate: true })}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>1</span>
            <span>120</span>
          </div>
        </div>
      </div>
    </div>
  );
}
