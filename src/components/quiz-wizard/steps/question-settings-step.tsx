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
        <h2 className="text-xl font-semibold mb-1">Question Types</h2>
        <p className="text-muted-foreground text-sm">Select question styles</p>
      </div>

      <div className="space-y-3">
        {questionOptions.map((style) => {
          const isSelected = selectedStyles.includes(style);

          return (
            <button
              key={style}
              onClick={() => handleStyleToggle(style)}
              className={cn(
                'w-full p-3 text-left border-2 rounded transition-colors font-medium',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary bg-muted/50 hover:bg-muted'
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
