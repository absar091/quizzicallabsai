'use client';

import { useFormContext } from 'react-hook-form';
import { Search, BookOpen, GraduationCap, Code, Calculator, Microscope, Globe } from 'lucide-react';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { cn } from '@/lib/utils';

const topicSuggestions = [
  {
    category: 'Academic Subjects',
    icon: GraduationCap,
    topics: [
      'Mathematics', 'Physics', 'Chemistry', 'Biology',
      'English Literature', 'History', 'Geography', 'Computer Science'
    ]
  },
  {
    category: 'Programming',
    icon: Code,
    topics: [
      'JavaScript', 'Python', 'React', 'Node.js',
      'TypeScript', 'CSS', 'HTML', 'Database Design'
    ]
  },
  {
    category: 'Science',
    icon: Microscope,
    topics: [
      'Quantum Physics', 'Organic Chemistry', 'Genetics',
      'Astronomy', 'Environmental Science', 'Neuroscience'
    ]
  },
  {
    category: 'Other',
    icon: Globe,
    topics: [
      'World History', 'Psychology', 'Economics',
      'Philosophy', 'Art History', 'Music Theory'
    ]
  }
];

export function TopicStep() {
  const { setValue, watch } = useFormContext();
  const currentTopic = watch('topic');

  const handleTopicSelect = (topic: string) => {
    setValue('topic', topic, { shouldValidate: true });
  };

  return (
    <div className="space-y-8">
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

      {/* Topic Suggestions */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Popular Topics</h3>
          <p className="text-muted-foreground text-sm">
            Choose from these popular categories or enter your own topic above
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topicSuggestions.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <EnhancedCard key={category.category} className="hover:scale-105 transition-transform duration-200">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CategoryIcon className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold">{category.category}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {category.topics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => handleTopicSelect(topic)}
                        className={cn(
                          'p-3 text-sm rounded-lg border transition-all duration-200 text-left hover:border-primary hover:bg-primary/5',
                          currentTopic === topic && 'border-primary bg-primary/10 text-primary font-medium'
                        )}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              </EnhancedCard>
            );
          })}
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
                Be specific with your topic! Instead of "Science", try "Photosynthesis in Plants" or "Newton's Laws of Motion".
                This helps our AI generate more targeted and relevant questions.
              </p>
            </div>
          </div>
        </div>
      </EnhancedCard>
    </div>
  );
}
