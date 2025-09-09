'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { Brain } from 'lucide-react';
import { Clock } from 'lucide-react';
import { Target } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { CheckCircle } from 'lucide-react';
import { XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { SpacedRepetitionManager, ReviewCard } from '@/lib/spaced-repetition';
import { EnhancedLoading } from '@/components/enhanced-loading';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewPage() {
  const { user } = useAuth();
  const [reviewCards, setReviewCards] = useState<ReviewCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    loadReviewCards();
  }, [user]);

  const loadReviewCards = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Load review cards from Firebase
      const { db } = await import('@/lib/firebase');
      const { ref, get } = await import('firebase/database');
      const cardsRef = ref(db, `users/${user.uid}/review_cards`);
      const snapshot = await get(cardsRef);
      
      if (snapshot.exists()) {
        const allCards = Object.values(snapshot.val()) as ReviewCard[];
        const dueCards = SpacedRepetitionManager.getDueCards(allCards);
        const priorityCards = SpacedRepetitionManager.getPriorityCards(dueCards, 10);
        setReviewCards(priorityCards);
      }
    } catch (error) {
      console.error('Failed to load review cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQualityRating = async (quality: number) => {
    if (currentCardIndex >= reviewCards.length) return;
    
    const currentCard = reviewCards[currentCardIndex];
    const updatedCard = SpacedRepetitionManager.calculateNextReview(currentCard, quality);
    
    try {
      // Save updated card to Firebase
      const { db } = await import('@/lib/firebase');
      const { ref, set } = await import('firebase/database');
      const cardRef = ref(db, `users/${user.uid}/review_cards/${currentCard.id}`);
      await set(cardRef, updatedCard);
    } catch (error) {
      console.error('Failed to save review card:', error);
    }
    
    // Move to next card
    if (currentCardIndex < reviewCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      setSessionComplete(true);
    }
  };

  const stats = SpacedRepetitionManager.getReviewStats(reviewCards);

  if (isLoading) {
    return <EnhancedLoading type="questions" message="Loading your review session..." />;
  }

  if (reviewCards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <PageHeader 
          title="Spaced Repetition Review" 
          description="No cards due for review right now!" 
        />
        <Card className="text-center p-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
          <p className="text-muted-foreground mb-4">
            You don't have any cards due for review. Come back later or take more quizzes to build your review deck.
          </p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <PageHeader 
          title="Review Complete!" 
          description="Great job on completing your review session." 
        />
        <Card className="text-center p-8">
          <TrendingUp className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Session Complete!</h3>
          <p className="text-muted-foreground mb-6">
            You've reviewed {reviewCards.length} cards. Your knowledge retention is improving!
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-muted rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{stats.mastered}</div>
              <div className="text-sm text-muted-foreground">Mastered</div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.struggling}</div>
              <div className="text-sm text-muted-foreground">Need Practice</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button onClick={() => window.location.reload()} className="w-full">
              Review More Cards
            </Button>
            <Button variant="outline" onClick={() => window.history.back()} className="w-full">
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentCard = reviewCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / reviewCards.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader 
        title="Spaced Repetition Review" 
        description={`Review ${reviewCards.length} cards to strengthen your memory`} 
      />
      
      {/* Progress and Stats */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span>Card {currentCardIndex + 1} of {reviewCards.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
        
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-muted rounded p-2">
            <div className="text-lg font-bold">{stats.due}</div>
            <div className="text-xs text-muted-foreground">Due</div>
          </div>
          <div className="bg-muted rounded p-2">
            <div className="text-lg font-bold">{stats.mastered}</div>
            <div className="text-xs text-muted-foreground">Mastered</div>
          </div>
          <div className="bg-muted rounded p-2">
            <div className="text-lg font-bold">{stats.struggling}</div>
            <div className="text-xs text-muted-foreground">Struggling</div>
          </div>
          <div className="bg-muted rounded p-2">
            <div className="text-lg font-bold">{Math.round(stats.retention)}%</div>
            <div className="text-xs text-muted-foreground">Retention</div>
          </div>
        </div>
      </div>

      {/* Review Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCardIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="min-h-[400px] cursor-pointer" onClick={() => setShowAnswer(!showAnswer)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{currentCard.topic}</Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Brain className="h-4 w-4" />
                  <span>Difficulty: {currentCard.difficulty}/5</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-center text-center p-8">
              {!showAnswer ? (
                <div>
                  <h3 className="text-2xl font-semibold mb-4">{currentCard.question}</h3>
                  <p className="text-muted-foreground">Click to reveal answer</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Question:</h3>
                    <p className="text-muted-foreground mb-4">{currentCard.question}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-primary">Answer:</h3>
                    <p className="text-lg">{currentCard.question}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Rating Buttons */}
      {showAnswer && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-4"
        >
          <h4 className="text-center font-medium">How well did you remember this?</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button 
              variant="destructive" 
              onClick={() => handleQualityRating(0)}
              className="flex-col h-16"
            >
              <XCircle className="h-5 w-5 mb-1" />
              <span className="text-xs">Forgot</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleQualityRating(2)}
              className="flex-col h-16"
            >
              <Clock className="h-5 w-5 mb-1" />
              <span className="text-xs">Hard</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleQualityRating(3)}
              className="flex-col h-16"
            >
              <Target className="h-5 w-5 mb-1" />
              <span className="text-xs">Good</span>
            </Button>
            <Button 
              variant="default" 
              onClick={() => handleQualityRating(5)}
              className="flex-col h-16"
            >
              <CheckCircle className="h-5 w-5 mb-1" />
              <span className="text-xs">Easy</span>
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Your rating determines when you'll see this card again
          </p>
        </motion.div>
      )}
    </div>
  );
}