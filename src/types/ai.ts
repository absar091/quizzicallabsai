/**
 * Shared AI Type Definitions - Safe for Client-Side Import
 *
 * This file contains only type definitions extracted from server-side AI flows.
 * These types can be safely imported by client components without bringing in
 * server-side dependencies like AI models, tokenizers, or generation logic.
 */

// Extracted from src/ai/flows/generate-custom-quiz.ts
export interface GenerateCustomQuizOutput {
  comprehensionText?: string;
  quiz: {
    type: 'multiple-choice' | 'descriptive';
    question: string;
    smiles?: string;
    answers?: string[];
    correctAnswer?: string;
  }[];
}

// Extracted from src/ai/flows/generate-flashcards.ts
export interface GenerateFlashcardsOutput {
  flashcards: {
    term: string;
    definition: string;
  }[];
}

// Common AI-related types
export interface QuizQuestion {
  type: 'multiple-choice' | 'descriptive';
  question: string;
  smiles?: string;
  answers?: string[];
  correctAnswer?: string;
}

export interface QuizData {
  questions?: QuizQuestion[]; // For backward compatibility
  comprehensionText?: string;
  topic?: string;
  difficulty?: string;
}

export interface Flashcard {
  term: string;
  definition: string;
}

export interface QuizFormValues {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'master';
  numberOfQuestions: number;
  questionTypes: string[];
  questionStyles: string[];
  timeLimit: number;
  specificInstructions?: string;
}

export interface QuizHistoryItem {
  topic: string;
  percentage: number;
}

// Utility types for common quiz operations
export type QuizState = {
  quiz: QuizData;
  comprehensionText?: string;
  currentQuestion: number;
  userAnswers: (string | null)[];
  timeLeft: number;
  formValues?: QuizFormValues;
};
