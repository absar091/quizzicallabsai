import { ref, get, set, push, remove } from 'firebase/database';
import { db } from './firebase';

export interface QuizBookmark {
  id: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  difficulty: string;
  questionCount: number;
  bookmarkedAt: number;
  tags?: string[];
  notes?: string;
}

export class QuizBookmarkManager {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async addBookmark(quiz: {
    id: string;
    title: string;
    subject: string;
    difficulty: string;
    questionCount: number;
    tags?: string[];
  }, notes?: string): Promise<string> {
    try {
      const bookmarksRef = ref(db, `bookmarks/${this.userId}`);
      const newBookmarkRef = push(bookmarksRef);
      
      const bookmark: Omit<QuizBookmark, 'id'> = {
        userId: this.userId,
        quizId: quiz.id,
        quizTitle: quiz.title,
        subject: quiz.subject,
        difficulty: quiz.difficulty,
        questionCount: quiz.questionCount,
        bookmarkedAt: Date.now(),
        tags: quiz.tags || [],
        notes: notes || ''
      };

      await set(newBookmarkRef, bookmark);
      return newBookmarkRef.key!;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  }

  async removeBookmark(bookmarkId: string): Promise<void> {
    try {
      const bookmarkRef = ref(db, `bookmarks/${this.userId}/${bookmarkId}`);
      await remove(bookmarkRef);
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  }

  async getBookmarks(): Promise<QuizBookmark[]> {
    try {
      const bookmarksRef = ref(db, `bookmarks/${this.userId}`);
      const snapshot = await get(bookmarksRef);
      
      if (snapshot.exists()) {
        const bookmarksData = snapshot.val();
        return Object.entries(bookmarksData).map(([id, data]: [string, any]) => ({
          id,
          ...data
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      throw error;
    }
  }

  async isBookmarked(quizId: string): Promise<{ isBookmarked: boolean; bookmarkId?: string }> {
    try {
      const bookmarks = await this.getBookmarks();
      const bookmark = bookmarks.find(b => b.quizId === quizId);
      
      return {
        isBookmarked: !!bookmark,
        bookmarkId: bookmark?.id
      };
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      return { isBookmarked: false };
    }
  }

  async updateBookmarkNotes(bookmarkId: string, notes: string): Promise<void> {
    try {
      const bookmarkRef = ref(db, `bookmarks/${this.userId}/${bookmarkId}/notes`);
      await set(bookmarkRef, notes);
    } catch (error) {
      console.error('Error updating bookmark notes:', error);
      throw error;
    }
  }

  async getBookmarksBySubject(subject: string): Promise<QuizBookmark[]> {
    const bookmarks = await this.getBookmarks();
    return bookmarks.filter(bookmark => 
      bookmark.subject.toLowerCase() === subject.toLowerCase()
    );
  }

  async searchBookmarks(query: string): Promise<QuizBookmark[]> {
    const bookmarks = await this.getBookmarks();
    const searchTerm = query.toLowerCase();
    
    return bookmarks.filter(bookmark =>
      bookmark.quizTitle.toLowerCase().includes(searchTerm) ||
      bookmark.subject.toLowerCase().includes(searchTerm) ||
      bookmark.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      bookmark.notes?.toLowerCase().includes(searchTerm)
    );
  }
}

// React Hook
import React from 'react';

export function useQuizBookmarks(userId: string | null) {
  const [bookmarks, setBookmarks] = React.useState<QuizBookmark[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const bookmarkManager = React.useMemo(() => 
    userId ? new QuizBookmarkManager(userId) : null, 
    [userId]
  );

  const loadBookmarks = React.useCallback(async () => {
    if (!bookmarkManager) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userBookmarks = await bookmarkManager.getBookmarks();
      setBookmarks(userBookmarks);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [bookmarkManager]);

  React.useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const addBookmark = React.useCallback(async (quiz: {
    id: string;
    title: string;
    subject: string;
    difficulty: string;
    questionCount: number;
    tags?: string[];
  }, notes?: string) => {
    if (!bookmarkManager) return;

    try {
      await bookmarkManager.addBookmark(quiz, notes);
      await loadBookmarks(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [bookmarkManager, loadBookmarks]);

  const removeBookmark = React.useCallback(async (bookmarkId: string) => {
    if (!bookmarkManager) return;

    try {
      await bookmarkManager.removeBookmark(bookmarkId);
      await loadBookmarks(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [bookmarkManager, loadBookmarks]);

  const isBookmarked = React.useCallback(async (quizId: string) => {
    if (!bookmarkManager) return { isBookmarked: false };
    
    try {
      return await bookmarkManager.isBookmarked(quizId);
    } catch (err: any) {
      setError(err.message);
      return { isBookmarked: false };
    }
  }, [bookmarkManager]);

  return {
    bookmarks,
    loading,
    error,
    addBookmark,
    removeBookmark,
    isBookmarked,
    refreshBookmarks: loadBookmarks
  };
}