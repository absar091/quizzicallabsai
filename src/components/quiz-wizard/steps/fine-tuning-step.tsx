'use client';

import { useFormContext } from 'react-hook-form';
import { MessageSquare } from 'lucide-react';
import { EnhancedInput } from '@/components/ui/enhanced-input';

export function FineTuningStep() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Specific Instructions</h2>
        <p className="text-muted-foreground">Add any special instructions for the AI (optional)</p>
      </div>

      <div className="max-w-md mx-auto">
        <EnhancedInput
          name="specificInstructions"
          label=""
          placeholder="e.g., Focus on Newton's Laws, include real-world examples..."
          leftIcon={<MessageSquare className="w-4 h-4" />}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}
