'use client';

import { useFormContext } from 'react-hook-form';

export function QuizConfigStep() {
  const { setValue, watch } = useFormContext();
  const numberOfQuestions = watch('numberOfQuestions') || 10;
  const timeLimit = watch('timeLimit') || 10;

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-1">Settings</h2>
        <p className="text-muted-foreground text-sm">Questions and time</p>
      </div>

      <div className="space-y-6">
        {/* Number of Questions */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Number of Questions: {numberOfQuestions}</label>
          <input
            type="range"
            min="1"
            max="55"
            value={numberOfQuestions}
            onChange={(e) => setValue('numberOfQuestions', parseInt(e.target.value), { shouldValidate: true })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>55</span>
          </div>
        </div>

        {/* Time Limit */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Time Limit (minutes): {timeLimit}</label>
          <input
            type="range"
            min="1"
            max="120"
            value={timeLimit}
            onChange={(e) => setValue('timeLimit', parseInt(e.target.value), { shouldValidate: true })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>120</span>
          </div>
        </div>
      </div>
    </div>
  );
}
