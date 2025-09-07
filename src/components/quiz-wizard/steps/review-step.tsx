'use client';

import { useFormContext } from 'react-hook-form';

export function ReviewStep() {
  const { watch } = useFormContext();
  const formData = watch();

  const {
    topic,
    difficulty,
    numberOfQuestions,
    timeLimit
  } = formData;

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-1">Review Your Settings</h2>
        <p className="text-muted-foreground text-base">Make sure everything looks correct</p>
      </div>

      <div className="space-y-6">
        <div className="border-2 rounded-lg p-4 shadow-sm">
          <div className="text-base font-semibold text-muted-foreground mb-1">📚 Topic</div>
          <div className="font-bold text-lg">{topic || 'Not set'}</div>
        </div>

        <div className="border-2 rounded-lg p-4 shadow-sm">
          <div className="text-base font-semibold text-muted-foreground mb-1">🎯 Difficulty Level</div>
          <div className="font-bold text-lg capitalize">{difficulty || 'Not set'}</div>
        </div>

        <div className="border-2 rounded-lg p-4 shadow-sm">
          <div className="text-base font-semibold text-muted-foreground mb-1">⚙️ Quiz Configuration</div>
          <div className="font-bold text-lg">{numberOfQuestions || '0'} questions, {timeLimit || '0'} minutes</div>
        </div>
      </div>
    </div>
  );
}
