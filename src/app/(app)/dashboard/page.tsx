
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
import { BookMarked, Lightbulb, PlayCircle, Activity, Target, Zap, ArrowRight, Shapes, Sparkles, BrainCircuit, MessageSquareQuote, Flame } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

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

function AiInsightsCard({ recentActivity, userName }: { recentActivity: QuizResult[], userName: string }) {
  const [insights, setInsights] = useState<GenerateDashboardInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchInsights() {
      setIsLoading(true);
      try {
        const result = await generateDashboardInsights({
          userName: userName,
          quizHistory: recentActivity,
        });
        setInsights(result);
      } catch (error) {
        console.error("Failed to fetch AI insights:", error);
        // Set a default state on error
        setInsights({
          greeting: `Welcome, ${userName}!`,
          observation: "Ready to start learning?",
          suggestion: "Pick a quiz to get started.",
          suggestedAction: {
            buttonText: "New Quiz",
            link: "/generate-quiz",
          }
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchInsights();
  }, [recentActivity, userName]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-48" />
        </CardContent>
      </Card>
    )
  }
  
  if (!insights) return null;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <MessageSquareQuote /> Your AI Coach
        </CardTitle>
        <CardDescription>
          {insights.greeting} {insights.observation} {insights.suggestion}
        </CardDescription>
      </CardHeader>
      {insights.suggestedAction && (
        <CardContent>
          <Button asChild>
            <Link href={insights.suggestedAction.link}>
              {insights.suggestedAction.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      )}
    </Card>
  )
}

const calculateStreak = (results: QuizResult[]): number => {
    if (results.length === 0) return 0;

    const uniqueDays = new Set<string>();
    results.forEach(result => {
        uniqueDays.add(new Date(result.date).toDateString());
    });

    const sortedDays = Array.from(uniqueDays).map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (sortedDays.some(d => d.toDateString() === today.toDateString())) {
        streak = 1;
        let lastDate = today;

        for (let i = 0; i < sortedDays.length; i++) {
            const currentDate = sortedDays[i];
            const expectedPreviousDay = new Date(lastDate);
            expectedPreviousDay.setDate(lastDate.getDate() - 1);

            if (currentDate.toDateString() === expectedPreviousDay.toDateString()) {
                if (i > 0) streak++;
                lastDate = currentDate;
            } else if (currentDate < expectedPreviousDay) {
                if (i === 0 && sortedDays[0].toDateString() !== today.toDateString()) {
                   if (sortedDays[0].toDateString() === yesterday.toDateString()) {
                        streak = 1;
                        lastDate = sortedDays[0];
                        continue;
                   } else {
                       return 0; // Streak is broken
                   }
                }
            }
        }
    } else if (sortedDays.some(d => d.toDateString() === yesterday.toDateString())) {
         streak = 1;
         let lastDate = yesterday;
         for (let i = 0; i < sortedDays.length; i++) {
             const currentDate = sortedDays[i];
             const expectedPreviousDay = new Date(lastDate);
             expectedPreviousDay.setDate(lastDate.getDate() - 1);
             if (currentDate.toDateString() === expectedPreviousDay.toDateString()) {
                 streak++;
                 lastDate = currentDate;
             }
         }
    }

    return streak;
};


export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookmarkedQuestionsCount, setBookmarkedQuestionsCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<QuizResult[]>([]);
  const [lastQuizTopic, setLastQuizTopic] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadData() {
      if (!user) return;

      setLoading(true);

      const [localBookmarks, localActivity] = await Promise.all([
        getBookmarks(user.uid),
        getQuizResults(user.uid)
      ]);
      
      setBookmarkedQuestionsCount(localBookmarks.length);
      setRecentActivity(localActivity);
      
      if (localActivity.length > 0) {
        setLastQuizTopic(localActivity[0].topic);
      }
      setLoading(false);

      const bookmarksRef = ref(db, `bookmarks/${user.uid}`);
      const activityRef = ref(db, `quizResults/${user.uid}`);

      const [bookmarksSnapshot, activitySnapshot] = await Promise.all([
          get(bookmarksRef),
          get(activityRef)
      ]);

      let firebaseBookmarksCount = 0;
      if (bookmarksSnapshot.exists()) {
          firebaseBookmarksCount = Object.keys(bookmarksSnapshot.val()).length;
      }
      
      const firebaseActivityData: QuizResult[] = activitySnapshot.exists() ? Object.values(activitySnapshot.val()) as QuizResult[] : [];
      firebaseActivityData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      if (firebaseBookmarksCount > localBookmarks.length) {
          setBookmarkedQuestionsCount(firebaseBookmarksCount);
      }
      if (firebaseActivityData.length > localActivity.length) {
          setRecentActivity(firebaseActivityData);
          if (firebaseActivityData.length > 0) {
            setLastQuizTopic(firebaseActivityData[0].topic);
          }
          for (const result of firebaseActivityData) { await saveQuizResult(result); }
      }
    }

    loadData();
  }, [user]);

  const processChartData = () => {
    const topicScores: {[key: string]: {totalScore: number, count: number}} = {};
    recentActivity.forEach(activity => {
        if(!topicScores[activity.topic]){
            topicScores[activity.topic] = { totalScore: 0, count: 0 };
        }
        topicScores[activity.topic].totalScore += activity.percentage;
        topicScores[activity.topic].count++;
    });

    const averageScores = Object.keys(topicScores).map(topic => ({
        topic,
        averageScore: topicScores[topic].totalScore / topicScores[topic].count
    }));

    const scoreTrend = recentActivity.slice(0, 10).reverse().map((activity, index) => ({
      name: `Quiz ${index + 1}`,
      score: activity.percentage,
      topic: activity.topic,
    }));
    
    return { averageScores, scoreTrend };
  }
  
  const { averageScores, scoreTrend } = processChartData();
  
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const quizzesToday = recentActivity.filter(activity => new Date(activity.date) >= todayStart);
  const dailyGoalProgress = Math.min((quizzesToday.length / 5) * 100, 100);
  const streak = calculateStreak(recentActivity);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60svh] text-center p-4">
        <div className="relative">
            <BrainCircuit className="h-20 w-20 text-primary" />
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
                <Sparkles className="h-8 w-8 text-accent animate-pulse" />
            </motion.div>
        </div>
        <h2 className="text-2xl font-semibold mb-2 mt-6">Loading Dashboard...</h2>
        <p className="text-muted-foreground max-w-sm mb-6">Fetching your latest progress and stats.</p>
      </div>
    );
  }

  return (
    <motion.div 
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <PageHeader 
          title={`Welcome back, ${user?.displayName?.split(' ')[0]}!`}
          description="Let's make today a productive day. Seize the moment!"
        />
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
           <motion.div variants={itemVariants}>
                <AiInsightsCard recentActivity={recentActivity} userName={user?.displayName?.split(' ')[0] || 'Student'} />
           </motion.div>

           <motion.div 
             variants={containerVariants}
             className="grid grid-cols-1 md:grid-cols-3 gap-6"
           >
                <motion.div variants={itemVariants} whileHover="hover" whileTap="tap">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base"><Flame className="text-primary"/> Daily Streak</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{streak} <span className="text-lg font-medium text-muted-foreground">day{streak !== 1 ? 's' : ''}</span></p>
                        </CardContent>
                    </Card>
                </motion.div>
              <motion.div variants={itemVariants} whileHover="hover" whileTap="tap">
                 <Card className="h-full">
                   <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base"><Target className="text-primary"/> Daily Goal</CardTitle>
                   </CardHeader>
                   <CardContent>
                      <Progress value={dailyGoalProgress} />
                      <p className="text-sm text-muted-foreground mt-2">{quizzesToday.length} of 5 completed</p>
                   </CardContent>
                 </Card>
              </motion.div>
              <motion.div variants={itemVariants} whileHover="hover" whileTap="tap">
                 <Card className="h-full">
                   <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base"><Zap className="text-primary"/> Quick Start</CardTitle>
                   </CardHeader>
                   <CardContent>
                      <Button asChild size="sm">
                          <Link href="/generate-quiz">New Quiz <ArrowRight className="ml-2 h-4 w-4"/></Link>
                      </Button>
                   </CardContent>
                 </Card>
              </motion.div>
           </motion.div>
           
           <motion.div variants={itemVariants}>
             <Card>
               <CardHeader>
                 <CardTitle>Recent Score Trend</CardTitle>
                 <CardDescription>Your scores on the last 10 quizzes.</CardDescription>
               </CardHeader>
               <CardContent>
                  {scoreTrend.length > 0 ? (
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                      <LineChart
                        accessibilityLayer
                        data={scoreTrend}
                        margin={{
                          left: 12,
                          right: 12,
                        }}
                      >
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                          <YAxis unit="%" domain={[0,100]} />
                          <ChartTooltip 
                            cursor={false}
                            content={<ChartTooltipContent 
                              indicator="dot"
                              formatter={(value, name, props) => [`${props.payload.topic}: ${(value as number).toFixed(2)}%`, null]}
                            />}
                          />
                          <Line type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={2} dot={true} />
                        </LineChart>
                    </ChartContainer>
                  ) : <p className="text-muted-foreground text-center py-10">Your score trend will appear here.</p>}
               </CardContent>
             </Card>
           </motion.div>
           
           <motion.div variants={itemVariants}>
             <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
                <Shapes className="h-6 w-6"/> Topic Mastery
             </h2>
             <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {averageScores.length > 0 ? averageScores.map(item => (
                <motion.div key={item.topic} variants={itemVariants}>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold">{item.topic}</h3>
                          <div className="text-sm font-bold text-primary">{item.averageScore.toFixed(0)}%</div>
                        </div>
                        <Progress value={item.averageScore} />
                      </CardContent>
                    </Card>
                </motion.div>
              )) : (
                 <div className="text-center py-10 col-span-2">
                    <p className="text-muted-foreground">Take some quizzes to see your topic mastery.</p>
                 </div>
              )}
             </motion.div>
           </motion.div>

        </div>

        <div className="lg:col-span-1 space-y-8">
           <motion.div variants={itemVariants} whileHover="hover" whileTap="tap">
             <Card>
              <CardHeader className="flex-row items-center justify-between">
                  <div>
                     <CardTitle className="flex items-center gap-2">
                        <BookMarked /> Bookmarked
                     </CardTitle>
                     <CardDescription>
                         Review questions you saved.
                     </CardDescription>
                  </div>
                   <h2 className="text-3xl font-bold text-primary">{bookmarkedQuestionsCount}</h2>
              </CardHeader>
              <CardContent>
                  {bookmarkedQuestionsCount > 0 ? (
                      <p className="text-sm text-muted-foreground">You have {bookmarkedQuestionsCount} questions saved for review. Keep it up!</p>
                  ) : (
                      <div className="text-center py-4">
                         <Lightbulb className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
                         <p className="text-muted-foreground">You haven't bookmarked any questions yet.</p>
                         <p className="text-xs text-muted-foreground mt-1">Bookmark questions during a quiz to review them later.</p>
                      </div>
                  )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                  <Button asChild className="w-full">
                      <Link href="/bookmarks">
                         <PlayCircle className="mr-2 h-4 w-4" /> Go to Bookmarks
                      </Link>
                  </Button>
              </CardFooter>
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
                  <div className="text-center py-8">
                     <p className="text-muted-foreground">No recent activity.</p>
                     <p className="text-xs text-muted-foreground mt-1">Take a quiz to get started!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
