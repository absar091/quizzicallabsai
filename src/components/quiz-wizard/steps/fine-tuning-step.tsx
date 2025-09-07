'use client';

import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';

export function FineTuningStep() {
  const { register } = useFormContext();

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-1">Instructions</h2>
        <p className="text-muted-foreground text-sm">Optional special instructions</p>
      </div>

      <div className="space-y-4">
        <Textarea
          {...register('specificInstructions')}
          placeholder="Add any specific requirements or instructions..."
          rows={4}
          className="resize-none"
        />
      </div>
    </div>
  );
}
