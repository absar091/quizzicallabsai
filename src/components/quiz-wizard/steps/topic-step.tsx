'use client';

import { useFormContext } from 'react-hook-form';
import { Search } from 'lucide-react';
import { EnhancedInput } from '@/components/ui/enhanced-input';

export function TopicStep() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Topic Name</h2>
        <p className="text-muted-foreground">Enter the topic you want to create a quiz for</p>
      </div>

      <div className="max-w-md mx-auto">
        <EnhancedInput
          name="topic"
          label=""
          placeholder="e.g., Quantum Physics, React Hooks, World War II..."
          leftIcon={<Search className="w-4 h-4" />}
          className="text-lg"
        />
      </div>
    </div>
  );
}
