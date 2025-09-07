'use client';

import { useFormContext } from 'react-hook-form';
import { Search, Lightbulb, Target, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const topicSuggestions = [
  { icon: Lightbulb, text: "Atomic Physics", category: "Science" },
  { icon: Target, text: "World War II", category: "History" },
  { icon: BookOpen, text: "Shakespeare Plays", category: "Literature" },
  { icon: Lightbulb, text: "Chemistry Reactions", category: "Science" },
];

export function TopicStep() {
  const { register, formState: { errors }, watch } = useFormContext();
  const topicValue = watch('topic') || '';

  const handleSuggestionClick = (suggestion: string) => {
    // This would update the form value
    // For now, just show the suggestion text
    document.querySelector('input[name="topic"]')?.setAttribute('placeholder', suggestion);
  };

  return (
    <div className="space-y-6 px-2">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">What topic interests you?</h2>
        <p className="text-muted-foreground text-sm sm:text-base">Enter any subject or topic you want to create a quiz about</p>
      </div>

      {/* Main Input Card */}
      <Card className="shadow-sm border-2 hover:border-primary/20 transition-colors">
        <CardContent className="p-4 sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              {...register('topic')}
              placeholder="e.g., Quantum Physics, React Hooks, World War II..."
              className={cn(
                "pl-10 text-base sm:text-lg h-12 sm:h-14 bg-muted/30 border-0 focus:ring-2 focus:ring-primary/20",
                topicValue && "bg-background"
              )}
            />
          </div>
          {errors.topic && (
            <div className="mt-2 p-2 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive font-medium">{String(errors.topic.message)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile Input Hints */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground mb-4">Popular topics to try:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {topicSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion.text)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs bg-muted/50 hover:bg-primary/10 rounded-full border border-border hover:border-primary/30 transition-colors"
            >
              <suggestion.icon className="w-3 h-3" />
              <span>{suggestion.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Help Text */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-primary">Pro Tips</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Be specific about your topic for better results</li>
                <li>• Include difficulty level or grade in your topic</li>
                <li>• Try subjects, historical events, or scientific concepts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
