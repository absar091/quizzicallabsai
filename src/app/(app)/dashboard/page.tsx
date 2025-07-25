
"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookMarked, Trash2, Lightbulb, Eye, EyeOff, PlayCircle, Activity } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { ChartTooltipContent } from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export default function DashboardPage() {
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<BookmarkedQuestion[]>([]);
  const [recentActivity, setRecentActivity] = useState<QuizResult[]>([]);
  
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
      setRecentActivity(JSON.parse(storedActivity));
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

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's your progress and activity."
      />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Column for Analytics */}
        <div className="lg:col-span-3 space-y-8">
           <div>
             <h2 className="text-2xl font-bold tracking-tight mb-4">Performance Analytics</h2>
             <div className="space-y-6">
               <Card className="bg-card/80 backdrop-blur-sm">
                 <CardHeader>
                   <CardTitle>Average Score by Topic</CardTitle>
                 </CardHeader>
                 <CardContent>
                  {averageScores.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                       <BarChart data={averageScores}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="topic" />
                        <YAxis unit="%" />
                        <Tooltip 
                          content={<ChartTooltipContent 
                            nameKey="topic"
                            formatter={(value, name) => [`${(value as number).toFixed(2)}%`, name]}
                          />}
                        />
                        <Bar dataKey="averageScore" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <p className="text-muted-foreground text-center py-10">Take some quizzes to see your topic scores.</p>}
                 </CardContent>
               </Card>
               <Card className="bg-card/80 backdrop-blur-sm">
                 <CardHeader>
                   <CardTitle>Recent Score Trend</CardTitle>
                   <CardDescription>Your scores on the last 10 quizzes.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    {scoreTrend.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={scoreTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis unit="%" domain={[0,100]} />
                          <Tooltip 
                            content={<ChartTooltipContent 
                              indicator="dot"
                              formatter={(value, name, props) => [`${props.payload.topic}: ${(value as number).toFixed(2)}%`, null]}
                            />}
                           />
                          <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : <p className="text-muted-foreground text-center py-10">Your score trend will appear here.</p>}
                 </CardContent>
               </Card>
             </div>
          </div>
        </div>

        {/* Right Column for Bookmarks and Activity */}
        <div className="lg:col-span-2 space-y-8">
           <div>
             <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
              <BookMarked className="h-6 w-6" /> Bookmarked Questions
            </h2>
            <Card className="bg-card/80 backdrop-blur-sm">
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
            <Card className="bg-card/80 backdrop-blur-sm">
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
