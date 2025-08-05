
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookMarked, Lightbulb, PlayCircle, Activity, Target, Zap, ArrowRight, Shapes, Sparkles, BrainCircuit, MessageSquareQuote, Flame, Trophy, BarChart2, Star, BookOpen, CheckCircle, Crosshair, Brain } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/page-header";
import { get, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import { getBookmarks, getQuizResults, saveQuizResult, QuizResult } from "@/lib/indexed-db";
import { motion } from "framer-motion";
import { generateDashboardInsights, GenerateDashboardInsightsOutput } from "@/ai/flows/generate-dashboard-insights";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// --- Tab Components ---

const chartConfig = {
  averageScore: {
    label: "Average Score",
    color: "hsl(var(--primary))",
  },
  score: {
    label: "Score",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
        duration: 0.5,
        ease: "easeOut"
    }
  },
};

const cardHover = {
    hover: { scale: 1.03, transition: { duration: 0.2 } },
    tap: { scale: 0.98 }
}

function OverviewTab({ recentActivity, user, bookmarksCount }: { recentActivity: QuizResult[], user: any, bookmarksCount: number }) {
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
    <motion.div 
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
    >
      <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <AiInsightsCard recentActivity={recentActivity} userName={user?.displayName?.split(' ')[0] || 'Student'} />
          </motion.div>
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} whileHover="hover" whileTap="tap">
              <Card className="h-full">
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Flame className="text-primary"/> Daily Streak</CardTitle></CardHeader>
                <CardContent><p className="text-4xl font-bold">{streak} <span className="text-lg font-medium text-muted-foreground">day{streak !== 1 ? 's' : ''}</span></p></CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants} whileHover="hover" whileTap="tap">
              <Card className="h-full">
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Target className="text-primary"/> Daily Goal</CardTitle></CardHeader>
                <CardContent>
                  <Progress value={dailyGoalProgress} />
                  <p className="text-sm text-muted-foreground mt-2">{quizzesToday.length} of 5 completed</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants} whileHover="hover" whileTap="tap">
              <Card className="h-full">
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Zap className="text-primary"/> Quick Start</CardTitle></CardHeader>
                <CardContent><Button asChild size="sm"><Link href="/generate-quiz">New Quiz <ArrowRight className="ml-2 h-4 w-4"/></Link></Button></CardContent>
              </Card>
            </motion.div>
          </motion.div>
          <motion.div variants={itemVariants} whileHover="hover" whileTap="tap">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><BookMarked /> Bookmarked</CardTitle>
                  <CardDescription>Review questions you saved.</CardDescription>
                </div>
                <h2 className="text-3xl font-bold text-primary">{bookmarksCount}</h2>
              </CardHeader>
              <CardFooter className="border-t pt-4"><Button asChild className="w-full"><Link href="/bookmarks"><PlayCircle className="mr-2 h-4 w-4" /> Go to Bookmarks</Link></Button></CardFooter>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2"><Activity className="h-6 w-6"/> Recent Activity</h2>
            <Card>
              <CardContent className="pt-6">
                {recentActivity.length > 0 ? (
                  <ScrollArea className="h-[250px] pr-4">
                    <ul className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <li key={index} className="flex justify-between items-center p-4 bg-muted rounded-lg">
                          <div>
                            <p className="font-semibold">{activity.topic}</p>
                            <p className="text-sm text-muted-foreground">Score: {activity.score}/{activity.total} ({activity.percentage.toFixed(2)}%)</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</p>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8"><p className="text-muted-foreground">No recent activity.</p></div>
                )}
              </CardContent>
            </Card>
          </motion.div>
      </div>
    </motion.div>
  );
}

