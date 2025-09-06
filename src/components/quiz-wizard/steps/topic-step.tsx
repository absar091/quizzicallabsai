'use client';

import { useFormContext } from 'react-hook-form';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function TopicStep() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Topic Name</h2>
        <p className="text-muted-foreground">Enter the topic you want to create a quiz for</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            {...register('topic')}
            placeholder="e.g., Quantum Physics, React Hooks, World War II..."
            className="pl-10 text-lg h-12"
          />
        </div>
        {errors.topic && (
          <p className="text-sm text-red-600 mt-2">{String(errors.topic.message)}</p>
        )}
      </div>
    </div>
  );
}
