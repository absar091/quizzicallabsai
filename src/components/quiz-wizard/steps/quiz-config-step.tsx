'use client';

import { useFormContext } from 'react-hook-form';
import { Clock, Hash, Target, Timer, Zap, Info } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function QuizConfigStep() {
  const { setValue, watch } = useFormContext();
  const numberOfQuestions = watch('numberOfQuestions') || 10;
  const timeLimit = watch('timeLimit') || 10;

  // Calculate estimated time per question
  const timePerQuestion = timeLimit > 0 ? Math.round(timeLimit * 60 / numberOfQuestions) : 0;
  const estimatedDifficulty = numberOfQuestions <= 15 ? 'Easy' :
                             numberOfQuestions <= 30 ? 'Medium' :
                             numberOfQuestions <= 45 ? 'Hard' : 'Expert';

  return (
    <div className="space-y-6 px-2">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Customize Your Quiz</h2>
        <p className="text-muted-foreground text-sm sm:text-base">Adjust the settings to match your preferences</p>
      </div>

      {/* Quick Stats Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100 text-sm">Quiz Summary</span>
            </div>
            <span className="text-xs px-2 py-1 bg-white/50 dark:bg-white/10 rounded-full border border-blue-300 dark:border-blue-700">
              {estimatedDifficulty}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{numberOfQuestions}</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Questions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{timeLimit}m</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Duration</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{timePerQuestion}s</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Per Question</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {/* Number of Questions Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Hash className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base text-foreground">Number of Questions</h3>
                <p className="text-sm text-muted-foreground">How many questions do you want?</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{numberOfQuestions}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="55"
                step="5"
                value={numberOfQuestions}
                onChange={(e) => setValue('numberOfQuestions', parseInt(e.target.value), { shouldValidate: true })}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 slider"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Quick (1)
                </span>
                <span className="text-center px-2">
                  <span className="font-medium text-foreground">{numberOfQuestions}</span>
                  <span className="text-muted-foreground ml-1">questions</span>
                </span>
                <span className="flex items-center gap-1">
                  Marathon (55)
                  <Zap className="w-3 h-3" />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Limit Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Timer className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base text-foreground">Time Limit</h3>
                <p className="text-sm text-muted-foreground">How much time do you need per question?</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{timeLimit}m</div>
                <div className="text-xs text-muted-foreground">{timePerQuestion}s each</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="120"
                step="5"
                value={timeLimit}
                onChange={(e) => setValue('timeLimit', parseInt(e.target.value), { shouldValidate: true })}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 slider"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Rush (1min)
                </span>
                <span className="text-center px-2">
                  <span className="font-medium text-foreground">{timeLimit}</span>
                  <span className="text-muted-foreground ml-1">minutes</span>
                </span>
                <span className="flex items-center gap-1">
                  Relaxed (120min)
                  <Clock className="w-3 h-3" />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Helper Tips */}
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-200 dark:border-amber-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-medium text-amber-900 dark:text-amber-100 text-sm">Quiz Tips</h4>
              <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
                <li>• More questions = more comprehensive quiz</li>
                <li>• Allow 45-60 seconds per question for best results</li>
                <li>• Shorter time limits = higher difficulty</li>
                <li>• Longer quizzes may take 30+ minutes to generate</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid hsl(var(--background));
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid hsl(var(--background));
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
