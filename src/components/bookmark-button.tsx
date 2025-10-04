'use client';

import React from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useQuizBookmarks } from '@/lib/quiz-bookmarks';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  quiz: {
    id: string;
    title: string;
    subject: string;
    difficulty: string;
    questionCount: number;
    tags?: string[];
  };
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showText?: boolean;
}

export function BookmarkButton({ 
  quiz, 
  variant = 'ghost', 
  size = 'icon',
  className,
  showText = false
}: BookmarkButtonProps) {
  const { user } = useAuth();
  const { addBookmark, removeBookmark, isBookmarked } = useQuizBookmarks(user?.uid || null);
  const { toast } = useToast();
  
  const [bookmarked, setBookmarked] = React.useState(false);
  const [bookmarkId, setBookmarkId] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState(false);

  // Check bookmark status on mount
  React.useEffect(() => {
    if (user?.uid) {
      isBookmarked(quiz.id).then(result => {
        setBookmarked(result.isBookmarked);
        setBookmarkId(result.bookmarkId);
      });
    }
  }, [user?.uid, quiz.id, isBookmarked]);

  const handleBookmarkToggle = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark quizzes",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      if (bookmarked && bookmarkId) {
        await removeBookmark(bookmarkId);
        setBookmarked(false);
        setBookmarkId(undefined);
        toast({
          title: "Bookmark removed",
          description: `"${quiz.title}" has been removed from your bookmarks`
        });
      } else {
        await addBookmark(quiz);
        setBookmarked(true);
        toast({
          title: "Quiz bookmarked",
          description: `"${quiz.title}" has been added to your bookmarks`
        });
        
        // Refresh bookmark status to get the ID
        const result = await isBookmarked(quiz.id);
        setBookmarkId(result.bookmarkId);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update bookmark",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const Icon = bookmarked ? BookmarkCheck : Bookmark;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBookmarkToggle}
      disabled={loading}
      className={cn(
        "transition-colors",
        bookmarked && "text-blue-600 hover:text-blue-700",
        className
      )}
      title={bookmarked ? "Remove bookmark" : "Bookmark quiz"}
    >
      <Icon className={cn(
        "h-4 w-4",
        bookmarked && "fill-current",
        showText && "mr-2"
      )} />
      {showText && (bookmarked ? "Bookmarked" : "Bookmark")}
    </Button>
  );
}

export function BookmarksList() {
  const { user } = useAuth();
  const { bookmarks, loading, error } = useQuizBookmarks(user?.uid || null);

  if (!user) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Sign in to view your bookmarked quizzes
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 border rounded-lg space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
            <div className="flex gap-2">
              <div className="h-6 bg-muted rounded animate-pulse w-16" />
              <div className="h-6 bg-muted rounded animate-pulse w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading bookmarks: {error}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
        <p>Start bookmarking quizzes to access them quickly later</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <div key={bookmark.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-lg mb-1">{bookmark.quizTitle}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <span>{bookmark.subject}</span>
                <span>•</span>
                <span>{bookmark.difficulty}</span>
                <span>•</span>
                <span>{bookmark.questionCount} questions</span>
              </div>
              {bookmark.notes && (
                <p className="text-sm text-muted-foreground italic">
                  "{bookmark.notes}"
                </p>
              )}
              <div className="text-xs text-muted-foreground mt-2">
                Bookmarked {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
              </div>
            </div>
            <BookmarkButton 
              quiz={{
                id: bookmark.quizId,
                title: bookmark.quizTitle,
                subject: bookmark.subject,
                difficulty: bookmark.difficulty,
                questionCount: bookmark.questionCount,
                tags: bookmark.tags
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}