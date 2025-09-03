// Spaced Repetition Algorithm for intelligent review scheduling
export interface ReviewCard {
  id: string;
  question: string;
  topic: string;
  difficulty: number; // 1-5
  interval: number; // days until next review
  repetitions: number;
  easeFactor: number;
  nextReviewDate: Date;
  lastReviewDate: Date;
  correctStreak: number;
}

export class SpacedRepetitionManager {
  // SM-2 Algorithm implementation
  static calculateNextReview(card: ReviewCard, quality: number): ReviewCard {
    // quality: 0-5 (0=complete blackout, 5=perfect response)
    const newCard = { ...card };
    
    if (quality >= 3) {
      // Correct answer
      newCard.correctStreak++;
      
      if (newCard.repetitions === 0) {
        newCard.interval = 1;
      } else if (newCard.repetitions === 1) {
        newCard.interval = 6;
      } else {
        newCard.interval = Math.round(newCard.interval * newCard.easeFactor);
      }
      
      newCard.repetitions++;
    } else {
      // Incorrect answer - reset
      newCard.repetitions = 0;
      newCard.interval = 1;
      newCard.correctStreak = 0;
    }
    
    // Update ease factor
    newCard.easeFactor = Math.max(1.3, 
      newCard.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );
    
    // Set next review date
    newCard.nextReviewDate = new Date(Date.now() + newCard.interval * 24 * 60 * 60 * 1000);
    newCard.lastReviewDate = new Date();
    
    return newCard;
  }

  // Get cards due for review
  static getDueCards(cards: ReviewCard[]): ReviewCard[] {
    const now = new Date();
    return cards
      .filter(card => card.nextReviewDate <= now)
      .sort((a, b) => a.nextReviewDate.getTime() - b.nextReviewDate.getTime());
  }

  // Get cards by priority (struggling topics first)
  static getPriorityCards(cards: ReviewCard[], limit: number = 10): ReviewCard[] {
    return cards
      .sort((a, b) => {
        // Prioritize by: low ease factor, recent mistakes, overdue
        const aScore = (6 - a.easeFactor) + (5 - a.correctStreak) + 
          Math.max(0, (Date.now() - a.nextReviewDate.getTime()) / (24 * 60 * 60 * 1000));
        const bScore = (6 - b.easeFactor) + (5 - b.correctStreak) + 
          Math.max(0, (Date.now() - b.nextReviewDate.getTime()) / (24 * 60 * 60 * 1000));
        return bScore - aScore;
      })
      .slice(0, limit);
  }

  // Create new review card from quiz question
  static createReviewCard(questionId: string, question: string, topic: string): ReviewCard {
    return {
      id: questionId,
      question,
      topic,
      difficulty: 3,
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      nextReviewDate: new Date(),
      lastReviewDate: new Date(),
      correctStreak: 0
    };
  }

  // Get review statistics
  static getReviewStats(cards: ReviewCard[]) {
    const now = new Date();
    const due = cards.filter(c => c.nextReviewDate <= now).length;
    const mastered = cards.filter(c => c.correctStreak >= 3 && c.easeFactor >= 2.5).length;
    const struggling = cards.filter(c => c.easeFactor < 2.0).length;
    
    return {
      total: cards.length,
      due,
      mastered,
      struggling,
      retention: cards.length > 0 ? (mastered / cards.length) * 100 : 0
    };
  }
}