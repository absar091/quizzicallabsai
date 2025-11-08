/**
 * Token Estimation Service
 * Estimates token usage for different AI operations
 */

export interface TokenEstimate {
  estimated: number;
  operation: string;
  factors: Record<string, number>;
}

export class TokenEstimationService {
  // Base token costs for different operations
  private static readonly BASE_COSTS = {
    quiz_generation: 1000,
    explanation: 500,
    study_guide: 1500,
    document_analysis: 800,
    flashcard_generation: 600,
    question_generation: 400,
    simple_explanation: 300,
  };

  // Difficulty multipliers
  private static readonly DIFFICULTY_MULTIPLIERS = {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0,
    expert: 2.5,
  };

  // Detail level multipliers
  private static readonly DETAIL_MULTIPLIERS = {
    brief: 1.0,
    standard: 1.5,
    detailed: 2.0,
    comprehensive: 3.0,
  };

  /**
   * Estimate tokens for quiz generation
   */
  static estimateQuizGeneration(params: {
    questionsCount: number;
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    includeExplanations?: boolean;
    includeHints?: boolean;
  }): TokenEstimate {
    const {
      questionsCount,
      topic,
      difficulty,
      includeExplanations = true,
      includeHints = false,
    } = params;

    const baseCost = this.BASE_COSTS.quiz_generation;
    const difficultyMultiplier = this.DIFFICULTY_MULTIPLIERS[difficulty] || 1.0;
    const topicComplexity = Math.min(topic.length * 2, 200); // Cap at 200
    const questionCost = questionsCount * 100;
    const explanationCost = includeExplanations ? questionsCount * 50 : 0;
    const hintCost = includeHints ? questionsCount * 30 : 0;

    const estimated = Math.round(
      (baseCost + topicComplexity + questionCost + explanationCost + hintCost) *
        difficultyMultiplier
    );

    return {
      estimated,
      operation: 'quiz_generation',
      factors: {
        baseCost,
        topicComplexity,
        questionCost,
        explanationCost,
        hintCost,
        difficultyMultiplier,
      },
    };
  }

  /**
   * Estimate tokens for explanation generation
   */
  static estimateExplanation(params: {
    content: string;
    detailLevel: 'brief' | 'standard' | 'detailed' | 'comprehensive';
    includeExamples?: boolean;
  }): TokenEstimate {
    const { content, detailLevel, includeExamples = false } = params;

    const baseCost = this.BASE_COSTS.explanation;
    const contentLength = content.length;
    const contentCost = Math.min(contentLength * 0.5, 500); // Cap at 500
    const detailMultiplier = this.DETAIL_MULTIPLIERS[detailLevel] || 1.0;
    const exampleCost = includeExamples ? 200 : 0;

    const estimated = Math.round(
      (baseCost + contentCost + exampleCost) * detailMultiplier
    );

    return {
      estimated,
      operation: 'explanation',
      factors: {
        baseCost,
        contentLength,
        contentCost,
        detailMultiplier,
        exampleCost,
      },
    };
  }

  /**
   * Estimate tokens for study guide generation
   */
  static estimateStudyGuide(params: {
    topic: string;
    sections: number;
    depth: 'overview' | 'standard' | 'comprehensive';
    includeQuizzes?: boolean;
  }): TokenEstimate {
    const { topic, sections, depth, includeQuizzes = false } = params;

    const baseCost = this.BASE_COSTS.study_guide;
    const topicComplexity = Math.min(topic.length * 3, 300);
    const sectionCost = sections * 200;
    const depthMultiplier = {
      overview: 1.0,
      standard: 1.5,
      comprehensive: 2.5,
    }[depth] || 1.0;
    const quizCost = includeQuizzes ? 500 : 0;

    const estimated = Math.round(
      (baseCost + topicComplexity + sectionCost + quizCost) * depthMultiplier
    );

    return {
      estimated,
      operation: 'study_guide',
      factors: {
        baseCost,
        topicComplexity,
        sectionCost,
        depthMultiplier,
        quizCost,
      },
    };
  }

