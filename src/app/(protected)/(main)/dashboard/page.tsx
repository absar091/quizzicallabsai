"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Target, BookOpenText, PlusSquare, Brain, BarChart, Trophy, Bookmark, Sparkles, ArrowRight, BookMarked, Clock, TrendingUp, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/page-header";
import { getQuizResults, QuizResult, getBookmarks } from "@/lib/indexed-db";
// Dynamic import for AI insights
type GenerateDashboardInsightsOutput = any;
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { motion, type Variants } from "framer-motion";
import { usePlan } from "@/hooks/usePlan";
import { sanitizeString } from "@/lib/sanitize";
import { StudyStreakWidget } from "@/components/study-streak-widget";
import { QuizAccessDialog } from "@/components/quiz-sharing";
import { AdminAccess } from "@/components/admin-access";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

function AiInsightsCard({ recentActivity, userName, userPlan }: { recentActivity: QuizResult[], userName: string, userPlan: string }) {
  const [insights, setInsights] = useState<GenerateDashboardInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (!isMounted) return;
    
    async function fetchInsights() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/ai/dashboard-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: userName, 
            quizHistory: recentActivity,
            isPro: userPlan === 'Pro'
          })
        });
        
        if (!response.ok) throw new Error('Failed to generate insights');
        const result = await response.json();
        setInsights(result);
      } catch (error) {
        console.error("Failed to fetch AI insights:", error);
        setInsights({ 
          greeting: `Hi, ${userName}!`, 
          observation: "Ready to boost your learning?", 
          suggestion: "Start with a custom quiz to track your progress.", 
          suggestedAction: { buttonText: "Create Quiz", link: "/generate-quiz" } 
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchInsights();
  }, [recentActivity, userName, isMounted]);
  
  if (!isMounted) {
    return (
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
        <div className="flex items-center gap-3 mb-3">
          <Brain className="h-5 w-5"/>
          <CardTitle className="text-lg font-semibold">AI Study Assistant</CardTitle>
        </div>
        <CardDescription className="text-primary-foreground/90 text-base mb-6">
          Ready to boost your learning? Start with a custom quiz to track your progress.
        </CardDescription>
        <Button variant="secondary" asChild className="bg-white/20 text-white hover:bg-white/30">
          <Link href="/generate-quiz">Create Quiz</Link>
        </Button>
      </Card>
    );
  }

  if (isLoading) {
    return (
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
            <Skeleton className="h-6 w-3/4 bg-primary-foreground/20" />
            <Skeleton className="h-4 w-full mt-3 bg-primary-foreground/20" />
            <Skeleton className="h-10 w-48 mt-6 bg-primary-foreground/20" />
        </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
        <div className="flex items-center gap-3 mb-3">
             <Brain className="h-5 w-5"/>
             <CardTitle className="text-lg font-semibold">AI Study Assistant</CardTitle>
        </div>
      <CardDescription className="text-primary-foreground/90 text-base mb-6">
        {insights?.observation} {insights?.suggestion}
      </CardDescription>
      {insights?.suggestedAction && (
        <Button variant="secondary" asChild className="bg-white/20 text-white hover:bg-white/30">
          <Link href={insights.suggestedAction.link}>{insights.suggestedAction.buttonText}</Link>
        </Button>
      )}
    </Card>
  );
}

function PerformanceChart({ data }: { data: QuizResult[] }) {
    const chartData = data.slice(-14).map(result => ({
        date: new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: result.percentage,
        topic: result.topic
    }));

    if (chartData.length === 0) {
        return <p className="text-muted-foreground text-center py-8">Take some quizzes to see your progress!</p>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip />
                <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default function HomePage() {
  const { user } = useAuth();
  const { plan } = usePlan();
  const [recentActivity, setRecentActivity] = useState<QuizResult[]>([]);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  
  useEffect(() => {
    async function loadData() {
      if (!user) return;
      const localActivity = await getQuizResults(user.uid);
      setRecentActivity(localActivity);
      const localBookmarks = await getBookmarks(user.uid);
      setBookmarksCount(localBookmarks.length);
    }
    if (user) loadData();
  }, [user]);

  const last14Days = recentActivity.filter(activity => {
    const resultDate = new Date(activity.date);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    return resultDate >= fourteenDaysAgo;
  });

  const quizzesToday = recentActivity.filter(activity => 
    new Date(activity.date) >= new Date(new Date().setHours(0,0,0,0))
  );
  
  const dailyGoalProgress = Math.min((quizzesToday.length / 5) * 100, 100);
  const averageScore = recentActivity.length > 0 ? 
    Math.round(recentActivity.reduce((sum, quiz) => sum + quiz.percentage, 0) / recentActivity.length) : 0;
  const totalTime = Math.round(recentActivity.reduce((sum, quiz) => sum + (quiz.timeTaken || 0), 0) / 60);
  
  const calculateStreak = (results: QuizResult[]): number => {
    if (results.length === 0) return 0;
    const uniqueDays = new Set<string>();
    results.forEach(result => { uniqueDays.add(new Date(result.date).toDateString()); });
    const sortedDays = Array.from(uniqueDays).map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (sortedDays.some(d => d.toDateString() === today.toDateString()) || 
        sortedDays.some(d => d.toDateString() === yesterday.toDateString())) {
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
      <PageHeader title="Home" description={`Welcome back, ${sanitizeString(user?.displayName?.split(' ')[0] || 'Student')}! Here's your learning overview.`} className="mb-0"/>
      
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {plan === 'Free' && (
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardHeader className="flex-row items-start gap-4">
                <div className="p-2 bg-primary/20 rounded-full">
                  <Sparkles className="h-5 w-5 text-primary"/>
                </div>
                <div>
                  <CardTitle>Upgrade to Pro</CardTitle>
                  <CardDescription className="mt-1">Get advanced AI model, higher accuracy, and ad-free experience.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild variant="default" size="sm">
                  <Link href="/billing">Upgrade Now <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {typeof window !== 'undefined' && (
          <motion.div variants={itemVariants}>
            <AiInsightsCard 
              recentActivity={last14Days} 
              userName={sanitizeString(user?.displayName?.split(' ')[0] || 'Student')}
              userPlan={user?.plan || 'Free'}
            />
          </motion.div>
        )}

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="md:col-span-1">
            <StudyStreakWidget />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-500"/>
                <span className="text-sm font-medium">Avg Score</span>
              </div>
              <p className="text-2xl font-bold">{averageScore}%</p>
              <p className="text-xs text-muted-foreground">{recentActivity.length} quizzes</p>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-green-500"/>
                <span className="text-sm font-medium">Study Time</span>
              </div>
              <p className="text-2xl font-bold">{totalTime}</p>
              <p className="text-xs text-muted-foreground">minutes total</p>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookMarked className="h-4 w-4 text-purple-500"/>
                <span className="text-sm font-medium">Bookmarks</span>
              </div>
              <p className="text-2xl font-bold">{bookmarksCount}</p>
              <p className="text-xs text-muted-foreground">saved questions</p>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary"/>
                <h3 className="font-semibold">Today's Goal</h3>
              </div>
              <Badge variant={dailyGoalProgress === 100 ? "default" : "secondary"}>
                {quizzesToday.length}/5 Quizzes
              </Badge>
            </div>
            <Progress value={dailyGoalProgress} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">
              {dailyGoalProgress === 100 ? "🎉 Goal completed! Great job!" : `${5 - quizzesToday.length} more quizzes to reach your daily goal`}
            </p>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5"/>
                Performance Trend (Last 14 Days)
              </CardTitle>
              <CardDescription>Track your quiz scores over time</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceChart data={last14Days} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusSquare className="h-5 w-5"/>
                Quick Actions
              </CardTitle>
              <CardDescription>Jump into your favorite study tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Button asChild variant="outline" className="h-20 flex-col gap-2">
                  <Link href="/generate-quiz">
                    <PlusSquare className="h-6 w-6"/>
                    <span className="text-sm">Custom Quiz</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col gap-2">
                  <Link href="/generate-study-guide">
                    <BookOpenText className="h-6 w-6"/>
                    <span className="text-sm">Study Guide</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col gap-2">
                  <Link href="/generate-from-file">
                    <BookMarked className="h-6 w-6"/>
                    <span className="text-sm">Quiz from File</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col gap-2">
                  <Link href="/bookmarks">
                    <Bookmark className="h-6 w-6"/>
                    <span className="text-sm">Bookmarks</span>
                  </Link>
                </Button>
                <QuizAccessDialog />
                <AdminAccess />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}