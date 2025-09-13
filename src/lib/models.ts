/**
 * MongoDB Models and Schemas for Quizzicallabs
 * This file defines all database models using Mongoose ODM
 */

import mongoose from 'mongoose';

// User Model - For Firebase-authenticated users
export interface IUser extends mongoose.Document {
  uid: string; // Firebase UID
  email: string;
  displayName?: string;
  photoURL?: string;
  plan: 'Free' | 'Pro';
  createdAt: Date;
  lastLogin: Date;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
  stats: {
    totalQuizzesTaken: number;
    totalQuestionsAnswered: number;
    averageScore: number;
    studyStreak: number;
    totalStudyTime: number; // in minutes
  };
}

const UserSchema = new mongoose.Schema<IUser>({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  displayName: String,
  photoURL: String,
  plan: { type: String, enum: ['Free', 'Pro'], default: 'Free' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  preferences: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    notifications: { type: Boolean, default: true },
    language: { type: String, default: 'en' }
  },
  stats: {
    totalQuizzesTaken: { type: Number, default: 0 },
    totalQuestionsAnswered: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    studyStreak: { type: Number, default: 0 },
    totalStudyTime: { type: Number, default: 0 }
  }
});

// Quiz Result Model - For storing quiz attempts and results
export interface IQuizResult extends mongoose.Document {
  userId: string;
  quizId?: string; // Optional: Link to generated quiz
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'master';
  score: number; // Number of correct answers
  totalQuestions: number;
  percentage: number;
  timeTaken: number; // Time taken in seconds
  answers: Array<{
    questionIndex: number;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeToAnswer?: number; // Time spent on this question in seconds
  }>;
  createdAt: Date;
  completed: boolean;
}

const QuizResultSchema = new mongoose.Schema<IQuizResult>({
  userId: { type: String, required: true },
  quizId: String,
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'master'], required: true },
  score: { type: Number, required: true, min: 0 },
  totalQuestions: { type: Number, required: true, min: 1 },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  timeTaken: { type: Number, required: true, min: 0 },
  answers: [{
    questionIndex: { type: Number, required: true },
    question: { type: String, required: true },
    userAnswer: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    timeToAnswer: Number
  }],
  createdAt: { type: Date, default: Date.now },
  completed: { type: Boolean, default: true }
});

// Flashcard Model - For storing user-generated flashcards
export interface IFlashcard extends mongoose.Document {
  userId: string;
  term: string;
  definition: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  lastReviewedAt?: Date;
  reviewCount: number;
  correctCount: number;
  nextReviewDate: Date;
}

const FlashcardSchema = new mongoose.Schema<IFlashcard>({
  userId: { type: String, required: true },
  term: { type: String, required: true },
  definition: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  createdAt: { type: Date, default: Date.now },
  lastReviewedAt: Date,
  reviewCount: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  nextReviewDate: { type: Date, default: Date.now }
});

// Bookmark Model - For storing bookmarked questions
export interface IBookmark extends mongoose.Document {
  userId: string;
  question: string;
  correctAnswer: string;
  topic: string;
  difficulty: string;
  questionType: string;
  createdAt: Date;
  notes?: string;
}

const BookmarkSchema = new mongoose.Schema<IBookmark>({
  userId: { type: String, required: true },
  question: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: String,
  questionType: String,
  createdAt: { type: Date, default: Date.now },
  notes: String
});

// Study Session Model - For tracking study sessions
export interface IStudySession extends mongoose.Document {
  userId: string;
  topic: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  questionsAnswered: number;
  correctAnswers: number;
  quizzesCompleted: number;
  flashcardsReviewed: number;
  signedAt: Date;
}

const StudySessionSchema = new mongoose.Schema<IStudySession>({
  userId: { type: String, required: true },
  topic: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  duration: Number,
  questionsAnswered: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  quizzesCompleted: { type: Number, default: 0 },
  flashcardsReviewed: { type: Number, default: 0 },
  signedAt: { type: Date, default: Date.now }
});

// Achievement Model - For storing user achievements
export interface IAchievement extends mongoose.Document {
  userId: string;
  type: 'quiz_complete' | 'streak' | 'score' | 'flashcard_master' | 'study_time';
  title: string;
  description: string;
  icon?: string;
  earnedAt: Date;
  metadata: {
    quizCount?: number;
    streakDays?: number;
    scorePercentage?: number;
    studyHours?: number;
    fastTime?: number;
  };
}

