
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { QuizFormValues, Quiz } from '@/app/(app)/generate-quiz/page';

const DB_NAME = 'QuizzicallabsDB';
const DB_VERSION = 1;

export interface QuizResult {
    id: string; // [userId]-[timestamp]
    userId: string;
    topic: string;
    score: number;
    total: number;
    percentage: number;
    date: string;
}

export interface BookmarkedQuestion {
    userId: string;
    question: string;
    correctAnswer: string;
    topic: string;
}

export interface QuizState {
    quiz: Quiz;
    currentQuestion: number;
    userAnswers: (string | null)[];
    timeLeft: number;
    formValues: QuizFormValues | null;
}

interface QuizzicalDB extends DBSchema {
  quizResults: {
    key: string;
    value: QuizResult;
    indexes: { 'by-user': string };
  };
  bookmarks: {
    key: [string, string]; // [userId, question]
    value: BookmarkedQuestion;
    indexes: { 'by-user': string };
  };
  quizState: {
    key: string; // userId
    value: QuizState;
  };
}

let dbPromise: Promise<IDBPDatabase<QuizzicalDB>>;

function getDb(): Promise<IDBPDatabase<QuizzicalDB>> {
  if (!dbPromise) {
    dbPromise = openDB<QuizzicalDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('quizResults')) {
          const store = db.createObjectStore('quizResults', { keyPath: 'id' });
          store.createIndex('by-user', 'userId');
        }
        if (!db.objectStoreNames.contains('bookmarks')) {
          const store = db.createObjectStore('bookmarks', { keyPath: ['userId', 'question'] });
          store.createIndex('by-user', 'userId');
        }
        if (!db.objectStoreNames.contains('quizState')) {
          db.createObjectStore('quizState');
        }
      },
    });
  }
  return dbPromise;
}

// --- Quiz Results ---

export async function saveQuizResult(result: QuizResult): Promise<void> {
  const db = await getDb();
  await db.put('quizResults', result);
}

export async function getQuizResults(userId: string): Promise<QuizResult[]> {
  const db = await getDb();
  const results = await db.getAllFromIndex('quizResults', 'by-user', userId);
  return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// --- Bookmarks ---

export async function saveBookmark(bookmark: BookmarkedQuestion): Promise<void> {
  const db = await getDb();
  await db.put('bookmarks', bookmark);
}

export async function deleteBookmark(userId: string, question: string): Promise<void> {
  const db = await getDb();
  await db.delete('bookmarks', [userId, question]);
}

export async function getBookmarks(userId: string): Promise<BookmarkedQuestion[]> {
  const db = await getDb();
  return db.getAllFromIndex('bookmarks', 'by-user', userId);
}

// --- Quiz State ---

export async function saveQuizState(userId: string, state: QuizState): Promise<void> {
  const db = await getDb();
  await db.put('quizState', state, userId);
}

export async function getQuizState(userId: string): Promise<QuizState | undefined> {
  const db = await getDb();
  return db.get('quizState', userId);
}

export async function deleteQuizState(userId: string): Promise<void> {
  const db = await getDb();
  await db.delete('quizState', userId);
}

// --- User Data Management ---

export async function clearUserData(userId: string): Promise<void> {
  const db = await getDb();
  
  const tx = db.transaction(['quizResults', 'bookmarks', 'quizState'], 'readwrite');
  
  const resultsStore = tx.objectStore('quizResults');
  const resultsIndex = resultsStore.index('by-user');
  let resultsCursor = await resultsIndex.openCursor(userId);
  while(resultsCursor) {
    resultsCursor.delete();
    resultsCursor = await resultsCursor.continue();
  }

  const bookmarksStore = tx.objectStore('bookmarks');
  const bookmarksIndex = bookmarksStore.index('by-user');
  let bookmarksCursor = await bookmarksIndex.openCursor(userId);
  while(bookmarksCursor) {
    bookmarksCursor.delete();
    bookmarksCursor = await bookmarksCursor.continue();
  }

  await tx.objectStore('quizState').delete(userId);
  
  await tx.done;
}
