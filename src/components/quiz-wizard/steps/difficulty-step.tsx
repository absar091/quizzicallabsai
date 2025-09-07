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
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-1">Difficulty</h2>
        <p className="text-muted-foreground text-sm">Select difficulty level</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {difficultyLevels.map((level) => (
          <button
            key={level.id}
            onClick={() => handleDifficultySelect(level.id)}
            className={cn(
              'p-3 text-center border-2 transition-colors font-medium rounded',
              selectedDifficulty === level.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border hover:border-primary bg-muted/50 hover:bg-muted'
            )}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
}
