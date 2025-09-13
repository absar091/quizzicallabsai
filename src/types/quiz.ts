/**
 * Shared Quiz Type Definitions - Safe for Client-Side Import
 * Includes all Quiz-related types that can be safely used in client components
 */

// Base quiz types
export interface QuizQuestion {
  type: 'multiple-choice' | 'descriptive';
  question: string;
  smiles?: string;
  answers?: string[];
  correctAnswer?: string;
}

export interface QuizData {
  questions?: QuizQuestion[];
  comprehensionText?: string;
  topic?: string;
  difficulty?: string;
}

export interface FlashcardData {
  flashcards: {
    term: string;
    definition: string;
  }[];
}

// Generation input types
export interface QuizGenerationInput {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'master';
  numberOfQuestions: number;
  questionTypes: string[];
  questionStyles: string[];
  timeLimit: number;
  specificInstructions?: string;
}

// Result types
export interface QuizResult {
  userId: string;
  quizId?: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'master';
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number;
  answers: Array<{
    questionIndex: number;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeToAnswer?: number;
  }>;
  createdAt: Date;
  completed: boolean;
}

// Legacy type - should match current Quiz implementation
export type Quiz = QuizQuestion[];

// Compatibility type for existing components
export interface ComponentQuizShape extends Array<QuizQuestion> {}