const AchievementSchema = new mongoose.Schema<IAchievement>({
  userId: { type: String, required: true },
  type: {
    type: String,
    enum: ['quiz_complete', 'streak', 'score', 'flashcard_master', 'study_time'],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: String,
  earnedAt: { type: Date, default: Date.now },
  metadata: {
    quizCount: Number,
    streakDays: Number,
    scorePercentage: Number,
    studyHours: Number,
    fastTime: Number
  }
});

// API Usage Model - For tracking API calls (optional for analytics)
export interface IApiUsage extends mongoose.Document {
  userId?: string; // Anonymous users won't have this
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number; // in milliseconds
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  error?: string;
}

const ApiUsageSchema = new mongoose.Schema<IApiUsage>({
  userId: String,
  endpoint: { type: String, required: true },
  method: { type: String, required: true },
  statusCode: { type: Number, required: true },
  responseTime: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  ipAddress: String,
  userAgent: String,
  error: String
});

// Indexes for performance
UserSchema.index({ uid: 1 }, { unique: true });
UserSchema.index({ email: 1 });
UserSchema.index({ lastLogin: -1 });

QuizResultSchema.index({ userId: 1, createdAt: -1 });
QuizResultSchema.index({ topic: 1, createdAt: -1 });

FlashcardSchema.index({ userId: 1, nextReviewDate: 1 });
FlashcardSchema.index({ userId: 1, createdAt: -1 });

BookmarkSchema.index({ userId: 1, createdAt: -1 });

StudySessionSchema.index({ userId: 1, startTime: -1 });

AchievementSchema.index({ userId: 1, earnedAt: -1 });

ApiUsageSchema.index({ timestamp: -1 });
ApiUsageSchema.index({ endpoint: 1, timestamp: -1 });

// Create models
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const QuizResult = mongoose.models.QuizResult || mongoose.model('QuizResult', QuizResultSchema);
export const Flashcard = mongoose.models.Flashcard || mongoose.model('Flashcard', FlashcardSchema);
export const Bookmark = mongoose.models.Bookmark || mongoose.model('Bookmark', BookmarkSchema);
export const StudySession = mongoose.models.StudySession || mongoose.model('StudySession', StudySessionSchema);
export const Achievement = mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema);
export const ApiUsage = mongoose.models.ApiUsage || mongoose.model('ApiUsage', ApiUsageSchema);

// Export schemas for testing
export {
  UserSchema,
  QuizResultSchema,
  FlashcardSchema,
  BookmarkSchema,
  StudySessionSchema,
  AchievementSchema,
  ApiUsageSchema
};

// Helper functions with simplified typing
export async function createOrUpdateUser(
  uid: string,
  userData: Partial<IUser>
): Promise<any> {
  try {
    const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
    const user = await UserModel.findOneAndUpdate(
      { uid },
      {
        ...userData,
        lastLogin: new Date()
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );
    return user;
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
}

export async function getUserStats(userId: string) {
  try {
    const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
    const QuizResultModel = mongoose.models.QuizResult || mongoose.model('QuizResult', QuizResultSchema);
    const FlashcardModel = mongoose.models.Flashcard || mongoose.model('Flashcard', FlashcardSchema);

    const [user, quizCount, flashcardCount] = await Promise.all([
      UserModel.findOne({ uid: userId }).select('stats'),
      QuizResultModel.countDocuments({ userId }),
      FlashcardModel.countDocuments({ userId })
    ]);

    return {
      user: user?.stats || {},
      totalQuizzes: quizCount,
      totalFlashcards: flashcardCount
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
}

export async function updateUserStats(userId: string, quizResult: any) {
  try {
    const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

    const updates = {
      $inc: {
        'stats.totalQuizzesTaken': 1,
        'stats.totalQuestionsAnswered': quizResult.totalQuestions,
        'stats.totalStudyTime': Math.ceil(quizResult.timeTaken / 60) // Convert to minutes
      },
      $set: {
        'stats.lastActivity': new Date()
      }
    };

    // Calculate new average score
    const existingStats = await UserModel.findOne({ uid: userId }).select('stats');
    if (existingStats) {
      const currentAvg = (existingStats as any).stats?.averageScore || 0;
      const currentCount = (existingStats as any).stats?.totalQuizzesTaken || 0;
      const newAvg = ((currentAvg * currentCount) + quizResult.percentage) / (currentCount + 1);
