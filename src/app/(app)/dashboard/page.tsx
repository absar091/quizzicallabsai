
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Target, BookOpenText, PlusSquare, Brain } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/page-header";
import { getQuizResults, QuizResult } from "@/lib/indexed-db";
import { motion } from "framer-motion";
import { generateDashboardInsights, GenerateDashboardInsightsOutput } from "@/ai/flows/generate-dashboard-insights";
import { Skeleton } from "@/components/ui/skeleton";

function AiInsightsCard({ recentActivity, userName }: { recentActivity: QuizResult[], userName: string }) {
  const [insights, setInsights] = useState<GenerateDashboardInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchInsights() {
      setIsLoading(true);
      try {
        const result = await generateDashboardInsights({ userName: userName, quizHistory: recentActivity });
        setInsights(result);
      } catch (error) {
        console.error("Failed to fetch AI insights:", error);
        setInsights({ greeting: `Hi, ${userName}!`, observation: "Ready to start learning?", suggestion: "Pick a quiz to get started.", suggestedAction: { buttonText: "Review Study Guide", link: "/generate-study-guide" } });
      } finally {
        setIsLoading(false);
      }
    }
    fetchInsights();
  }, [recentActivity, userName]);

  if (isLoading) {
    return (
        <Card className="bg-primary text-primary-foreground p-6 shadow-xl">
            <Skeleton className="h-6 w-3/4 bg-primary/50" />
            <Skeleton className="h-4 w-full mt-3 bg-primary/50" />
            <Skeleton className="h-4 w-1/2 mt-1 bg-primary/50" />
            <Skeleton className="h-10 w-48 mt-6 bg-accent/80" />
        </Card>
    );
  }
  if (!insights) return null;

  return (
    <Card className="bg-primary text-primary-foreground p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
             <Brain className="h-5 w-5"/>
             <CardTitle className="text-lg font-semibold text-primary-foreground">Today's Focus</CardTitle>
        </div>
      <CardDescription className="text-primary-foreground/80 text-base mb-6">
        {insights.observation} {insights.suggestion}
      </CardDescription>
      {insights.suggestedAction && <Button variant="secondary" asChild className="bg-accent text-accent-foreground hover:bg-accent/90"><Link href={insights.suggestedAction.link}>{insights.suggestedAction.buttonText}</Link></Button>}
    </Card>
  )
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [recentActivity, setRecentActivity] = useState<QuizResult[]>([]);
  
  useEffect(() => {
    async function loadData() {
      if (!user) return;
      const localActivity = await getQuizResults(user.uid);
      setRecentActivity(localActivity);
    }
    if (user) loadData();
  }, [user]);

  const quizzesToday = recentActivity.filter(activity => new Date(activity.date) >= new Date(new Date().setHours(0,0,0,0)));
  const dailyGoalProgress = Math.min((quizzesToday.length / 5) * 100, 100);

  const calculateStreak = (results: QuizResult[]): number => {
    if (results.length === 0) return 0;
    const uniqueDays = new Set<string>();
    results.forEach(result => { uniqueDays.add(new Date(result.date).toDateString()); });
    const sortedDays = Array.from(uniqueDays).map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (sortedDays.some(d => d.toDateString() === today.toDateString()) || sortedDays.some(d => d.toDateString() === yesterday.toDateString())) {
        streak = 1;
        let lastDate = sortedDays.some(d => d.toDateString() === today.toDateString()) ? today : yesterday;
        for (let i = 1; i < sortedDays.length; i++) {
            const currentDate = sortedDays[i];
            const expectedPreviousDay = new Date(lastDate);
            expectedPreviousDay.setDate(lastDate.getDate() - 1);
            if (currentDate.toDateString() === expectedPreviousDay.toDateString()) {
                streak++;
                lastDate = currentDate;
            } else {
                break;
            }
        }
    }
    return streak;
  };
  const streak = calculateStreak(recentActivity);

  return (
    <div className="space-y-8">
      <PageHeader title={`Welcome back, ${user?.displayName?.split(' ')[0]}!`} className="mb-0"/>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <AiInsightsCard recentActivity={recentActivity} userName={user?.displayName?.split(' ')[0] || 'Student'} />
      </motion.div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
        }}
        className="grid grid-cols-2 gap-4"
      >
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <Card className="p-4 shadow-sm">
            <CardHeader className="p-0 flex-row items-center gap-2">
                <Flame className="h-4 w-4 text-muted-foreground"/>
                <CardTitle className="text-base font-semibold">Daily Streak</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-2">
                <p className="text-2xl font-bold">{streak} <span className="text-base font-medium text-muted-foreground">day{streak !== 1 ? 's' : ''}</span></p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
          <Card className="p-4 shadow-sm">
            <CardHeader className="p-0 flex-row items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground"/>
                <CardTitle className="text-base font-semibold">Today's Goal</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-2">
              <Progress value={dailyGoalProgress} className="h-2 mb-1" />
              <p className="text-sm text-muted-foreground">{quizzesToday.length} of 5 Quizzes</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Jump Right In</h2>
        <div className="grid grid-cols-1 gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/generate-quiz"><PlusSquare className="mr-2 h-5 w-5"/> Start a Custom Quiz</Link>
            </Button>
             <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 hover:text-primary">
                <Link href="/exam-prep"><BookOpenText className="mr-2 h-5 w-5"/> Browse Exam Prep</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
