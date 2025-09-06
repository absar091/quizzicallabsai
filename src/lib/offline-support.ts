// Offline support for caching generated quizzes
export interface CachedQuiz {
  id: string;
  quiz: any[];
  metadata: {
    topic: string;
    difficulty: string;
    createdAt: number;
    expiresAt: number;
  };
}

export class OfflineQuizManager {
  private static readonly CACHE_NAME = 'quizzicallabs-quizzes-v1';
  private static readonly DB_NAME = 'QuizzicallabsDB';
  private static readonly DB_VERSION = 1;
  private static readonly STORE_NAME = 'quizzes';

  // Initialize IndexedDB
  private static async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          store.createIndex('topic', 'metadata.topic', { unique: false });
          store.createIndex('createdAt', 'metadata.createdAt', { unique: false });
        }
      };
    });
  }

  // Cache quiz for offline use
  static async cacheQuiz(quiz: any[], metadata: Omit<CachedQuiz['metadata'], 'createdAt' | 'expiresAt'>): Promise<string> {
    try {
      const db = await this.initDB();
      const quizId = `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      const cachedQuiz: CachedQuiz = {
        id: quizId,
        quiz,
        metadata: {
          ...metadata,
          createdAt: Date.now(),
          expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
        }
      };

      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      await store.add(cachedQuiz);
      
      return quizId;
    } catch (error) {
      console.error('Failed to cache quiz:', error);
      throw error;
    }
  }

  // Get cached quiz
  static async getCachedQuiz(quizId: string): Promise<CachedQuiz | null> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.get(quizId);
        request.onsuccess = () => {
          const result = request.result as CachedQuiz;
          if (result && result.metadata.expiresAt > Date.now()) {
            resolve(result);
          } else if (result) {
            // Quiz expired, remove it
            this.removeCachedQuiz(quizId);
            resolve(null);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get cached quiz:', error);
      return null;
    }
  }

  // Get all cached quizzes
  static async getAllCachedQuizzes(): Promise<CachedQuiz[]> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const quizzes = request.result.filter(
            (quiz: CachedQuiz) => quiz.metadata.expiresAt > Date.now()
          );
          resolve(quizzes);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get cached quizzes:', error);
      return [];
    }
  }

  // Remove cached quiz
  static async removeCachedQuiz(quizId: string): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      await store.delete(quizId);
    } catch (error) {
      console.error('Failed to remove cached quiz:', error);
    }
  }

  // Clean expired quizzes
  static async cleanExpiredQuizzes(): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const now = Date.now();
        request.result.forEach((quiz: CachedQuiz) => {
          if (quiz.metadata.expiresAt <= now) {
            store.delete(quiz.id);
          }
        });
      };
    } catch (error) {
      console.error('Failed to clean expired quizzes:', error);
    }
  }

  // Check if app is offline
  static isOffline(): boolean {
    return !navigator.onLine;
  }

  // Get offline status
  static getOfflineStatus() {
    return {
      isOffline: this.isOffline(),
      lastOnline: localStorage.getItem('lastOnlineTime'),
      hasCache: 'caches' in window,
      hasIndexedDB: 'indexedDB' in window,
      serviceWorker: 'serviceWorker' in navigator,
      isStandalone: window.matchMedia('(display-mode: standalone)').matches ||
                   (window.navigator as any).standalone === true
    };
  }

  // Handle offline API errors
  static handleOfflineError(error: any) {
    if (this.isOffline()) {
      return {
        error: 'offline',
        message: 'You are currently offline. This feature requires an internet connection.',
        offline: true,
        suggestion: 'Please check your connection and try again, or use offline features like cached quizzes.'
      };
    }
    return error;
  }

  // Check if we can perform action offline
  static canPerformOffline(action: string): boolean {
    const offlineActions = [
      'view-cached-quiz',
      'view-cached-questions',
      'view-study-materials',
      'continue-incomplete-quiz'
    ];
    return this.isOffline() && offlineActions.includes(action);
  }
}

// Hook for offline quiz management
export function useOfflineQuizzes() {
  const cacheQuiz = async (quiz: any[], topic: string, difficulty: string) => {
    return await OfflineQuizManager.cacheQuiz(quiz, { topic, difficulty });
  };

  const getCachedQuiz = async (quizId: string) => {
    return await OfflineQuizManager.getCachedQuiz(quizId);
  };

  const getAllCached = async () => {
    return await OfflineQuizManager.getAllCachedQuizzes();
  };

  const removeCached = async (quizId: string) => {
    return await OfflineQuizManager.removeCachedQuiz(quizId);
  };

  const isOffline = OfflineQuizManager.isOffline();

  return {
    cacheQuiz,
    getCachedQuiz,
    getAllCached,
    removeCached,
    isOffline,
    status: OfflineQuizManager.getOfflineStatus()
  };
}
