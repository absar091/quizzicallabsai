
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookMarked, Trash2, Lightbulb, Eye, EyeOff, PlayCircle, Loader2, ArrowRight, BrainCircuit, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/page-header";
import { get, ref, remove } from "firebase/database";
import { db } from "@/lib/firebase";
import { getBookmarks, deleteBookmark, BookmarkedQuestion } from "@/lib/indexed-db";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

export default function BookmarksPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<BookmarkedQuestion[]>([]);
  
  const [reviewing, setReviewing] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    async function loadBookmarks() {
      if (!user) return;
      setLoading(true);
      // Load from IndexedDB first
      const localBookmarks = await getBookmarks(user.uid);
      setBookmarkedQuestions(localBookmarks);
      setLoading(false);

      // Then sync with Firebase
      const bookmarksRef = ref(db, `bookmarks/${user.uid}`);
      const snapshot = await get(bookmarksRef);
      if (snapshot.exists()) {
        const firebaseBookmarks: BookmarkedQuestion[] = Object.values(snapshot.val());
        if (firebaseBookmarks.length !== localBookmarks.length) {
          setBookmarkedQuestions(firebaseBookmarks);
          // Optionally, re-sync IndexedDB here if needed
        }
      }
    }
    loadBookmarks();
  }, [user]);

  const clearBookmark = async (questionToRemove: string) => {
    if (user) {
      const bookmarkId = btoa(questionToRemove);
      const bookmarkRef = ref(db, `bookmarks/${user.uid}/${bookmarkId}`);
      await remove(bookmarkRef);
      await deleteBookmark(user.uid, questionToRemove);
      const updatedBookmarks = bookmarkedQuestions.filter(q => q.question !== questionToRemove);
      setBookmarkedQuestions(updatedBookmarks);
      
      // If the deleted question was the last one in review, end review mode
      if (reviewing && updatedBookmarks.length === 0) {
        setReviewing(false);
      } else if (reviewing && currentReviewIndex >= updatedBookmarks.length) {
        setCurrentReviewIndex(updatedBookmarks.length - 1);
      }
    }
  };

  const startReview = () => {
    setReviewing(true);
    setCurrentReviewIndex(0);
    setShowAnswer(false);
  };

  const nextReviewQuestion = () => {
    if (currentReviewIndex < bookmarkedQuestions.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
      setShowAnswer(false);
    } else {
      setReviewing(false);
    }
  };

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
        <h2 className="text-2xl font-semibold mb-2 mt-6">Loading Your Bookmarks...</h2>
        <p className="text-muted-foreground max-w-sm mb-6">Just a moment, please.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Bookmarked Questions"
        description="Review questions you've saved to master tough concepts."
      />

      {reviewing && bookmarkedQuestions.length > 0 ? (
        <Card>
            <CardHeader>
                <CardTitle>Review Session</CardTitle>
                <CardDescription>Question {currentReviewIndex + 1} of {bookmarkedQuestions.length}</CardDescription>
            </CardHeader>
            <CardContent>
                <Alert className="bg-muted/50">
                    <AlertTitle className="text-xl font-semibold">{bookmarkedQuestions[currentReviewIndex].question}</AlertTitle>
                    <AlertDescription className="text-xs text-muted-foreground mt-1">
                        Topic: {bookmarkedQuestions[currentReviewIndex].topic}
                    </AlertDescription>
                     <div className="mt-4">
                        {showAnswer ? (
                           <div>
                            <p className="text-base text-primary mt-2 font-semibold">Correct Answer: {bookmarkedQuestions[currentReviewIndex].correctAnswer}</p>
                            <Button onClick={() => setShowAnswer(false)} variant="outline" size="sm" className="mt-2"><EyeOff className="mr-2 h-4 w-4" /> Hide Answer</Button>
                           </div>
                        ) : (
                           <Button onClick={() => setShowAnswer(true)} variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" /> Show Answer</Button>
                        )}
                     </div>
                </Alert>
            </CardContent>
             <CardFooter className="flex-col sm:flex-row justify-between gap-2">
                <Button variant="ghost" onClick={() => setReviewing(false)}>End Session</Button>
                <Button onClick={nextReviewQuestion}>
                    {currentReviewIndex < bookmarkedQuestions.length - 1 ? "Next Question" : "Finish Review"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
             </CardFooter>
        </Card>
      ) : (
        <Card>
            <CardHeader className="flex-row justify-between items-center">
                 <div>
                    <CardTitle>Your Saved Questions</CardTitle>
                    <CardDescription>{bookmarkedQuestions.length} questions saved.</CardDescription>
                 </div>
                 <Button onClick={startReview} disabled={bookmarkedQuestions.length === 0}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Start Review Session
                </Button>
            </CardHeader>
          <CardContent>
            {bookmarkedQuestions.length > 0 ? (
              <ScrollArea className="h-[60vh] pr-4">
                <ul className="space-y-4">
                  {bookmarkedQuestions.map((q, index) => (
                    <li key={index} className="p-4 bg-muted rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold pr-4">{q.question}</p>
                          <p className="text-sm text-primary mt-2">Correct Answer: {q.correctAnswer}</p>
                          <p className="text-xs text-muted-foreground mt-1">Topic: {q.topic}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => clearBookmark(q.question)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete bookmark</span>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <div className="text-center py-16">
                <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground font-semibold">No Bookmarks Yet</p>
                <p className="text-sm text-muted-foreground mt-1">Bookmark questions during a quiz to find them here later.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
