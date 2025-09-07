'use client';

import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';

const questionOptions = [
  'Knowledge-based',
  'Conceptual',
  'Numerical',
  'Practice Questions'
];

export function QuestionSettingsStep() {
  const { setValue, watch } = useFormContext();
  const selectedStyles = watch('questionStyles') || [];

  const handleStyleToggle = (style: string) => {
    const newStyles = selectedStyles.includes(style)
      ? selectedStyles.filter(s => s !== style)
      : [...selectedStyles, style];
    setValue('questionStyles', newStyles, { shouldValidate: true });
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-1">Question Styles</h2>
        <p className="text-muted-foreground text-base">Choose what types of questions you want</p>
      </div>

      <div className="space-y-4">
        {questionOptions.map((style) => {
          const isSelected = selectedStyles.includes(style);

          return (
            <button
              key={style}
              onClick={() => handleStyleToggle(style)}
              className={cn(
                'w-full p-4 text-left border-2 rounded-lg transition-all duration-200 font-semibold text-lg',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground shadow-md'
                  : 'border-muted hover:border-primary bg-card hover:bg-accent shadow-sm'
              )}
            >
              {style}
            </button>
          );
        })}
      </div>
    </div>
  );
}
