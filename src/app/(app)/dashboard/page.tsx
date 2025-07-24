
"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookMarked, Trash2 } from "lucide-react";
import type { Quiz } from "@/app/(app)/generate-quiz/page";

type BookmarkedQuestion = {
  question: string;
  correctAnswer: string;
  topic: string;
};

export default function DashboardPage() {
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<BookmarkedQuestion[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

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

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's your progress and activity."
      />
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Recent Activity</h2>
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              {recentActivity.length > 0 ? (
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
              ) : (
                <p className="text-muted-foreground text-center py-8">No recent activity. Take a quiz to get started!</p>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
           <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
            <BookMarked className="h-6 w-6" /> Bookmarked Questions
          </h2>
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
               {bookmarkedQuestions.length > 0 ? (
                 <ul className="space-y-4">
                    {bookmarkedQuestions.map((q, index) => (
                      <li key={index} className="p-4 bg-background rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
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
              ) : (
                <p className="text-muted-foreground text-center py-8">You haven't bookmarked any questions yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
