'use client';

import { useFormContext } from 'react-hook-form';
import { Eye, CheckCircle } from 'lucide-react';

export function ReviewStep() {
  const { watch } = useFormContext();
  const formData = watch();

  const {
    topic,
    difficulty,
    numberOfQuestions,
    timeLimit,
    specificInstructions
  } = formData;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Review & Generate</h2>
        <p className="text-muted-foreground">Review your settings and generate your quiz</p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Topic */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div className="text-sm text-muted-foreground">Topic</div>
            <div className="font-medium">{topic || 'Not selected'}</div>
          </div>
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>

        {/* Style */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div className="text-sm text-muted-foreground">Style</div>
            <div className="font-medium capitalize">{difficulty || 'Not selected'}</div>
          </div>
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>

        {/* Questions & Time */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div className="text-sm text-muted-foreground">Questions & Time</div>
            <div className="font-medium">{numberOfQuestions} questions, {timeLimit} minutes</div>
          </div>
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>

        {/* Instructions */}
        {specificInstructions && (
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-2">Instructions</div>
            <div className="text-sm">{specificInstructions}</div>
          </div>
        )}
      </div>
    </div>
  );
}
