'use client';

import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';

export function FineTuningStep() {
  const { register } = useFormContext();

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-1">Specific Instructions</h2>
        <p className="text-muted-foreground text-base">Add any special requirements (optional)</p>
      </div>

      <div className="space-y-4">
        <Textarea
          {...register('specificInstructions')}
          placeholder="Add any specific requirements or instructions..."
          rows={5}
          className="resize-none font-medium text-base"
        />
      </div>
    </div>
  );
}
