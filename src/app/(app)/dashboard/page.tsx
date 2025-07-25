
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
import { BookMarked, Trash2, Lightbulb, Eye, EyeOff, PlayCircle, Activity, Target, Zap, ArrowRight, Shapes } from "lucide-react";
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

type BookmarkedQuestion = {
  question: string;
  correctAnswer: string;
  topic: string;
};

type QuizResult = {
  topic: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
};

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<BookmarkedQuestion[]>([]);
  const [recentActivity, setRecentActivity] = useState<QuizResult[]>([]);
  const [lastQuizTopic, setLastQuizTopic] = useState<string | null>(null);
  
  const [reviewing, setReviewing] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const storedBookmarks = sessionStorage.getItem("bookmarkedQuestions");
    if (storedBookmarks) {
      setBookmarkedQuestions(JSON.parse(storedBookmarks));
    }
    const storedActivity = sessionStorage.getItem("quizResults");
    if (storedActivity) {
      const parsedActivity = JSON.parse(storedActivity);
      setRecentActivity(parsedActivity);
      if(parsedActivity.length > 0) {
        setLastQuizTopic(parsedActivity[0].topic);
      }
    }
  }, []);
  
  const clearBookmark = (questionToRemove: string) => {
    const updatedBookmarks = bookmarkedQuestions.filter(q => q.question !== questionToRemove);
    setBookmarkedQuestions(updatedBookmarks);
    sessionStorage.setItem("bookmarkedQuestions", JSON.stringify(updatedBookmarks));
  }

  const startReview = () => {
    setReviewing(true);
    setCurrentReviewIndex(0);
    setShowAnswer(false);
  }

  const nextReviewQuestion = () => {
    if(currentReviewIndex < bookmarkedQuestions.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
      setShowAnswer(false);
    } else {
      setReviewing(false);
    }
  }
  
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
  const dailyGoalProgress = Math.min((recentActivity.length / 5) * 100, 100); // Example: 5 quizzes a day goal

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user?.displayName}!</h1>
        <p className="text-muted-foreground">Let's make today a productive day. Seize the moment!</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="flex flex-col justify-between bg-card/90 backdrop-blur-sm">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Target className="text-primary"/> Daily Goal</CardTitle>
                    <CardDescription>Complete 5 quizzes today.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <Progress value={dailyGoalProgress} />
                    <p className="text-sm text-muted-foreground mt-2">{recentActivity.length} of 5 completed</p>
                 </CardContent>
              </Card>
               <Card className="flex flex-col justify-between bg-card/90 backdrop-blur-sm">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><PlayCircle className="text-primary"/> Pick up where you left off</CardTitle>
                    <CardDescription>{lastQuizTopic ? `Last quiz on: ${lastQuizTopic}` : "No recent quizzes."}</CardDescription>
                 </CardHeader>
                 <CardContent>
                     <Button asChild variant="outline" disabled={!lastQuizTopic}>
                        <Link href="/generate-quiz">Retake Quiz <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                 </CardContent>
              </Card>
              <Card className="flex flex-col justify-between bg-card/90 backdrop-blur-sm">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Zap className="text-primary"/> Quick Start</CardTitle>
                    <CardDescription>Start a new quiz in seconds.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <Button asChild>
                        <Link href="/generate-quiz">New Quiz <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                 </CardContent>
              </Card>
           </div>
            <div>
             <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
                <Shapes className="h-6 w-6"/> Topic Mastery
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {averageScores.length > 0 ? averageScores.map(item => (
                <Card key={item.topic} className="bg-card/90 backdrop-blur-sm">
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
           <Card className="bg-card/90 backdrop-blur-sm">
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
        </div>

        <div className="lg:col-span-1 space-y-8">
           <div>
             <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
              <BookMarked className="h-6 w-6" /> Bookmarked Questions
            </h2>
            <Card className="bg-card/90 backdrop-blur-sm">
              {reviewing && bookmarkedQuestions.length > 0 ? (
                 <CardContent className="pt-6">
                   <div className="p-4 bg-background rounded-lg">
                     <p className="font-semibold text-lg">{bookmarkedQuestions[currentReviewIndex].question}</p>
                     <p className="text-xs text-muted-foreground mt-1">Topic: {bookmarkedQuestions[currentReviewIndex].topic}</p>
                     
                     <div className="mt-4">
                        {showAnswer ? (
                           <div>
                            <p className="text-sm text-green-500 mt-2 font-semibold">Correct Answer: {bookmarkedQuestions[currentReviewIndex].correctAnswer}</p>
                            <Button onClick={() => setShowAnswer(false)} variant="outline" size="sm" className="mt-2"><EyeOff className="mr-2 h-4 w-4" /> Hide Answer</Button>
                           </div>
                        ) : (
                           <Button onClick={() => setShowAnswer(true)} variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" /> Show Answer</Button>
                        )}
                     </div>
                   </div>
                 </CardContent>
              ) : (
                <CardContent className="pt-6">
                   {bookmarkedQuestions.length > 0 ? (
                     <ScrollArea className="h-[200px] pr-4">
                       <ul className="space-y-4">
                          {bookmarkedQuestions.map((q, index) => (
                            <li key={index} className="p-4 bg-background rounded-lg">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-semibold pr-4">{q.question}</p>
                                  <p className="text-sm text-green-500 mt-2">Correct Answer: {q.correctAnswer}</p>
                                  <p className="text-xs text-muted-foreground mt-1">Topic: {q.topic}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => clearBookmark(q.question)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </li>
                          ))}
                       </ul>
                     </ScrollArea>
                  ) : (
                    <div className="text-center py-8">
                       <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                       <p className="text-muted-foreground">You haven't bookmarked any questions yet.</p>
                        <p className="text-xs text-muted-foreground mt-1">Bookmark questions during a quiz to review them later.</p>
                    </div>
                  )}
                </CardContent>
              )}
               <CardFooter className="flex justify-center border-t pt-4">
                  {reviewing ? (
                      <div className="flex gap-2">
                          <Button onClick={nextReviewQuestion}>
                            {currentReviewIndex < bookmarkedQuestions.length - 1 ? "Next Question" : "Finish Review"}
                          </Button>
                          <Button variant="outline" onClick={() => setReviewing(false)}>End Session</Button>
                      </div>
                  ) : (
                      <Button onClick={startReview} disabled={bookmarkedQuestions.length === 0}>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Start Review Session
                      </Button>
                  )}
              </CardFooter>
            </Card>
          </div>

           <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2"><Activity className="h-6 w-6"/> Recent Activity</h2>
            <Card className="bg-card/90 backdrop-blur-sm">
              <CardContent className="pt-6">
                {recentActivity.length > 0 ? (
                   <ScrollArea className="h-[250px] pr-4">
                     <ul className="space-y-4">
                        {recentActivity.map((activity, index) => (
                          <li key={index} className="flex justify-between items-center p-4 bg-background rounded-lg">
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
