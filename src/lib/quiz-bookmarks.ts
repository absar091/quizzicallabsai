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
  quizContent?: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
    type: string;
  }>;
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
    quizContent?: Array<{
      question: string;
      options: string[];
      correctAnswer: string;
      type: string;
    }>;
  }, notes?: string): Promise<string> {
    try {
      // Create a safe key by encoding the quiz ID
      const safeQuizId = this.encodeFirebaseKey(quiz.id);
      const bookmarkRef = ref(db, `bookmarks/${this.userId}/${safeQuizId}`);
      
      const bookmark: Omit<QuizBookmark, 'id'> = {
        userId: this.userId,
        quizId: quiz.id, // Store the original quiz ID
        quizTitle: quiz.title,
        subject: quiz.subject,
        difficulty: quiz.difficulty,
        questionCount: quiz.questionCount,
        bookmarkedAt: Date.now(),
        tags: quiz.tags || [],
        notes: notes || '',
        quizContent: quiz.quizContent || [] // Store actual quiz questions
      };

      await set(bookmarkRef, bookmark);
      return safeQuizId;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  }

  private encodeFirebaseKey(key: string): string {
    // Replace Firebase-invalid characters with safe alternatives
    return key
      .replace(/\./g, '%2E')
      .replace(/#/g, '%23')
      .replace(/\$/g, '%24')
      .replace(/\[/g, '%5B')
      .replace(/\]/g, '%5D')
      .replace(/=/g, '%3D')
      .replace(/\?/g, '%3F')
      .replace(/\//g, '%2F');
  }

  private decodeFirebaseKey(key: string): string {
    // Reverse the encoding
    return key
      .replace(/%2E/g, '.')
      .replace(/%23/g, '#')
      .replace(/%24/g, '$')
      .replace(/%5B/g, '[')
      .replace(/%5D/g, ']')
      .replace(/%3D/g, '=')
      .replace(/%3F/g, '?')
      .replace(/%2F/g, '/');
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
      // Check directly using the encoded key for better performance
      const safeQuizId = this.encodeFirebaseKey(quizId);
      const bookmarkRef = ref(db, `bookmarks/${this.userId}/${safeQuizId}`);
      const snapshot = await get(bookmarkRef);
      
      return {
        isBookmarked: snapshot.exists(),
        bookmarkId: snapshot.exists() ? safeQuizId : undefined
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