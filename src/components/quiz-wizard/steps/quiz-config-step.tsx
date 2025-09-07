'use client';

import { useFormContext } from 'react-hook-form';

export function QuizConfigStep() {
  const { setValue, watch } = useFormContext();
  const numberOfQuestions = watch('numberOfQuestions') || 10;
  const timeLimit = watch('timeLimit') || 10;

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-1">Quiz Settings</h2>
        <p className="text-muted-foreground text-base">Configure your quiz preferences</p>
      </div>

      <div className="space-y-8">
        {/* Number of Questions */}
        <div className="space-y-4">
          <label className="text-base font-semibold">Number of Questions: {numberOfQuestions}</label>
          <input
            type="range"
            min="1"
            max="55"
            value={numberOfQuestions}
            onChange={(e) => setValue('numberOfQuestions', parseInt(e.target.value), { shouldValidate: true })}
            className="w-full h-3"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="font-medium">1</span>
            <span className="font-medium">55</span>
          </div>
        </div>

        {/* Time Limit */}
        <div className="space-y-4">
          <label className="text-base font-semibold">Time Limit (minutes): {timeLimit}</label>
          <input
            type="range"
            min="1"
            max="120"
            value={timeLimit}
            onChange={(e) => setValue('timeLimit', parseInt(e.target.value), { shouldValidate: true })}
            className="w-full h-3"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="font-medium">1</span>
            <span className="font-medium">120</span>
          </div>
        </div>
      </div>
    </div>
  );
}
