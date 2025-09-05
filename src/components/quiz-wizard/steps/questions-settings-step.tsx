'use client';

import { useFormContext } from 'react-hook-form';
import { Settings, AlertTriangle } from 'lucide-react';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function QuestionsSettingsStep() {
  const { watch, setValue } = useFormContext();
  const numberOfQuestions = watch('numberOfQuestions') || 10;

  return (
    <div className="space-y-8">
      {/* Question Count Configuration */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Configure Question Count</h3>
          <p className="text-muted-foreground text-sm">
            How many practice questions would you like to generate?
          </p>
        </div>

        <EnhancedCard>
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-medium">Number of Questions</h4>
            </div>

            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="55"
                value={numberOfQuestions}
                onChange={(e) => setValue('numberOfQuestions', parseInt(e.target.value), { shouldValidate: true })}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1</span>
                <span className="font-medium text-primary text-lg">{numberOfQuestions}</span>
                <span>55</span>
              </div>
            </div>
          </div>
        </EnhancedCard>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EnhancedCard variant="glass" className="border-accent/20 bg-accent/5">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <h4 className="font-medium text-accent">Quick Review</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              5-10 questions for a quick review session
            </p>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="glass" className="border-primary/20 bg-primary/5">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <h4 className="font-medium text-primary">Deep Practice</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              20-30 questions for comprehensive practice
            </p>
          </div>
        </EnhancedCard>
      </div>

      {/* Warning */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          The AI-generated count may sometimes vary slightly from your selection to ensure quality questions.
        </AlertDescription>
      </Alert>

      {/* Preview */}
      <EnhancedCard variant="outlined" className="text-center p-6">
        <h4 className="font-semibold mb-2">Preview</h4>
        <p className="text-muted-foreground">
          You will generate <span className="font-medium text-primary">{numberOfQuestions}</span> practice questions
          with correct answers and explanations.
        </p>
      </EnhancedCard>
    </div>
  );
}