  /**
   * Estimate tokens for document analysis
   */
  static estimateDocumentAnalysis(params: {
    documentLength: number;
    analysisType: 'summary' | 'detailed' | 'comprehensive';
    extractQuestions?: boolean;
  }): TokenEstimate {
    const { documentLength, analysisType, extractQuestions = false } = params;

    const baseCost = this.BASE_COSTS.document_analysis;
    const documentCost = Math.min(documentLength * 0.3, 1000); // Cap at 1000
    const analysisMultiplier = {
      summary: 1.0,
      detailed: 2.0,
      comprehensive: 3.0,
    }[analysisType] || 1.0;
    const questionCost = extractQuestions ? 400 : 0;

    const estimated = Math.round(
      (baseCost + documentCost + questionCost) * analysisMultiplier
    );

    return {
      estimated,
      operation: 'document_analysis',
      factors: {
        baseCost,
        documentLength,
        documentCost,
        analysisMultiplier,
        questionCost,
      },
    };
  }

  /**
   * Estimate tokens for flashcard generation
   */
  static estimateFlashcards(params: {
    content: string;
    cardCount: number;
    includeImages?: boolean;
  }): TokenEstimate {
    const { content, cardCount, includeImages = false } = params;

    const baseCost = this.BASE_COSTS.flashcard_generation;
    const contentCost = Math.min(content.length * 0.4, 400);
    const cardCost = cardCount * 50;
    const imageCost = includeImages ? cardCount * 100 : 0;

    const estimated = Math.round(baseCost + contentCost + cardCost + imageCost);

    return {
      estimated,
      operation: 'flashcard_generation',
      factors: {
        baseCost,
        contentCost,
        cardCost,
        imageCost,
      },
    };
  }

  /**
   * Estimate tokens for question generation
   */
  static estimateQuestions(params: {
    topic: string;
    questionCount: number;
    difficulty: 'easy' | 'medium' | 'hard';
  }): TokenEstimate {
    const { topic, questionCount, difficulty } = params;

    const baseCost = this.BASE_COSTS.question_generation;
    const topicCost = Math.min(topic.length * 2, 150);
    const questionCost = questionCount * 80;
    const difficultyMultiplier = this.DIFFICULTY_MULTIPLIERS[difficulty] || 1.0;

    const estimated = Math.round(
      (baseCost + topicCost + questionCost) * difficultyMultiplier
    );

    return {
      estimated,
      operation: 'question_generation',
      factors: {
        baseCost,
        topicCost,
        questionCost,
        difficultyMultiplier,
      },
    };
  }

  /**
   * Estimate tokens for simple explanation
   */
  static estimateSimpleExplanation(params: {
    question: string;
    answer: string;
  }): TokenEstimate {
    const { question, answer } = params;

    const baseCost = this.BASE_COSTS.simple_explanation;
    const contentCost = (question.length + answer.length) * 0.3;

    const estimated = Math.round(baseCost + contentCost);

    return {
      estimated,
      operation: 'simple_explanation',
      factors: {
        baseCost,
        contentCost,
      },
    };
  }

  /**
   * Get a quick estimate based on operation type and basic params
   */
  static quickEstimate(
    operation: keyof typeof TokenEstimationService.BASE_COSTS,
    multiplier: number = 1.0
  ): number {
    return Math.round(this.BASE_COSTS[operation] * multiplier);
  }
}

// Export convenience functions
export const estimateQuizTokens = TokenEstimationService.estimateQuizGeneration;
export const estimateExplanationTokens = TokenEstimationService.estimateExplanation;
export const estimateStudyGuideTokens = TokenEstimationService.estimateStudyGuide;
export const estimateDocumentTokens = TokenEstimationService.estimateDocumentAnalysis;
export const estimateFlashcardTokens = TokenEstimationService.estimateFlashcards;
export const estimateQuestionTokens = TokenEstimationService.estimateQuestions;
export const estimateSimpleExplanationTokens = TokenEstimationService.estimateSimpleExplanation;
