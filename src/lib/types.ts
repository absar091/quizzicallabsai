export interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
  userAnswer?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

// The AI flow returns a JSON string, which we parse into this type
export interface DocumentQuizQuestion {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
}
