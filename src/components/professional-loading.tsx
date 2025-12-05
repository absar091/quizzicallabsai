"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Brain, BookOpen, FileText, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProfessionalLoadingProps {
  message?: string;
  submessage?: string;
  estimatedTime?: number;
  showProgress?: boolean;
}

const floatingIcons = [
  { Icon: Sparkles, delay: 0, duration: 3 },
  { Icon: Brain, delay: 0.5, duration: 3.5 },
  { Icon: BookOpen, delay: 1, duration: 4 },
  { Icon: FileText, delay: 1.5, duration: 3.2 },
  { Icon: Zap, delay: 2, duration: 3.8 },
];

export function ProfessionalLoading({
  message = "Loading",
  submessage = "Please wait while we prepare everything for you",
  estimatedTime = 5,
  showProgress = true
}: ProfessionalLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");

  // Smooth progress animation
  useEffect(() => {
    if (!showProgress) return;

    const duration = estimatedTime * 1000;
    const interval = 50;
    const steps = duration / interval;
    const increment = 95 / steps; // Stop at 95%

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        return next >= 95 ? 95 : next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [estimatedTime, showProgress]);

  // Animated dots
  useEffect(() => {
    const timer = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md px-6">
        {/* Floating background icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingIcons.map(({ Icon, delay, duration }, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${15 + i * 18}%`,
                top: `${20 + (i % 2) * 40}%`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Icon className="w-8 h-8 text-primary/20" />
            </motion.div>
          ))}
        </div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative bg-card border border-border rounded-2xl shadow-2xl p-8 space-y-6"
        >
          {/* Animated logo/spinner */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Outer rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary"
              />
              
              {/* Inner pulsing circle */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              >
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </motion.div>

              {/* Orbiting particles */}
              {[0, 120, 240].map((angle, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                  }}
                  animate={{
                    x: [
                      Math.cos((angle * Math.PI) / 180) * 35,
                      Math.cos(((angle + 360) * Math.PI) / 180) * 35,
                    ],
                    y: [
                      Math.sin((angle * Math.PI) / 180) * 35,
                      Math.sin(((angle + 360) * Math.PI) / 180) * 35,
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Text content */}
          <div className="text-center space-y-2">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-semibold text-foreground"
            >
              {message}
              <span className="inline-block w-8 text-left">{dots}</span>
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-muted-foreground"
            >
              {submessage}
            </motion.p>
          </div>

          {/* Progress bar */}
          {showProgress && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round(progress)}%</span>
                <span>~{estimatedTime}s</span>
              </div>
            </motion.div>
          )}

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
          </motion.div>
        </motion.div>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground mt-4"
        >
          This usually takes just a few seconds
        </motion.p>
      </div>
    </div>
  );
}

// Specialized loading for exam modules
export function ExamModuleLoading() {
  return (
    <ProfessionalLoading
      message="Loading Exam Modules"
      submessage="Preparing your personalized study materials"
      estimatedTime={3}
      showProgress={true}
    />
  );
}

// Specialized loading for quiz generation
export function QuizGenerationLoading() {
  return (
    <ProfessionalLoading
      message="Generating Your Quiz"
      submessage="Our AI is crafting personalized questions for you"
      estimatedTime={30}
      showProgress={true}
    />
  );
}

// Specialized loading for study guide
export function StudyGuideLoading() {
  return (
    <ProfessionalLoading
      message="Creating Study Guide"
      submessage="Compiling comprehensive learning materials"
      estimatedTime={25}
      showProgress={true}
    />
  );
}
