'use client';

import { useFormContext } from 'react-hook-form';
import { Brain, Lightbulb, BarChart, MessageSquareQuote, BookCopy } from 'lucide-react';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { cn } from '@/lib/utils';

const questionStyleOptions = [
  {
    id: 'Knowledge-based',
    label: 'Knowledge-based',
    description: 'Recall and recognition of facts',
    icon: Brain,
  },
  {
    id: 'Conceptual',
    label: 'Conceptual',
    description: 'Understanding core principles',
    icon: Lightbulb,
  },
  {
    id: 'Numerical',
    label: 'Numerical',
    description: 'Mathematical calculations',
    icon: BarChart,
  },
  {
    id: 'Past Paper Style',
    label: 'Past Paper Style',
    description: 'Real exam question patterns',
    icon: BookCopy,
  },
  {
    id: 'Comprehension-based MCQs',
    label: 'Comprehension-based',
    description: 'Reading passage with questions',
    icon: MessageSquareQuote,
  },
  {
    id: 'Practice Questions',
    label: 'Practice Questions',
    description: 'Mixed practice with explanations',
    icon: Brain,
  },
  {
    id: 'Custom Format',
    label: 'Custom Format',
    description: 'Tailored to specific learning needs',
    icon: Lightbulb,
  }
];

export function QuestionSettingsStep() {
  const { setValue, watch } = useFormContext();
  const selectedStyles = watch('questionStyles') || [];

  const handleStyleToggle = (styleId: string) => {
    const newStyles = selectedStyles.includes(styleId)
      ? selectedStyles.filter(s => s !== styleId)
      : [...selectedStyles, styleId];
    setValue('questionStyles', newStyles, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      {/* Question Styles */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Question Style</h3>
          <p className="text-muted-foreground text-sm">
            Choose the type of questions you want
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {questionStyleOptions.map((style) => {
            const StyleIcon = style.icon;
            const isSelected = selectedStyles.includes(style.id);

            return (
              <button
                key={style.id}
                onClick={() => handleStyleToggle(style.id)}
                className={cn(
                  'p-3 rounded-lg border transition-all duration-200 text-left min-h-[80px]',
                  'bg-card hover:bg-accent/50 active:scale-95',
                  isSelected
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20 dark:bg-primary/20 dark:border-primary shadow-sm'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className="flex items-start space-x-2 mb-1">
                  <div className={cn(
                    'p-1.5 rounded-md flex-shrink-0 mt-0.5',
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}>
                    <StyleIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-xs text-foreground leading-tight">{style.label}</h4>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-tight line-clamp-2">{style.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selection Summary */}
      {selectedStyles.length > 0 && (
        <EnhancedCard variant="glass" className="border-primary/20 bg-primary/5">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-primary" />
              <h4 className="font-medium text-primary text-sm">Selected Styles</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedStyles.map((styleId) => {
                const style = questionStyleOptions.find(s => s.id === styleId);
                return style ? (
                  <span key={styleId} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
                    {style.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </EnhancedCard>
      )}
    </div>
  );
}
