
export interface Question {
  question: string;
  answers?: string[];
  correctAnswer?: string;
  type: 'multiple-choice' | 'descriptive';
  smiles?: string;
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
