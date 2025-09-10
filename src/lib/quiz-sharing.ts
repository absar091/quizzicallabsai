// Collaborative Study - Quiz Sharing System
export interface SharedQuiz {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  questions: any[];
  topic: string;
  difficulty: string;
  isPublic: boolean;
  shareCode: string;
  createdAt: number;
  tags: string[];
  likes: number;
  attempts: number;
  averageScore: number;
}

export interface SharedQuizMetadata {
  id: string;
  title: string;
  description: string;
  creatorName: string;
  topic: string;
  difficulty: string;
  tags: string[];
  likes: number;
  attempts: number;
  createdAt: number;
}

export class QuizSharingManager {
  // Generate unique share code
  static generateShareCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Create shareable quiz
  static async createSharedQuiz(
    quiz: any[],
    metadata: {
      title: string;
      description: string;
      topic: string;
      difficulty: string;
      isPublic: boolean;
      tags: string[];
    },
    userId: string,
    userName: string
  ): Promise<SharedQuiz> {
    const sharedQuiz: SharedQuiz = {
      id: `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      ...metadata,
      creatorId: userId,
      creatorName: userName,
      questions: quiz,
      shareCode: this.generateShareCode(),
      createdAt: Date.now(),
      likes: 0,
      attempts: 0,
      averageScore: 0
    };

    // Save to Firebase
    try {
      const { db } = await import('@/lib/firebase');
      const { ref, set } = await import('firebase/database');
      
      const quizRef = ref(db, `shared_quizzes/${sharedQuiz.id}`);
      await set(quizRef, sharedQuiz);
      
      // Add to user's shared quizzes
      const userQuizRef = ref(db, `users/${userId}/shared_quizzes/${sharedQuiz.id}`);
      await set(userQuizRef, {
        id: sharedQuiz.id,
        title: sharedQuiz.title,
        shareCode: sharedQuiz.shareCode,
        createdAt: sharedQuiz.createdAt
      });
    } catch (error) {
      console.error('Error saving shared quiz:', error);
      throw error;
    }

    return sharedQuiz;
  }

  // Get quiz by share code
  static async getQuizByShareCode(shareCode: string): Promise<SharedQuiz | null> {
    try {
      const { db } = await import('@/lib/firebase');
      const { ref, query, orderByChild, equalTo, get } = await import('firebase/database');

      const quizzesRef = ref(db, 'shared_quizzes');
      const shareCodeQuery = query(quizzesRef, orderByChild('shareCode'), equalTo(shareCode));
      const snapshot = await get(shareCodeQuery);

      if (snapshot.exists()) {
        const quizzes = snapshot.val();
        const quizId = Object.keys(quizzes)[0];
        return quizzes[quizId];
      }

      return null;
    } catch (error) {
      console.error('Error fetching quiz by share code:', error);
      return null;
    }
  }

  // Get quiz metadata (without questions) by share code - for public access
  static async getQuizMetadataByShareCode(shareCode: string): Promise<SharedQuizMetadata | null> {
    try {
      const { db } = await import('@/lib/firebase');
      const { ref, query, orderByChild, equalTo, get } = await import('firebase/database');

      const quizzesRef = ref(db, 'shared_quizzes');
      const shareCodeQuery = query(quizzesRef, orderByChild('shareCode'), equalTo(shareCode));
      const snapshot = await get(shareCodeQuery);

      if (snapshot.exists()) {
        const quizzes = snapshot.val();
        const quizId = Object.keys(quizzes)[0];
        const quiz = quizzes[quizId];

        // Return only metadata, no questions
        return {
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          creatorName: quiz.creatorName,
          topic: quiz.topic,
          difficulty: quiz.difficulty,
          tags: quiz.tags || [],
          likes: quiz.likes || 0,
          attempts: quiz.attempts || 0,
          createdAt: quiz.createdAt
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching quiz metadata by share code:', error);
      return null;
    }
  }

  // Get public quizzes
  static async getPublicQuizzes(limit: number = 20): Promise<SharedQuiz[]> {
    try {
      const { database, ref, query, orderByChild, equalTo, limitToLast, get } = await import('@/lib/firebase');
      const quizzesRef = ref(database, 'shared_quizzes');
      const publicQuery = query(
        quizzesRef, 
        orderByChild('isPublic'), 
        equalTo(true),
        limitToLast(limit)
      );
      const snapshot = await get(publicQuery);
      
      if (snapshot.exists()) {
        return Object.values(snapshot.val()) as SharedQuiz[];
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching public quizzes:', error);
      return [];
    }
  }

  // Update quiz statistics after attempt
  static async updateQuizStats(quizId: string, score: number) {
    try {
      const { db } = await import('@/lib/firebase');
      const { ref, get, set } = await import('firebase/database');
      
      const quizRef = ref(db, `shared_quizzes/${quizId}`);
      const snapshot = await get(quizRef);
      
      if (snapshot.exists()) {
        const quiz = snapshot.val() as SharedQuiz;
        const newAttempts = quiz.attempts + 1;
        const newAverageScore = ((quiz.averageScore * quiz.attempts) + score) / newAttempts;
        
        await set(quizRef, {
          ...quiz,
          attempts: newAttempts,
          averageScore: Math.round(newAverageScore * 100) / 100
        });
      }
    } catch (error) {
      console.error('Error updating quiz stats:', error);
    }
  }

  // Like/unlike quiz
  static async toggleQuizLike(quizId: string, userId: string): Promise<boolean> {
    try {
      const { db } = await import('@/lib/firebase');
      const { ref, get, set, remove } = await import('firebase/database');
      
      const likeRef = ref(db, `quiz_likes/${quizId}/${userId}`);
      const quizRef = ref(db, `shared_quizzes/${quizId}`);
      
      const [likeSnapshot, quizSnapshot] = await Promise.all([
        get(likeRef),
        get(quizRef)
      ]);
      
      const isLiked = likeSnapshot.exists();
      const quiz = quizSnapshot.val() as SharedQuiz;
      
      if (isLiked) {
        // Unlike
        await remove(likeRef);
        await set(quizRef, { ...quiz, likes: Math.max(0, quiz.likes - 1) });
        return false;
      } else {
        // Like
        await set(likeRef, true);
        await set(quizRef, { ...quiz, likes: quiz.likes + 1 });
        return true;
      }
    } catch (error) {
      console.error('Error toggling quiz like:', error);
      return false;
    }
  }
}
