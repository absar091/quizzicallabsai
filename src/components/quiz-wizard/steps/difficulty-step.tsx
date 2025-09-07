'use client';

import { useFormContext } from 'react-hook-form';
import { Baby, BookOpen, Flame, Trophy, TrendingUp, Award, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const difficultyLevels = [
  {
    id: 'easy',
    label: 'Easy',
    description: 'Beginner friendly',
    icon: Baby,
    color: 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200',
    selectedColor: 'bg-green-500 text-white'
  },
  {
    id: 'medium',
    label: 'Medium',
    description: 'Balanced challenge',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200',
    selectedColor: 'bg-blue-500 text-white'
  },
  {
    id: 'hard',
    label: 'Hard',
    description: 'Advanced level',
    icon: Flame,
    color: 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200',
    selectedColor: 'bg-orange-500 text-white'
  },
  {
    id: 'master',
    label: 'Master',
    description: 'Expert challenge',
    icon: Trophy,
    color: 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200',
    selectedColor: 'bg-purple-500 text-white'
  }
];

export function DifficultyStep() {
  const { setValue, watch } = useFormContext();
  const selectedDifficulty = watch('difficulty');

  const handleDifficultySelect = (difficulty: string) => {
    setValue('difficulty', difficulty as any, { shouldValidate: true });
  };

  return (
    <div className="space-y-6 px-2">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Choose Your Challenge Level</h2>
        <p className="text-muted-foreground text-sm sm:text-base">Select the difficulty that matches your knowledge level</p>
      </div>

      {/* Difficulty Cards */}
      <div className="space-y-3">
        {difficultyLevels.map((level) => {
          const IconComponent = level.icon;
          const isSelected = selectedDifficulty === level.id;

          return (
            <Card
              key={level.id}
              onClick={() => handleDifficultySelect(level.id)}
              className={cn(
                "cursor-pointer transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md",
                isSelected
                  ? "ring-2 ring-primary border-primary/30"
                  : "hover:border-primary/20"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors",
                    isSelected ? level.selectedColor : level.color
                  )}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-base text-foreground">{level.label}</h3>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{level.description}</p>
                  </div>

                  {/* Selection indicator */}
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    isSelected
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/20"
                  )}>
                    {isSelected && (
                      <div className="w-3 h-3 rounded-full bg-primary-foreground"></div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h4 className="font-medium text-primary text-sm">Difficulty Guide</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Award className="w-3 h-3 text-green-600" />
                <span className="font-medium text-green-700">Easy</span>
              </div>
              <p className="text-muted-foreground">Questions for beginners</p>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Target className="w-3 h-3 text-purple-600" />
                <span className="font-medium text-purple-700">Master</span>
              </div>
              <p className="text-muted-foreground">Advanced challenge questions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
