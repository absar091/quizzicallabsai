'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

export function TopicStep() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-1">Topic</h2>
        <p className="text-muted-foreground text-sm">Enter your topic</p>
      </div>

      <div className="space-y-4">
        <Input
          {...register('topic')}
          placeholder="e.g. Biology, Physics, History..."
          className="text-base"
        />
        {errors.topic && (
          <span className="text-sm text-destructive">{String(errors.topic.message)}</span>
        )}
      </div>
    </div>
  );
}
