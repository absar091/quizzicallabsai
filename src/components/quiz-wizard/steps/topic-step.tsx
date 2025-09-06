'use client';

import { useFormContext } from 'react-hook-form';
import { Search, BookOpen } from 'lucide-react';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { cn } from '@/lib/utils';

const popularTopics = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'JavaScript', 'Python', 'React', 'World History',
  'Psychology', 'Economics', 'English Literature', 'Computer Science'
];

export function TopicStep() {
  const { setValue, watch } = useFormContext();
  const currentTopic = watch('topic');

  const handleTopicSelect = (topic: string) => {
    setValue('topic', topic, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      {/* Topic Input */}
      <div className="space-y-4">
        <EnhancedInput
          name="topic"
          label="What topic would you like to quiz yourself on?"
          placeholder="e.g., Quantum Physics, React Hooks, World War II..."
          leftIcon={<Search className="w-4 h-4" />}
          className="text-lg"
        />

        {currentTopic && (
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Selected: <strong>{currentTopic}</strong></span>
          </div>
        )}
      </div>

      {/* Popular Topics */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Popular Topics</h3>
          <p className="text-muted-foreground text-sm">
            Quick select or enter your own topic above
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {popularTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => handleTopicSelect(topic)}
              className={cn(
                'p-3 text-sm rounded-lg border transition-all duration-200 hover:border-primary hover:bg-primary/5',
                currentTopic === topic && 'border-primary bg-primary/10 text-primary font-medium'
              )}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <EnhancedCard variant="glass" className="border-accent/20 bg-accent/5">
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <BookOpen className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <h4 className="font-medium text-accent mb-1">Pro Tip</h4>
              <p className="text-sm text-muted-foreground">
                Be specific! Instead of "Science", try "Photosynthesis in Plants" for better questions.
              </p>
            </div>
          </div>
        </div>
      </EnhancedCard>
    </div>
  );
}
