"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Brain } from "lucide-react";
import { Sparkles } from "lucide-react";
import { BookOpen } from "lucide-react";
import { FileText } from "lucide-react";
import { Clock } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { RefreshCw } from "lucide-react";
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
  progress: externalProgress = 0,
  message,
  onRetry,
  showRetry = false,
  estimatedTime = 30
}: EnhancedLoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTakingLonger, setIsTakingLonger] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0);

  const messages = loadingMessages[type] || loadingMessages.general;
  const Icon = icons[type] || icons.general;

  // Use external progress if provided, otherwise simulate
  const progress = externalProgress > 0 ? externalProgress : simulatedProgress;

  useEffect(() => {
    // Simulate progress if no external progress provided
    if (externalProgress === 0) {
      const progressInterval = setInterval(() => {
        setSimulatedProgress(prev => {
          if (prev >= 95) return prev; // Stop at 95% until complete
          // Slow down as we approach 100%
          const increment = prev < 50 ? 3 : prev < 80 ? 2 : 1;
          return Math.min(prev + increment, 95);
        });
      }, 500);

      return () => clearInterval(progressInterval);
    }
  }, [externalProgress]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % messages.length);
    }, 2500);

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
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-6 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-4 max-w-sm"
      >
        {/* Enhanced Animated Icon with Pulse */}
        <div className="relative">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{
              rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary via-accent to-primary shadow-lg relative z-10"
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>

          {/* Pulsing rings */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-primary/30"
          />
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-0 rounded-full border border-accent/20"
          />
        </div>

        {/* "Please Wait" Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-1"
        >
          <p className="text-sm font-medium text-primary">Please wait...</p>
          <p className="text-xs text-muted-foreground">Your request is being processed</p>
        </motion.div>

        {/* Dynamic Message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-1"
          >
            <h3 className="text-lg font-semibold text-foreground leading-tight">
              {message || messages[currentMessageIndex]}
            </h3>
            <p className="text-xs text-muted-foreground">
              Usually takes ~{estimatedTime}s
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Compact Progress Bar */}
        <div className="w-full space-y-2">
          <Progress
            value={progress}
            className="h-1.5"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(progress)}%</span>
            <span>{formatTime(timeElapsed)}</span>
          </div>
        </div>

        {/* Taking Longer Alert - More Compact */}
        <AnimatePresence>
          {isTakingLonger && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20 py-2">
                <AlertTriangle className="h-3 w-3 text-yellow-600" />
                <AlertDescription className="text-xs text-yellow-800 dark:text-yellow-200">
                  Taking longer than usual. Please wait...
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Retry Button - More Compact */}
        {showRetry && onRetry && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Subtle animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
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
