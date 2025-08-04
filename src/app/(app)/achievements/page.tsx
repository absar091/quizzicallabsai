
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getQuizResults, QuizResult } from "@/lib/indexed-db";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award, BookOpen, Brain, CheckCircle, Crosshair, Star, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  isUnlocked: (history: QuizResult[]) => boolean;
};

const achievementsList: Achievement[] = [
  { id: 'first_quiz', title: 'First Steps', description: 'Complete your first quiz.', icon: Star, isUnlocked: (h) => h.length >= 1 },
  { id: 'quiz_novice', title: 'Quiz Novice', description: 'Complete 10 quizzes.', icon: BookOpen, isUnlocked: (h) => h.length >= 10 },
  { id: 'quiz_adept', title: 'Quiz Adept', description: 'Complete 50 quizzes.', icon: BookOpen, isUnlocked: (h) => h.length >= 50 },
  { id: 'quiz_master', title: 'Quiz Master', description: 'Complete 100 quizzes.', icon: BookOpen, isUnlocked: (h) => h.length >= 100 },
  { id: 'perfect_score', title: 'Perfectionist', description: 'Get a 100% score on any quiz.', icon: CheckCircle, isUnlocked: (h) => h.some(r => r.percentage === 100) },
  { id: 'topic_explorer', title: 'Topic Explorer', description: 'Take quizzes in 5 different topics.', icon: Crosshair, isUnlocked: (h) => new Set(h.map(r => r.topic)).size >= 5 },
  { id: 'topic_master', title: 'Topic Master', description: 'Get an average of 90% or more in a topic (min 5 quizzes).', icon: Brain, isUnlocked: (h) => {
      const topicMap: { [key: string]: { scores: number[] } } = {};
      h.forEach(r => {
        if (!topicMap[r.topic]) topicMap[r.topic] = { scores: [] };
        topicMap[r.topic].scores.push(r.percentage);
      });
      return Object.values(topicMap).some(data => data.scores.length >= 5 && data.scores.reduce((a, b) => a + b, 0) / data.scores.length >= 90);
    }
  },
  { id: 'high_achiever', title: 'High Achiever', description: 'Achieve an overall average score of 80% or more.', icon: Trophy, isUnlocked: (h) => h.length > 0 && (h.reduce((a, b) => a + b.percentage, 0) / h.length) >= 80 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

export default function AchievementsPage() {
  const { user } = useAuth();
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function checkAchievements() {
      if (!user) return;
      const history = await getQuizResults(user.uid);
      const unlocked = new Set<string>();
      achievementsList.forEach(ach => {
        if (ach.isUnlocked(history)) {
          unlocked.add(ach.id);
        }
      });
      setUnlockedAchievements(unlocked);
    }
    checkAchievements();
  }, [user]);

  return (
    <div>
      <PageHeader title="Achievements" description="Track your learning milestones and accomplishments." />
      
      <TooltipProvider>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {achievementsList.map(ach => {
            const isUnlocked = unlockedAchievements.has(ach.id);
            return (
              <Tooltip key={ach.id}>
                <TooltipTrigger asChild>
                  <motion.div variants={itemVariants}>
                    <Card className={cn(
                      "flex flex-col items-center justify-center text-center p-6 aspect-square transition-all duration-300",
                      isUnlocked ? "bg-primary/10 border-primary shadow-lg" : "bg-muted/50 border-dashed"
                    )}>
                      <div className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-full mb-4",
                        isUnlocked ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
                      )}>
                        <ach.icon className="h-8 w-8" />
                      </div>
                      <h3 className={cn("font-semibold", isUnlocked ? "text-primary" : "text-foreground")}>{ach.title}</h3>
                    </Card>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{ach.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </motion.div>
      </TooltipProvider>
    </div>
  );
}
