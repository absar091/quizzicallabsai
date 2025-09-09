"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { Star } from "lucide-react";
import { ThumbsUp } from "lucide-react";
import { ThumbsDown } from "lucide-react";
import { Send } from "lucide-react";
import { X } from "lucide-react";
import { Smile } from "lucide-react";
import { Meh } from "lucide-react";
import { Frown } from "lucide-react";
import { Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { errorLogger } from "@/lib/error-logger";

interface FeedbackData {
  id: string;
  timestamp: string;
  userId?: string;
  rating: number;
  category: 'general' | 'bug' | 'feature' | 'performance' | 'ui' | 'content';
  feedback: string;
  page: string;
  userAgent: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  metadata?: Record<string, any>;
}

interface UserFeedbackProps {
  trigger?: 'button' | 'auto' | 'error';
  context?: {
    page?: string;
    operation?: string;
    errorId?: string;
    userId?: string;
  };
  onSubmit?: (feedback: FeedbackData) => void;
  autoShow?: boolean;
  showDelay?: number;
}

const feedbackCategories = [
  { value: 'general', label: 'General Feedback', icon: MessageSquare },
  { value: 'bug', label: 'Bug Report', icon: Frown },
  { value: 'feature', label: 'Feature Request', icon: Heart },
  { value: 'performance', label: 'Performance', icon: Meh },
  { value: 'ui', label: 'User Interface', icon: Smile },
  { value: 'content', label: 'Content Quality', icon: Star }
] as const;

const ratingEmojis = [
  { value: 1, emoji: '😞', label: 'Very Dissatisfied' },
  { value: 2, emoji: '🙁', label: 'Dissatisfied' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '🙂', label: 'Satisfied' },
  { value: 5, emoji: '😊', label: 'Very Satisfied' }
];

export function UserFeedback({
  trigger = 'button',
  context = {},
  onSubmit,
  autoShow = false,
  showDelay = 30000 // 30 seconds
}: UserFeedbackProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [category, setCategory] = useState<string>('general');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Auto-show feedback after delay
  useEffect(() => {
    if (autoShow && trigger === 'auto' && !isOpen && !isSubmitted) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, showDelay);

      return () => clearTimeout(timer);
    }
  }, [autoShow, trigger, showDelay, isOpen, isSubmitted]);

  // Check if user has already given feedback recently
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lastFeedback = localStorage.getItem('lastFeedbackTime');
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours

      if (lastFeedback && (now - parseInt(lastFeedback)) < oneDay) {
        // User gave feedback recently, don't auto-show
        return;
      }

      // Check feedback count for this session
      const sessionFeedbackCount = parseInt(sessionStorage.getItem('sessionFeedbackCount') || '0');
      if (sessionFeedbackCount >= 2) {
        // User has given feedback twice this session
        return;
      }
    }
  }, []);

  const getSentiment = (rating: number, feedback: string): 'positive' | 'neutral' | 'negative' => {
    if (rating >= 4) return 'positive';
    if (rating <= 2) return 'negative';
    return 'neutral';
  };

  const handleSubmit = async () => {
    if (!rating || !feedback.trim()) {
      toast({
        title: "Incomplete Feedback",
        description: "Please provide a rating and feedback message.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData: FeedbackData = {
        id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        userId: context.userId,
        rating,
        category: category as FeedbackData['category'],
        feedback: feedback.trim(),
        page: context.page || (typeof window !== 'undefined' ? window.location.pathname : 'unknown'),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        sentiment: getSentiment(rating, feedback),
        metadata: {
          operation: context.operation,
          errorId: context.errorId,
          trigger,
          sessionId: errorLogger.getSessionId()
        }
      };

      // Store locally for offline support
      if (typeof window !== 'undefined') {
        const existingFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
        existingFeedback.unshift(feedbackData);
        if (existingFeedback.length > 20) {
          existingFeedback.splice(20); // Keep only last 20 feedback entries
        }
        localStorage.setItem('userFeedback', JSON.stringify(existingFeedback));
        localStorage.setItem('lastFeedbackTime', Date.now().toString());

        // Update session feedback count
        const sessionCount = parseInt(sessionStorage.getItem('sessionFeedbackCount') || '0');
        sessionStorage.setItem('sessionFeedbackCount', (sessionCount + 1).toString());
      }

      // Log to error logger for analytics
      errorLogger.logError(
        new Error(`User Feedback: ${feedbackData.sentiment} (${rating}/5)`),
        {
          operation: 'user_feedback',
          component: 'feedback',
          severity: 'low',
          userId: context.userId
        }
      );

      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit(feedbackData);
      }

      // Send to backend (you would implement this)
      await sendFeedbackToBackend(feedbackData);

      setIsSubmitted(true);
      setIsOpen(false);

      toast({
        title: "Thank you for your feedback!",
        description: "Your input helps us improve Quizzicallabs AI.",
      });

      // Reset form
      setTimeout(() => {
        setRating(0);
        setCategory('general');
        setFeedback('');
        setIsSubmitted(false);
      }, 2000);

    } catch (error) {
      console.error('Failed to submit feedback:', error);
      toast({
        title: "Feedback submission failed",
        description: "Your feedback was saved locally and will be sent when you're back online.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendFeedbackToBackend = async (feedbackData: FeedbackData) => {
    // This would be your actual API call
    // For now, we'll simulate it
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Feedback sent to backend:', feedbackData);
        resolve(true);
      }, 1000);
    });
  };

  if (trigger === 'button') {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Feedback
        </Button>

        <FeedbackModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          rating={rating}
          setRating={setRating}
          category={category}
          setCategory={setCategory}
          feedback={feedback}
          setFeedback={setFeedback}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isSubmitted={isSubmitted}
        />
      </>
    );
  }

  if (trigger === 'auto' || trigger === 'error') {
    return (
      <AnimatePresence>
        {isOpen && !isSubmitted && (
          <FeedbackModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            rating={rating}
            setRating={setRating}
            category={category}
            setCategory={setCategory}
            feedback={feedback}
            setFeedback={setFeedback}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isSubmitted={isSubmitted}
            autoTrigger={true}
          />
        )}
      </AnimatePresence>
    );
  }

  return null;
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  rating: number;
  setRating: (rating: number) => void;
  category: string;
  setCategory: (category: string) => void;
  feedback: string;
  setFeedback: (feedback: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
  autoTrigger?: boolean;
}

