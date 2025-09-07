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
        <h2 className="text-xl font-semibold mb-1">Review Settings</h2>
        <p className="text-muted-foreground text-sm">Ready to generate</p>
      </div>

      <div className="space-y-4">
        <div className="border rounded p-3">
          <div className="text-sm text-muted-foreground">Topic</div>
          <div className="font-medium">{topic || 'Not set'}</div>
        </div>

        <div className="border rounded p-3">
          <div className="text-sm text-muted-foreground">Difficulty</div>
          <div className="font-medium capitalize">{difficulty || 'Not set'}</div>
        </div>

        <div className="border rounded p-3">
          <div className="text-sm text-muted-foreground">Questions & Time</div>
          <div className="font-medium">{numberOfQuestions || '0'} questions, {timeLimit || '0'} minutes</div>
        </div>
      </div>
    </div>
  );
}
