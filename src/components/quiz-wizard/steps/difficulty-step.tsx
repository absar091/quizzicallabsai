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
        <h2 className="text-2xl font-bold mb-1">Difficulty Level</h2>
        <p className="text-muted-foreground text-base">Choose your challenge level</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {difficultyLevels.map((level) => (
          <button
            key={level.id}
            onClick={() => handleDifficultySelect(level.id)}
            className={cn(
              'p-4 text-center border-2 rounded-lg transition-all duration-200 font-semibold text-lg',
              selectedDifficulty === level.id
                ? 'border-primary bg-primary text-primary-foreground shadow-md'
                : 'border-muted hover:border-primary bg-card hover:bg-accent shadow-sm'
            )}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
}