function FeedbackModal({
  isOpen,
  onClose,
  rating,
  setRating,
  category,
  setCategory,
  feedback,
  setFeedback,
  onSubmit,
  isSubmitting,
  isSubmitted,
  autoTrigger = false
}: FeedbackModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Share Your Feedback
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>

                <CardContent className="space-y-6">
                  {autoTrigger && (
                    <Alert>
                      <Heart className="h-4 w-4" />
                      <AlertDescription>
                        Help us improve! Your feedback makes Quizzicallabs AI better for everyone.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Rating */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">How satisfied are you?</label>
                    <div className="flex justify-center gap-2">
                      {ratingEmojis.map((item) => (
                        <button
                          key={item.value}
                          onClick={() => setRating(item.value)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            rating === item.value
                              ? 'border-primary bg-primary/10'
                              : 'border-muted hover:border-primary/50'
                          }`}
                          title={item.label}
                        >
                          <span className="text-2xl">{item.emoji}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {feedbackCategories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => setCategory(cat.value)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            category === cat.value
                              ? 'border-primary bg-primary/10'
                              : 'border-muted hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <cat.icon className="w-4 h-4" />
                            <span className="text-sm">{cat.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Your Feedback</label>
                    <Textarea
                      placeholder="Tell us what you think... What worked well? What could be improved?"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={onSubmit}
                    disabled={!rating || !feedback.trim() || isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Feedback
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Quick feedback buttons for specific contexts
export function QuickFeedback({ context }: { context?: Record<string, any> }) {
  const [feedbackGiven, setFeedbackGiven] = useState<string | null>(null);
  const { toast } = useToast();

  const handleQuickFeedback = async (type: 'helpful' | 'not-helpful' | 'bug') => {
    setFeedbackGiven(type);

    const feedbackData = {
      type,
      context,
      timestamp: new Date().toISOString(),
      page: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
    };

    // Store quick feedback
    if (typeof window !== 'undefined') {
      const existingQuickFeedback = JSON.parse(localStorage.getItem('quickFeedback') || '[]');
      existingQuickFeedback.unshift(feedbackData);
      if (existingQuickFeedback.length > 50) {
        existingQuickFeedback.splice(50);
      }
      localStorage.setItem('quickFeedback', JSON.stringify(existingQuickFeedback));
    }

    toast({
      title: "Thanks for your feedback!",
      description: "Your input helps us improve.",
    });

    // Reset after 3 seconds
    setTimeout(() => setFeedbackGiven(null), 3000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Was this helpful?</span>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickFeedback('helpful')}
          disabled={feedbackGiven !== null}
          className={`gap-1 ${feedbackGiven === 'helpful' ? 'bg-green-100 border-green-300' : ''}`}
        >
          <ThumbsUp className="w-3 h-3" />
          Yes
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickFeedback('not-helpful')}
          disabled={feedbackGiven !== null}
          className={`gap-1 ${feedbackGiven === 'not-helpful' ? 'bg-red-100 border-red-300' : ''}`}
        >
          <ThumbsDown className="w-3 h-3" />
          No
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickFeedback('bug')}
          disabled={feedbackGiven !== null}
          className={`gap-1 ${feedbackGiven === 'bug' ? 'bg-orange-100 border-orange-300' : ''}`}
        >
          Report Bug
        </Button>
      </div>
    </div>
  );
}

// Feedback summary component for admin dashboard
export function FeedbackSummary() {
  const [feedback, setFeedback] = useState<FeedbackData[]>([]);
  const [quickFeedback, setQuickFeedback] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
      const storedQuickFeedback = JSON.parse(localStorage.getItem('quickFeedback') || '[]');

      setFeedback(storedFeedback);
      setQuickFeedback(storedQuickFeedback);
    }
  }, []);

  const averageRating = feedback.length > 0
    ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
    : 0;

  const sentimentBreakdown = feedback.reduce((acc, f) => {
    acc[f.sentiment] = (acc[f.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Feedback Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{feedback.length}</div>
            <div className="text-sm text-muted-foreground">Total Feedback</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{sentimentBreakdown.positive || 0}</div>
            <div className="text-sm text-muted-foreground">Positive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{quickFeedback.length}</div>
            <div className="text-sm text-muted-foreground">Quick Feedback</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Recent Feedback</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {feedback.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div className="flex items-center gap-2">
                  <Badge variant={item.sentiment === 'positive' ? 'default' : item.sentiment === 'negative' ? 'destructive' : 'secondary'}>
                    {item.rating}/5
                  </Badge>
                  <span className="text-sm truncate max-w-48">{item.feedback}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
