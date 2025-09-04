"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Brain, Sparkles, BookOpen, FileText, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EnhancedLoadingProps {
  type: 'quiz' | 'explanation' | 'flashcards' | 'study-guide' | 'general';
  progress?: number;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  estimatedTime?: number;
}

const loadingMessages = {
  quiz: [
    "Analyzing your topic...",
    "Crafting challenging questions...",
    "Ensuring syllabus compliance...",
    "Adding distractors and explanations...",
    "Finalizing your personalized quiz..."
  ],
  explanation: [
    "Analyzing your answer...",
    "Generating detailed explanation...",
    "Adding examples and analogies...",
    "Finalizing explanation..."
  ],
  flashcards: [
    "Identifying key concepts...",
    "Creating effective flashcards...",
    "Adding memory aids...",
    "Finalizing flashcard set..."
  ],
  'study-guide': [
    "Researching your topic...",
    "Structuring comprehensive guide...",
    "Adding examples and diagrams...",
    "Finalizing study guide..."
  ],
  general: [
    "Processing your request...",
    "Working on it...",
    "Almost there..."
  ]
};

const icons = {
  quiz: Sparkles,
  explanation: Brain,
  flashcards: BookOpen,
  'study-guide': FileText,
  general: Loader2
};

export function EnhancedLoading({
  type,
  progress = 0,
  message,
  onRetry,
  showRetry = false,
  estimatedTime = 30
}: EnhancedLoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTakingLonger, setIsTakingLonger] = useState(false);

  const messages = loadingMessages[type] || loadingMessages.general;
  const Icon = icons[type] || icons.general;

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % messages.length);
    }, 3000);

    const timeInterval = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1;
        if (newTime > estimatedTime && !isTakingLonger) {
          setIsTakingLonger(true);
        }
        return newTime;
      });
    }, 1000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(timeInterval);
    };
  }, [messages.length, estimatedTime, isTakingLonger]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg"
        >
          <Icon className="w-10 h-10 text-white" />
        </motion.div>

        {/* Dynamic Message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <h3 className="text-xl font-semibold text-foreground">
              {message || messages[currentMessageIndex]}
            </h3>
            <p className="text-muted-foreground">
              This usually takes {estimatedTime} seconds
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="w-full max-w-md space-y-2">
          <Progress
            value={progress}
            className="h-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{Math.round(progress)}% complete</span>
            <span>{formatTime(timeElapsed)} elapsed</span>
          </div>
        </div>

        {/* Taking Longer Alert */}
        <AnimatePresence>
          {isTakingLonger && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="max-w-md border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                  This is taking longer than expected. Our AI is working hard on your request!
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Retry Button */}
        {showRetry && onRetry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={onRetry}
              variant="outline"
              className="mt-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Specialized loading components for different use cases
export function QuizGenerationLoading({ progress = 0, onRetry }: { progress?: number; onRetry?: () => void }) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Generating Your Quiz
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EnhancedLoading
          type="quiz"
          progress={progress}
          estimatedTime={45}
          onRetry={onRetry}
          showRetry={!!onRetry}
        />
      </CardContent>
    </Card>
  );
}

export function ExplanationLoading({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <EnhancedLoading
          type="explanation"
          estimatedTime={20}
          onRetry={onRetry}
          showRetry={!!onRetry}
        />
      </CardContent>
    </Card>
  );
}

export function FlashcardGenerationLoading({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <EnhancedLoading
          type="flashcards"
          estimatedTime={25}
          onRetry={onRetry}
          showRetry={!!onRetry}
        />
      </CardContent>
    </Card>
  );
}
