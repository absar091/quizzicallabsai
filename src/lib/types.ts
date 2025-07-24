
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

export interface DocumentQuizQuestion {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
}
