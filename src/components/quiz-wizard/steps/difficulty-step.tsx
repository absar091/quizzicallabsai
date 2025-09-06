'use client';

import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';

const difficultyLevels = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
  { id: 'master', label: 'Master' }
];

export function DifficultyStep() {
  const { setValue, watch } = useFormContext();
  const selectedDifficulty = watch('difficulty');

  const handleDifficultySelect = (difficulty: string) => {
    setValue('difficulty', difficulty as any, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Style</h2>
        <p className="text-muted-foreground">Choose the difficulty level for your quiz</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-4">
          {difficultyLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => handleDifficultySelect(level.id)}
              className={cn(
                'p-4 text-center rounded-lg border-2 transition-all duration-200 font-medium',
                selectedDifficulty === level.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted hover:border-primary/50 hover:bg-primary/5'
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
