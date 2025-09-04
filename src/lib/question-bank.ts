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
  userId?: string;
}

export class QuestionBank {
  // Save questions to Firebase in real-time
  static async saveQuestions(questions: any[], topic: string, difficulty: string, userId?: string) {
    try {
      console.log('DEBUG: Saving questions. userId:', userId);
      const { db } = await import('@/lib/firebase');
      const { ref, push } = await import('firebase/database');
      const bankRef = ref(db, 'question_bank');
      const bankItems: QuestionBankItem[] = questions.map(q => ({
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        question: q.question,
        type: q.type,
        answers: q.answers,
        correctAnswer: q.correctAnswer,
        subject: this.extractSubject(topic),
        topic,
        difficulty: difficulty as any,
        tags: this.generateTags(topic, difficulty),
        verified: false,
        createdAt: Date.now(),
        usageCount: 0,
        userId
      }));
      
      // Save each question
      for (const item of bankItems) {
        await push(bankRef, item);
      }
      
  console.log(`Saved ${bankItems ? bankItems.length : 0} questions to bank`);
    } catch (error) {
      console.error('Failed to save questions to bank:', error);
    }
  }

  // Get questions from Firebase bank
  static async getQuestions(topic: string, difficulty: string, count: number): Promise<QuestionBankItem[]> {
    try {
      console.log('DEBUG: Fetching questions. topic:', topic, 'difficulty:', difficulty, 'count:', count);
      const { db } = await import('@/lib/firebase');
      const { ref, query, orderByChild, equalTo, limitToFirst, get } = await import('firebase/database');
      const bankRef = ref(db, 'question_bank');
      
      // Try exact topic match first
      let questionsQuery = query(
        bankRef,
        orderByChild('topic'),
        equalTo(topic),
        limitToFirst(count * 2) // Get more than needed
      );
      
      let snapshot = await get(questionsQuery);
      let questions: QuestionBankItem[] = [];
      
      if (snapshot.exists()) {
        questions = Object.values(snapshot.val()) as QuestionBankItem[];
        questions = questions.filter(q => q.difficulty === difficulty);
      }
      
      // If not enough, try subject match
  if (questions && questions.length < count) {
        const subject = this.extractSubject(topic);
        const subjectRef = ref(db, 'question_bank');
        questionsQuery = query(
          subjectRef,
          orderByChild('subject'),
          equalTo(subject),
          limitToFirst(count * 3)
        );
        
        snapshot = await get(questionsQuery);
        if (snapshot.exists()) {
          const subjectQuestions = Object.values(snapshot.val()) as QuestionBankItem[];
          questions = [...questions, ...subjectQuestions.filter(q => 
            q.difficulty === difficulty && !questions.find(existing => existing.id === q.id)
          )];
        }
      }
      
      // Sort by usage count and return requested amount
      return questions
        .sort((a, b) => a.usageCount - b.usageCount)
        .slice(0, count);
        
    } catch (error) {
      console.error('Failed to get questions from bank:', error);
      return [];
    }
  }

  // Check if we have enough questions in bank
  static async hasEnoughQuestions(topic: string, difficulty: string, count: number): Promise<boolean> {
    const available = await this.getQuestions(topic, difficulty, count);
    return available.length >= Math.min(count, 10); // At least 10 or requested amount
  }

  // Update usage count
  static async updateUsageCount(questionIds: string[]) {
    try {
      const { db } = await import('@/lib/firebase');
      const { ref, get, update } = await import('firebase/database');
      
      for (const id of questionIds) {
        const questionRef = ref(db, `question_bank/${id}`);
        const snapshot = await get(questionRef);
        
        if (snapshot.exists()) {
          const question = snapshot.val();
          await update(questionRef, { usageCount: (question.usageCount || 0) + 1 });
        }
      }
    } catch (error) {
      console.error('Failed to update usage count:', error);
    }
  }

  // Helper methods
  private static extractSubject(topic: string): string {
    const lowerTopic = topic.toLowerCase();
    if (lowerTopic.includes('biology') || lowerTopic.includes('bio')) return 'Biology';
    if (lowerTopic.includes('chemistry') || lowerTopic.includes('chem')) return 'Chemistry';
    if (lowerTopic.includes('physics') || lowerTopic.includes('phy')) return 'Physics';
    if (lowerTopic.includes('math') || lowerTopic.includes('calculus')) return 'Mathematics';
    if (lowerTopic.includes('english') || lowerTopic.includes('literature')) return 'English';
    if (lowerTopic.includes('computer') || lowerTopic.includes('programming')) return 'Computer Science';
    return 'General';
  }

  private static generateTags(topic: string, difficulty: string): string[] {
    const tags = [difficulty];
    const words = topic.toLowerCase().split(' ');
    words.forEach(word => {
      if (word.length > 3) tags.push(word);
    });
    return [...new Set(tags)];
  }
}