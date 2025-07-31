
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
import { BookMarked, Trash2, Lightbulb, Eye, EyeOff, PlayCircle, Activity, Target, Zap, ArrowRight, Shapes, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/page-header";
import { get, ref, remove } from "firebase/database";
import { db } from "@/lib/firebase";
import { getBookmarks, getQuizResults, deleteBookmark, saveBookmark, saveQuizResult, BookmarkedQuestion, QuizResult } from "@/lib/indexed-db";

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

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

      // --- Step 1: Load from IndexedDB first for instant UI ---
      const [localBookmarks, localActivity] = await Promise.all([
        getBookmarks(user.uid),
        getQuizResults(user.uid)
      ]);
      
      setBookmarkedQuestionsCount(localBookmarks.length);
      setRecentActivity(localActivity);
      
      if (localActivity.length > 0) {
        setLastQuizTopic(localActivity[0].topic);
      }
      setLoading(false); // UI is now populated, stop loading spinner

      // --- Step 2: Sync with Firebase in the background ---
      const bookmarksRef = ref(db, `bookmarks/${user.uid}`);
      const activityRef = ref(db, `quizResults/${user.uid}`);

      const [bookmarksSnapshot, activitySnapshot] = await Promise.all([
          get(bookmarksRef),
          get(activityRef)
      ]);

      let firebaseBookmarksCount = 0;
      if (bookmarksSnapshot.exists()) {
          firebaseBookmarksCount = Object.keys(bookmarksSnapshot.val()).length;
          // Sync bookmarks if needed, but not strictly required for just the count
      }
      
      const firebaseActivityData: QuizResult[] = activitySnapshot.exists() ? Object.values(activitySnapshot.val()) as QuizResult[] : [];

      // Sort activity by date, descending
      firebaseActivityData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // --- Step 3: Update state and IndexedDB if Firebase has newer data ---
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

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        title={`Welcome back, ${user?.displayName?.split(' ')[0]}!`}
        description="Let's make today a productive day. Seize the moment!"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base"><Target className="text-primary"/> Daily Goal</CardTitle>
                    <CardDescription>Complete 5 quizzes today.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <Progress value={dailyGoalProgress} />
                    <p className="text-sm text-muted-foreground mt-2">{quizzesToday.length} of 5 completed</p>
                 </CardContent>
              </Card>
               <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base"><PlayCircle className="text-primary"/> Pick up</CardTitle>
                    <CardDescription>{lastQuizTopic ? `Last quiz: ${lastQuizTopic}` : "No recent quizzes."}</CardDescription>
                 </CardHeader>
                 <CardContent>
                     <Button asChild variant="outline" disabled={!lastQuizTopic} size="sm">
                        <Link href={`/generate-quiz?topic=${encodeURIComponent(lastQuizTopic || '')}`}>Retake Quiz <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                 </CardContent>
              </Card>
              <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base"><Zap className="text-primary"/> Quick Start</CardTitle>
                    <CardDescription>Start a new quiz in seconds.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <Button asChild size="sm">
                        <Link href="/generate-quiz">New Quiz <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                 </CardContent>
              </Card>
           </div>
           
           <Card>
             <CardHeader>
               <CardTitle>Recent Score Trend</CardTitle>
               <CardDescription>Your scores on the last 10 quizzes.</CardDescription>
             </CardHeader>
             <CardContent>
                {scoreTrend.length > 0 ? (
                  <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                    <LineChart accessibilityLayer data={scoreTrend}>
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
           
           <div>
             <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
                <Shapes className="h-6 w-6"/> Topic Mastery
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {averageScores.length > 0 ? averageScores.map(item => (
                <Card key={item.topic}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{item.topic}</h3>
                      <p className="text-sm font-bold text-primary">{item.averageScore.toFixed(0)}%</p>
                    </div>
                    <Progress value={item.averageScore} />
                  </CardContent>
                </Card>
              )) : (
                 <p className="text-muted-foreground text-center py-10 col-span-2">Take some quizzes to see your topic mastery.</p>
              )}
             </div>
           </div>

        </div>

        <div className="lg:col-span-1 space-y-8">
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

           <div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