function StatsTab({ quizHistory }: { quizHistory: QuizResult[] }) {
  const processData = () => {
    if (quizHistory.length === 0) {
      return { totalQuizzes: 0, averageScore: 0, topicPerformance: [], scoreTrend: [] };
    }
    const totalQuizzes = quizHistory.length;
    const averageScore = quizHistory.reduce((acc, curr) => acc + curr.percentage, 0) / totalQuizzes;
    const topicMap: { [key: string]: { totalScore: number; count: number } } = {};
    quizHistory.forEach(result => {
      if (!topicMap[result.topic]) topicMap[result.topic] = { totalScore: 0, count: 0 };
      topicMap[result.topic].totalScore += result.percentage;
      topicMap[result.topic].count++;
    });
    const topicPerformance = Object.entries(topicMap).map(([topic, data]) => ({ name: topic, averageScore: data.totalScore / data.count }));
    const scoreTrend = quizHistory.slice(0, 20).reverse().map((result, index) => ({ name: `Quiz ${quizHistory.length - 19 + index}`, score: result.percentage }));
    return { totalQuizzes, averageScore, topicPerformance, scoreTrend };
  };

  const { totalQuizzes, averageScore, topicPerformance, scoreTrend } = processData();

  if (quizHistory.length === 0) {
    return <Card className="text-center py-16"><CardHeader><CardTitle>No Stats Yet!</CardTitle><CardDescription>Complete a quiz to start tracking your performance.</CardDescription></CardHeader></Card>
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants}><Card><CardHeader className="flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Quizzes</CardTitle><BookOpen className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{totalQuizzes}</div></CardContent></Card></motion.div>
        <motion.div variants={itemVariants}><Card><CardHeader className="flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Average Score</CardTitle><Trophy className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div></CardContent></Card></motion.div>
        <motion.div variants={itemVariants}><Card><CardHeader className="flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Best Topic</CardTitle><Sparkles className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold truncate">{topicPerformance.length > 0 ? [...topicPerformance].sort((a,b) => b.averageScore - a.averageScore)[0].name : 'N/A'}</div></CardContent></Card></motion.div>
      </motion.div>
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Topic Performance</CardTitle>
            <CardDescription>Your average score in different topics.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <BarChart data={topicPerformance} margin={{ top: 5, right: 20, left: -5, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 15) + (value.length > 15 ? '...' : '')} />
                <YAxis unit="%" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="averageScore" fill="var(--color-averageScore)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Score Trend</CardTitle>
            <CardDescription>Your performance over the last 20 quizzes.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
              <LineChart data={scoreTrend} margin={{ top: 5, right: 20, left: -5, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" />
                <YAxis unit="%" domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={2} dot={true} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function AchievementsTab({ quizHistory }: { quizHistory: QuizResult[] }) {
    const unlockedAchievements = new Set<string>();
    achievementsList.forEach(ach => {
        if (ach.isUnlocked(quizHistory)) {
            unlockedAchievements.add(ach.id);
        }
    });

  return (
    <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
    >
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
              <UiTooltip key={ach.id}>
                <TooltipTrigger asChild>
                  <motion.div variants={itemVariants}>
                    <Card className={cn("flex flex-col items-center justify-center text-center p-6 aspect-square transition-all duration-300", isUnlocked ? "bg-primary/10 border-primary shadow-md" : "bg-muted/50")}>
                      <div className={cn("flex h-16 w-16 items-center justify-center rounded-full mb-4 transition-colors", isUnlocked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                        <ach.icon className="h-8 w-8" />
                      </div>
                      <h3 className={cn("font-semibold", isUnlocked ? "text-primary" : "text-foreground")}>{ach.title}</h3>
                    </Card>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{ach.description}</p>
                </TooltipContent>
              </UiTooltip>
            );
          })}
        </motion.div>
      </TooltipProvider>
    </motion.div>
  );
}

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
        setInsights({ greeting: `Welcome, ${userName}!`, observation: "Ready to start learning?", suggestion: "Pick a quiz to get started.", suggestedAction: { buttonText: "New Quiz", link: "/generate-quiz" } });
      } finally {
        setIsLoading(false);
      }
    }
    fetchInsights();
  }, [recentActivity, userName]);

  if (isLoading) return <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-10 w-48" /></CardContent></Card>
  if (!insights) return null;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary"><MessageSquareQuote /> Your AI Coach</CardTitle>
        <CardDescription>{insights.greeting} {insights.observation} {insights.suggestion}</CardDescription>
      </CardHeader>
      {insights.suggestedAction && <CardContent><Button asChild><Link href={insights.suggestedAction.link}>{insights.suggestedAction.buttonText} <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></CardContent>}
    </Card>
  )
}

// --- Main Page Component ---
export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<QuizResult[]>([]);
  
  useEffect(() => {
    async function loadData() {
      if (!user) return;
      setLoading(true);
      const [localBookmarks, localActivity] = await Promise.all([getBookmarks(user.uid), getQuizResults(user.uid)]);
      setBookmarksCount(localBookmarks.length);
      setRecentActivity(localActivity);
      setLoading(false);

      const [bookmarksSnapshot, activitySnapshot] = await Promise.all([get(ref(db, `bookmarks/${user.uid}`)), get(ref(db, `quizResults/${user.uid}`))]);
      const firebaseBookmarksCount = bookmarksSnapshot.exists() ? Object.keys(bookmarksSnapshot.val()).length : 0;
      const firebaseActivityData: QuizResult[] = activitySnapshot.exists() ? Object.values(activitySnapshot.val()) as QuizResult[] : [];
      firebaseActivityData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      if (firebaseBookmarksCount > localBookmarks.length) setBookmarksCount(firebaseBookmarksCount);
      if (firebaseActivityData.length > localActivity.length) {
          setRecentActivity(firebaseActivityData);
          for (const result of firebaseActivityData) { await saveQuizResult(result); }
      }
    }
    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60svh] text-center p-4">
        <div className="relative"><BrainCircuit className="h-20 w-20 text-primary" /><motion.div className="absolute inset-0 flex items-center justify-center" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}><Sparkles className="h-8 w-8 text-accent animate-pulse" /></motion.div></div>
        <h2 className="text-2xl font-semibold mb-2 mt-6">Loading Dashboard...</h2>
        <p className="text-muted-foreground max-w-sm mb-6">Fetching your latest progress and stats.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader title={`Welcome back, ${user?.displayName?.split(' ')[0]}!`} description="Let's make today a productive day. Seize the moment!" />
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">My Stats</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <OverviewTab recentActivity={recentActivity} user={user} bookmarksCount={bookmarksCount} />
        </TabsContent>
        <TabsContent value="stats" className="space-y-4">
          <StatsTab quizHistory={recentActivity} />
        </TabsContent>
        <TabsContent value="achievements" className="space-y-4">
          <AchievementsTab quizHistory={recentActivity} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
