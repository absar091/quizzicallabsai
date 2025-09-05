'use client';

import { useFormContext } from 'react-hook-form';
import { Target, BookOpen, Brain, Trophy, Star, Zap } from 'lucide-react';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { cn } from '@/lib/utils';

const difficultyLevels = [
  {
    id: 'easy',
    title: 'Easy',
    description: 'Perfect for beginners or quick reviews',
    icon: BookOpen,
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
    features: [
      'Basic concepts and fundamentals',
      'Straightforward questions',
      'Multiple hints available',
      'Encouraging explanations'
    ]
  },
  {
    id: 'medium',
    title: 'Medium',
    description: 'Balanced challenge for steady learners',
    icon: Target,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    features: [
      'Moderate complexity',
      'Application of concepts',
      'Some analytical thinking',
      'Balanced difficulty curve'
    ]
  },
  {
    id: 'hard',
    title: 'Hard',
    description: 'Challenging for advanced learners',
    icon: Brain,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 border-orange-200',
    features: [
      'Complex problem-solving',
      'Deep conceptual understanding',
      'Critical thinking required',
      'Advanced applications'
    ]
  },
  {
    id: 'master',
    title: 'Master',
    description: 'Expert level for true mastery',
    icon: Trophy,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    features: [
      'Expert-level challenges',
      'Research-grade complexity',
      'Synthesis and evaluation',
      'Cutting-edge concepts'
    ]
  }
];

export function DifficultyStep() {
  const { setValue, watch } = useFormContext();
  const selectedDifficulty = watch('difficulty');

  const handleDifficultySelect = (difficulty: string) => {
    setValue('difficulty', difficulty as any, { shouldValidate: true });
  };

  const selectedLevel = difficultyLevels.find(level => level.id === selectedDifficulty);

  return (
    <div className="space-y-8">
      {/* Difficulty Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {difficultyLevels.map((level) => {
          const LevelIcon = level.icon;
          const isSelected = selectedDifficulty === level.id;

          return (
            <EnhancedCard
              key={level.id}
              className={cn(
                'cursor-pointer transition-all duration-300 hover:scale-105',
                isSelected && 'ring-2 ring-primary shadow-lg'
              )}
              onClick={() => handleDifficultySelect(level.id)}
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={cn(
                    'p-3 rounded-xl',
                    isSelected ? 'bg-primary text-primary-foreground' : level.bgColor
                  )}>
                    <LevelIcon className={cn(
                      'w-6 h-6',
                      isSelected ? 'text-primary-foreground' : level.color
                    )} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{level.title}</h3>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {level.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <div className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        isSelected ? 'bg-primary' : level.color.replace('text-', 'bg-')
                      )} />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </EnhancedCard>
          );
        })}
      </div>

      {/* Selected Difficulty Summary */}
      {selectedLevel && (
        <EnhancedCard variant="glass" className="border-primary/20 bg-primary/5">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <selectedLevel.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-primary">Selected: {selectedLevel.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedLevel.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h5 className="font-medium text-primary">What to expect:</h5>
                <ul className="space-y-1 text-muted-foreground">
                  {selectedLevel.features.slice(0, 2).map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Star className="w-3 h-3 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h5 className="font-medium text-primary">Best for:</h5>
                <div className="text-muted-foreground">
                  {selectedLevel.id === 'easy' && 'New learners, quick reviews, confidence building'}
                  {selectedLevel.id === 'medium' && 'Regular study sessions, concept application'}
                  {selectedLevel.id === 'hard' && 'Advanced learners, exam preparation'}
                  {selectedLevel.id === 'master' && 'Experts, research, comprehensive mastery'}
                </div>
              </div>
            </div>
          </div>
        </EnhancedCard>
      )}

      {/* Difficulty Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EnhancedCard variant="outlined" className="text-center p-4">
          <Zap className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h4 className="font-medium mb-1">Start Easy</h4>
          <p className="text-xs text-muted-foreground">
            Build confidence with easier questions first
          </p>
        </EnhancedCard>

        <EnhancedCard variant="outlined" className="text-center p-4">
          <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h4 className="font-medium mb-1">Match Your Level</h4>
          <p className="text-xs text-muted-foreground">
            Choose difficulty that challenges but doesn't frustrate
          </p>
        </EnhancedCard>

        <EnhancedCard variant="outlined" className="text-center p-4">
          <Trophy className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <h4 className="font-medium mb-1">Progressive Learning</h4>
          <p className="text-xs text-muted-foreground">
            Gradually increase difficulty as you improve
          </p>
        </EnhancedCard>
      </div>
    </div>
  );
}
