'use client';

import { useFormContext } from 'react-hook-form';
import { Sparkles, Lightbulb, Target, MessageSquare } from 'lucide-react';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { EnhancedCard } from '@/components/ui/enhanced-card';

const fineTuningSuggestions = [
  {
    title: 'Focus on Weak Areas',
    description: 'Target specific topics you struggle with',
    example: 'Focus more on organic chemistry mechanisms and reaction pathways',
    icon: Target
  },
  {
    title: 'Real-world Applications',
    description: 'Include practical examples and case studies',
    example: 'Include real-world applications of quantum physics in technology',
    icon: Lightbulb
  },
  {
    title: 'Step-by-step Solutions',
    description: 'Request detailed problem-solving approaches',
    example: 'Show step-by-step solutions for complex mathematical problems',
    icon: MessageSquare
  },
  {
    title: 'Advanced Concepts',
    description: 'Challenge with cutting-edge topics',
    example: 'Include questions about recent developments in artificial intelligence',
    icon: Sparkles
  }
];

export function FineTuningStep() {
  const { watch } = useFormContext();
  const specificInstructions = watch('specificInstructions') || '';

  return (
    <div className="space-y-8">
      {/* Instructions Input */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Fine-tune Your Quiz</h3>
          <p className="text-muted-foreground text-sm">
            Add specific instructions to customize your quiz experience
          </p>
        </div>

        <EnhancedCard>
          <div className="p-6">
            <EnhancedInput
              name="specificInstructions"
              label="Special Instructions (Optional)"
              placeholder="e.g., Focus on Newton's Laws, include real-world examples, emphasize problem-solving..."
              className="min-h-[100px]"
            />

            <div className="mt-4 text-sm text-muted-foreground">
              <p className="font-medium mb-2">💡 Tips for better results:</p>
              <ul className="space-y-1 text-xs">
                <li>• Specify particular subtopics or chapters</li>
                <li>• Mention your learning style preferences</li>
                <li>• Request specific types of examples</li>
                <li>• Ask for particular difficulty patterns</li>
              </ul>
            </div>
          </div>
        </EnhancedCard>
      </div>

      {/* Quick Suggestions */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Quick Suggestions</h3>
          <p className="text-muted-foreground text-sm">
            Click any suggestion to add it to your instructions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fineTuningSuggestions.map((suggestion) => {
            const SuggestionIcon = suggestion.icon;

            return (
              <EnhancedCard
                key={suggestion.title}
                className="cursor-pointer hover:scale-105 transition-all duration-300"
                onClick={() => {
                  // This would be handled by the parent component
                  const currentInstructions = specificInstructions;
                  const newInstructions = currentInstructions
                    ? `${currentInstructions}\n${suggestion.example}`
                    : suggestion.example;

                  // Update the form value
                  const form = document.querySelector('textarea[name="specificInstructions"]') as HTMLTextAreaElement;
                  if (form) {
                    form.value = newInstructions;
                    form.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }}
              >
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <SuggestionIcon className="w-4 h-4 text-primary" />
                    </div>
                    <h4 className="font-medium text-sm">{suggestion.title}</h4>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2">
                    {suggestion.description}
                  </p>

                  <div className="bg-muted/50 rounded p-2">
                    <p className="text-xs italic text-muted-foreground">
                      "{suggestion.example}"
                    </p>
                  </div>
                </div>
              </EnhancedCard>
            );
          })}
        </div>
      </div>

      {/* Preview */}
      {specificInstructions && (
        <EnhancedCard variant="glass" className="border-accent/20 bg-accent/5">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <h4 className="font-medium text-accent text-sm">Your Instructions</h4>
            </div>
            <p className="text-sm text-muted-foreground bg-white/50 rounded p-3">
              {specificInstructions}
            </p>
          </div>
        </EnhancedCard>
      )}

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EnhancedCard variant="outlined" className="text-center p-4">
          <Target className="w-6 h-6 text-primary mx-auto mb-2" />
          <h4 className="font-medium mb-1 text-sm">Be Specific</h4>
          <p className="text-xs text-muted-foreground">
            The more specific your instructions, the better your quiz will be tailored to your needs.
          </p>
        </EnhancedCard>

        <EnhancedCard variant="outlined" className="text-center p-4">
          <Lightbulb className="w-6 h-6 text-accent mx-auto mb-2" />
          <h4 className="font-medium mb-1 text-sm">Think About Your Goals</h4>
          <p className="text-xs text-muted-foreground">
            Consider what you want to achieve - exam prep, concept mastery, or skill building.
          </p>
        </EnhancedCard>
      </div>
    </div>
  );
}
