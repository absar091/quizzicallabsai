'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

export function TopicStep() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-1">Topic</h2>
        <p className="text-muted-foreground">Enter your topic</p>
      </div>

      <div className="space-y-4">
        <Input
          {...register('topic')}
          placeholder="e.g. Biology, Physics, History..."
          className="text-lg h-12"
        />
        {errors.topic && (
          <span className="text-destructive font-medium">{String(errors.topic.message)}</span>
        )}
      </div>
    </div>
  );
}
