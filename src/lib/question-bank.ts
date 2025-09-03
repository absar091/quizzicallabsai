// Question Bank System for reducing AI API calls
export interface QuestionBankItem {
  id: string;
  question: string;
  type: 'multiple-choice' | 'descriptive';
  answers?: string[];
  correctAnswer?: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'master';
  tags: string[];
  verified: boolean;
  createdAt: number;
  usageCount: number;
}

export class QuestionBank {
  private static instance: QuestionBank;
  private questions: Map<string, QuestionBankItem[]> = new Map();

  static getInstance(): QuestionBank {
    if (!QuestionBank.instance) {
      QuestionBank.instance = new QuestionBank();
    }
    return QuestionBank.instance;
  }

  // Add questions to bank
  addQuestions(questions: QuestionBankItem[]) {
    questions.forEach(q => {
      const key = `${q.subject}-${q.difficulty}`;
      if (!this.questions.has(key)) {
        this.questions.set(key, []);
      }
      this.questions.get(key)!.push(q);
    });
  }

  // Get questions from bank
  getQuestions(subject: string, difficulty: string, count: number): QuestionBankItem[] {
    const key = `${subject}-${difficulty}`;
    const available = this.questions.get(key) || [];
    
    // Sort by usage count (least used first)
    const sorted = available.sort((a, b) => a.usageCount - b.usageCount);
    const selected = sorted.slice(0, count);
    
    // Increment usage count
    selected.forEach(q => q.usageCount++);
    
    return selected;
  }

  // Check if we have enough questions
  hasEnoughQuestions(subject: string, difficulty: string, count: number): boolean {
    const key = `${subject}-${difficulty}`;
    const available = this.questions.get(key) || [];
    return available.length >= count;
  }
}