
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Target, BookOpenText, PlusSquare, Brain, BarChart, Trophy, Bookmark, Sparkles, ArrowRight, BookMarked } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/page-header";
import { getQuizResults, QuizResult, getBookmarks } from "@/lib/indexed-db";
import { generateDashboardInsights, GenerateDashboardInsightsOutput } from "@/ai/flows/generate-dashboard-insights";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { motion, type Variants } from "framer-motion";
import { usePlan } from "@/hooks/usePlan";

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

function UpgradeCard() {
    const { plan } = usePlan();

    if (plan === 'Pro') {
        return null;
    }

    return (
        <motion.div variants={itemVariants}>
        <Card className="bg-accent text-accent-foreground shadow-lg">
             <CardHeader className="flex-row items-start gap-4">
                <div className="p-2 bg-background/20 rounded-full">
                    <Sparkles className="h-5 w-5"/>
                </div>
                <div>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription className="text-accent-foreground/80 mt-1">Unlock higher quality answers, no ads, and priority support.</CardDescription>
                </div>
            </CardHeader>
            <CardFooter>
                 <Button asChild variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                    <Link href="/pricing">View Plans <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
            </CardFooter>
        </Card>
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
  );
}

function TopicPerformanceChart({ data }: { data: QuizResult[] }) {
    const topicStats: { [key: string]: { totalScore: number; count: number } } = {};

    data.forEach(result => {
        if (!topicStats[result.topic]) {
            topicStats[result.topic] = { totalScore: 0, count: 0 };
        }
        topicStats[result.topic].totalScore += result.percentage;
        topicStats[result.topic].count++;
    });

    const chartData = Object.keys(topicStats).map(topic => ({
        topic,
        averageScore: topicStats[topic].totalScore / topicStats[topic].count,
    }));

    if (chartData.length === 0) {
        return <p className="text-muted-foreground text-center py-8">No stats to display yet.</p>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={chartData} layout="vertical" margin={{ left: 25 }}>
                <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <YAxis dataKey="topic" type="category" width={80} tick={{ fontSize: 12 }} interval={0} />
                <Tooltip
                    cursor={{ fill: 'hsla(var(--muted))' }}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <p className="text-sm font-medium">{`${payload[0].payload.topic}`}</p>
                                    <p className="text-sm text-primary">{`Avg. Score: ${payload[0].value?.toFixed(0)}%`}</p>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
                <Bar dataKey="averageScore" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </RechartsBarChart>
        </ResponsiveContainer>
    );
}

function AchievementsTab({ recentActivity, bookmarksCount }: { recentActivity: QuizResult[], bookmarksCount: number }) {
    const getStreak = (results: QuizResult[]): number => {
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

    const achievements = [
        { name: 'First Quiz', description: 'Complete your first quiz', unlocked: recentActivity.length > 0 },
        { name: '3-Day Streak', description: 'Maintain a 3-day study streak', unlocked: getStreak(recentActivity) >= 3 },
        { name: 'High Scorer', description: 'Score 90% or more on a quiz', unlocked: recentActivity.some(q => q.percentage >= 90) },
        { name: 'Bookworm', description: 'Bookmark 5 or more questions', unlocked: bookmarksCount >= 5 },
        { name: 'Dedicated Learner', description: 'Complete 10 quizzes', unlocked: recentActivity.length >= 10 },
        { name: 'Master Quizzer', description: 'Complete 50 quizzes', unlocked: recentActivity.length >= 50 },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((ach, index) => (
                <Card key={index} className={!ach.unlocked ? 'opacity-50' : ''}>
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="p-3 bg-primary/10 rounded-full mb-3">
                           <Trophy className="h-8 w-8 text-primary" />
                        </div>
                        <p className="font-semibold text-sm">{ach.name}</p>
                        <p className="text-xs text-muted-foreground">{ach.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
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
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">My Stats</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" asChild>
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <UpgradeCard />
            <motion.div variants={itemVariants}>
              <AiInsightsCard recentActivity={recentActivity} userName={user?.displayName?.split(' ')[0] || 'Student'} />
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 gap-4"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
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
              <motion.div variants={itemVariants}>
                <Card className="p-4 shadow-sm">
                  <CardHeader className="p-0 flex-row items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground"/>
                      <CardTitle className="text-base font-semibold">Today's Goal</CardTitle>
                  </Header>
                  <CardContent className="p-0 mt-2">
                    <Progress value={dailyGoalProgress} className="h-2 mb-1" />
                    <p className="text-sm text-muted-foreground">{quizzesToday.length} of 5 Quizzes</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          
            <motion.div variants={itemVariants}>
              <Card>
                  <CardHeader>
                      <CardTitle>Bookmarked Questions</CardTitle>
                      <CardDescription>Questions you've saved to review later.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary/10 rounded-full">
                            <BookMarked className="h-8 w-8 text-primary"/>
                          </div>
                          <div>
                              <p className="text-2xl font-bold">{bookmarksCount}</p>
                              <p className="text-sm text-muted-foreground">questions bookmarked</p>
                          </div>
                      </div>
                  </CardContent>
                  <CardFooter>
                      <Button asChild variant="outline">
                          <Link href="/bookmarks">Review Bookmarks</Link>
                      </Button>
                  </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="stats" asChild>
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
              <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle>Topic Performance</CardTitle>
                        <CardDescription>Your average scores across different topics.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TopicPerformanceChart data={recentActivity} />
                    </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
              <Card>
                  <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>A log of your most recent quizzes.</CardDescription>
                  </Header>
                  <CardContent>
                      {recentActivity.length > 0 ? (
                          <ul className="space-y-3">
                              {recentActivity.slice(0, 10).map(activity => (
                                  <li key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                      <div>
                                          <p className="font-semibold">{activity.topic}</p>
                                          <p className="text-sm text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</p>
                                      </div>
                                      <Badge variant={activity.percentage >= 50 ? 'default' : 'destructive'} className="bg-primary">{activity.percentage.toFixed(0)}%</Badge>
                                  </li>
                              ))}
                          </ul>
                      ) : (
                          <p className="text-muted-foreground text-center py-8">No recent activity to display.</p>
                      )}
                  </CardContent>
              </Card>
              </motion.div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="achievements" asChild>
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
                <CardHeader>
                    <CardTitle>Your Achievements</CardTitle>
                    <CardDescription>Milestones you've unlocked on your learning journey.</CardDescription>
                </Header>
                <CardContent>
                    <AchievementsTab recentActivity={recentActivity} bookmarksCount={bookmarksCount} />
                </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Jump Right In</h2>
        <motion.div 
            className="grid grid-cols-1 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={itemVariants}>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full">
                <Link href="/generate-quiz"><PlusSquare className="mr-2 h-5 w-5"/> Start a Custom Quiz</Link>
            </Button>
            </motion.div>
             <motion.div variants={itemVariants}>
             <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 hover:text-primary w-full">
                <Link href="/exam-prep"><BookOpenText className="mr-2 h-5 w-5"/> Browse Exam Prep</Link>
            </Button>
            </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
