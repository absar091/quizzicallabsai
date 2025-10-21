"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import * as z from "zod";
import { ref, set, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import { AnimatePresence, motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Sparkles } from "lucide-react";
import { BrainCircuit, Loader2, CheckCircle, XCircle, MessageSquareQuote, Star, Download, Redo, RefreshCw, Brain, Lightbulb, LayoutDashboard, ArrowLeft, ArrowRight, Share2, Users, MessageCircle, Heart } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { usePlan } from "@/hooks/usePlan";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import RichContentRenderer from "@/components/rich-content-renderer";
import { FormItem, FormControl } from "@/components/ui/form";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { QuizSharingDialog } from "@/components/quiz-sharing";
import { SafeComponent } from "@/components/safe-component";
import { QuizQuestionSkeleton } from "@/components/loading-skeletons";
import { useQuizKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { KeyboardShortcutsHelp } from "@/components/keyboard-shortcuts-help";
import { BookmarkButton } from "@/components/bookmark-button";

// Dynamic imports for code splitting
const QuizSetupForm = dynamic(() => import('@/components/quiz-wizard/quiz-setup-form').catch(() => ({ default: () => <QuizLoadingSkeleton /> })), {
  loading: () => <QuizLoadingSkeleton />,
  ssr: false
});

const QuizTaker = dynamic(() => import('@/components/quiz-wizard/quiz-taker').catch(() => ({ default: () => <QuizLoadingSkeleton /> })), {
  loading: () => <QuizLoadingSkeleton />,
  ssr: false
});

const QuizResults = dynamic(() => import('@/components/quiz-wizard/quiz-results').catch(() => ({ default: () => <QuizLoadingSkeleton /> })), {
  loading: () => <QuizLoadingSkeleton />,
  ssr: false
});

const FlashcardViewer = dynamic(() => import('@/components/quiz-wizard/flashcard-viewer').catch(() => ({ default: () => <QuizLoadingSkeleton /> })), {
  loading: () => <QuizLoadingSkeleton />,
  ssr: false
});

// Import types and utilities
import type { GenerateCustomQuizOutput, GenerateFlashcardsOutput } from "@/types/ai";
import {
    getQuizState,
    saveQuizState,
    getBookmarks,
    getQuizResults,
    saveQuizResult,
    deleteQuizState,
    deleteBookmark,
    saveBookmark
} from "@/lib/indexed-db";

function QuizLoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60svh] text-center p-4">
      <div className="relative">
        <BrainCircuit className="h-20 w-20 text-primary" />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="h-8 w-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </motion.div>
      </div>
      <h2 className="text-2xl font-semibold mb-2 mt-6">Loading Quiz...</h2>
      <p className="text-muted-foreground max-w-sm">Preparing your personalized quiz experience.</p>
    </div>
  );
}

const formSchema = z.object({
  topic: z.string().min(1, "Topic is required."),
  difficulty: z.enum(["easy", "medium", "hard", "master"]),
  numberOfQuestions: z.number().min(1).max(55),
  questionTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one question type.",
  }),
  questionStyles: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one question style.",
  }),
  timeLimit: z.number().min(1).max(120),
  specificInstructions: z.string().optional(),
});

export type QuizFormValues = z.infer<typeof formSchema>;
export type Quiz = GenerateCustomQuizOutput["quiz"];

// Add a type alias for compatibility
export type ComponentQuizShape = Quiz;
type Flashcard = GenerateFlashcardsOutput["flashcards"][0];

interface ExplanationState {
  [questionIndex: number]: {
    isLoading: boolean;
    explanation: string | null;
    isSimpleLoading: boolean;
    simpleExplanation: string | null;
  };
}

interface BookmarkedQuestion {
  userId: string;
  question: string;
  correctAnswer: string;
  topic: string;
}

const addPdfHeaderAndFooter = (doc: any, title: string, difficulty: string, isPro: boolean) => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text("Quizzicallabs™", pageWidth / 2, 15, { align: 'center' });

        doc.setFontSize(14);
        doc.text(`Quiz Topic: ${title}`, pageWidth / 2, 25, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Difficulty: ${difficulty}`, pageWidth / 2, 31, { align: 'center' });

        doc.setLineWidth(0.2);
        doc.line(20, 38, pageWidth - 20, 38);

        // Watermark for free users
        if (!isPro) {
            doc.saveGraphicsState();
            doc.setFontSize(60);
            doc.setTextColor(230, 230, 230);
            doc.setGState(new (doc as any).GState({opacity: 0.5}));
            doc.text("Quizzicallabs AI", pageWidth / 2, pageHeight / 2, { angle: 45, align: 'center' });
            doc.restoreGraphicsState();
        }

        // Footer
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setLineWidth(0.2);
        doc.line(20, pageHeight - 18, pageWidth - 20, pageHeight - 18);
        doc.text(`Generated by Quizzicallabs™ - A Project By Absar Ahmad Rao`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
}

type GenerateQuizPageProps = {
  initialQuiz?: Quiz;
  initialFormValues?: QuizFormValues;
  initialComprehensionText?: string;
}

// --- Main Page Component ---
export default function GenerateQuizPage({ initialQuiz, initialFormValues, initialComprehensionText }: GenerateQuizPageProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isPro } = usePlan();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [comprehensionText, setComprehensionText] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [explanations, setExplanations] = useState<ExplanationState>({});

  const [formValues, setFormValues] = useState<QuizFormValues | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Study time tracking
  const [studyStartTime, setStudyStartTime] = useState<Date | null>(null);
  const [isQuestionActive, setIsQuestionActive] = useState(false);

  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  const [generatedFlashcards, setGeneratedFlashcards] = useState<Flashcard[] | null>(null);
  const [showFlashcardViewer, setShowFlashcardViewer] = useState(false);


  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);

  const formMethods = useForm<QuizFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      difficulty: "medium",
      numberOfQuestions: 10,
      questionTypes: ["Multiple Choice"],
      questionStyles: ["Knowledge-based", "Conceptual"],
      timeLimit: 10,
      specificInstructions: "",
    },
  });

  const calculateScore = useCallback(() => {
    if (!quiz) return { score: 0, percentage: 0, totalScorable: 0 };
    const score = quiz.reduce((acc, question, index) => {
      const userAnswer = userAnswers[index];
      const correctAnswer = question.correctAnswer;
      if (question.type === 'descriptive' || correctAnswer === undefined) {
        return acc;
      }
      return acc + (correctAnswer === userAnswer ? 1 : 0);
    }, 0);

    const scorableQuestions = quiz.filter(q => q.type !== 'descriptive' && q.correctAnswer !== undefined).length;
    const percentage = scorableQuestions > 0 ? (score / scorableQuestions) * 100 : 0;

    return { score, percentage, totalScorable: scorableQuestions };
  }, [quiz, userAnswers]);


  const handleSubmit = useCallback(async () => {
    // Prevent multiple submissions if already submitting
    if (isSubmitting || showResults) return;

    console.log('🎯 Quiz submission started');
    setIsSubmitting(true);

    // 🐛 BUG FIX: Clear timer SYNCHRONOUSLY BEFORE setting showResults
    // This prevents race condition where timer fires again after setShowResults(true)
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null; // Explicitly set to null to prevent further executions
    }

    // If we're running inside the multi-section mock test flow, the parent page
    // installs a global override so it can collect section answers and drive
    // generation of the next section. Detect that and delegate submission to
    // the parent instead of performing the normal cloud/local saves.
    try {
      const mockOverride = (typeof window !== 'undefined') ? (window as any).__MOCK_TEST_SUBMIT_OVERRIDE__ : null;
      if (mockOverride && typeof mockOverride === 'function') {
        console.log('🔁 Delegating submission to mock-test override');
        // Show results locally for the section so user sees the result card
        setShowResults(true);
        // Call the parent callback with the section answers (array of string|null)
        try {
          mockOverride(userAnswers);
        } catch (err) {
          console.error('Error in mock test submit override:', err);
        }
        setIsSubmitting(false);
        return; // Skip the rest of the normal submit flow
      }
    } catch (err) {
      console.error('Error checking for mock override:', err);
    }

    // Check authentication state before proceeding
    if (!user) {
      console.error('❌ User not authenticated during quiz submission');
      toast({
        title: "Authentication Error",
        description: "Please log in again to save your quiz results.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    setShowResults(true);

    try {
      if (quiz && formValues && user) {
        console.log('🎯 Starting quiz submission for user:', user.uid);
        
        const { score, percentage } = calculateScore();
        const resultId = `${user.uid}-${Date.now()}`;

        // Calculate time taken: initial time - remaining time
        const initialTimeSeconds = formValues.timeLimit * 60;
        const timeSpent = initialTimeSeconds - timeLeft;
        const timeTaken = Math.max(0, timeSpent); // Ensure non-negative time

        console.log('Study time calculation:', {
          initialTimeSeconds,
          timeLeft,
          timeSpent,
          timeTaken,
          timeLimit: formValues.timeLimit
        });

        const newResult = {
          id: resultId,
          userId: user.uid,
          topic: formValues.topic,
          score,
          total: quiz.length,
          percentage,
          date: new Date().toISOString(),
          timeTaken: timeTaken, // Track actual study time
          createdAt: Date.now(), // Add timestamp for indexing
        };

        console.log('📝 Saving quiz result:', { resultId, score, percentage, topic: formValues.topic });

        // Try to save to Firebase first
        try {
          const resultRef = ref(db, `quizResults/${user.uid}/${resultId}`);
          await set(resultRef, newResult);
          console.log('✅ Firebase save successful');
        } catch (firebaseError: any) {
          console.error('❌ Firebase save failed:', firebaseError);
          console.error('Firebase error details:', {
            code: firebaseError.code,
            message: firebaseError.message,
            userId: user.uid,
            path: `quizResults/${user.uid}/${resultId}`,
            authState: !!user,
            userEmail: user.email
          });
          
          // Log additional context for debugging
          console.log('🔍 Additional context:', {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            online: navigator.onLine
          });
          
          // Continue with local save even if Firebase fails
        }

        // Run IndexedDB save, cleanup, and email preparation in parallel for better performance
        console.log('🔄 Starting parallel operations: IndexedDB save, cleanup, and email...');
        
        const [localSaveResult, cleanupResult] = await Promise.allSettled([
          // Save to local IndexedDB
          saveQuizResult(newResult).catch(error => {
            console.error('❌ Local save failed:', error.message);
            return null;
          }),
          // Clean up quiz state
          deleteQuizState(user.uid).catch(error => {
            console.error('⚠️ Quiz state cleanup failed:', error.message);
            return null;
          })
        ]);

        if (localSaveResult.status === 'fulfilled') {
          console.log('✅ IndexedDB save completed');
        }
        if (cleanupResult.status === 'fulfilled') {
          console.log('✅ Quiz cleanup completed');
        }
        
        // Send quiz result email - optimized for speed (Pro users only)
        try {
          console.log('📧 Email section - checking conditions:', {
            hasEmail: !!user.email,
            hasFormValues: !!formValues,
            isPro,
            userPlan: user?.plan || 'unknown'
          });
          
          if (!user.email || !formValues) {
            console.log('⚠️ Skipping email: missing email or form data');
          } else if (!isPro) {
            console.log('⚠️ User is not Pro, but sending email for testing');
            // TEMPORARY: Send email to all users for testing
            console.log('📧 Sending quiz result email to:', user.email);
            console.log('📧 Email payload:', {
              type: 'quiz-result',
              to: user.email,
              userName: user.displayName || user.email?.split('@')[0] || 'Student',
              topic: formValues.topic,
              score,
              total: quiz.length,
              percentage,
              timeTaken: timeTaken,
              date: new Date().toISOString()
            });

            // Send email with timeout for better UX
            const emailPromise = fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'quiz-result',
                to: user.email,
                userName: user.displayName || user.email?.split('@')[0] || 'Student',
                topic: formValues.topic,
                score,
                total: quiz.length,
                percentage,
                timeTaken: timeTaken,
                date: new Date().toISOString()
              })
            });

            // Add timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Email timeout')), 5000)
            );

            try {
              const emailResponse = await Promise.race([emailPromise, timeoutPromise]) as Response;
              const emailResult = await emailResponse.json();
              
              if (emailResponse.ok && emailResult.success) {
                console.log('✅ Email sent:', emailResult.messageId);
                toast({
                  title: "Quiz Complete! 📧",
                  description: `Results sent to ${user.email}. Check your inbox!`,
                  duration: 5000,
                });
              } else {
                console.error('❌ Email failed:', emailResult.error);
                toast({
                  title: "Quiz Complete!",
                  description: `Quiz saved successfully. Email failed: ${emailResult.error || 'Unknown error'}`,
                  variant: "default",
                });
              }
            } catch (emailError: any) {
              console.error('❌ Email error:', emailError.message);
              toast({
                title: "Quiz Complete!",
                description: `Quiz saved successfully. Email error: ${emailError.message}`,
                variant: "default",
              });
            }
            return; // Exit early after handling non-Pro user
          } else {
            console.log('📧 Sending quiz result email to:', user.email);
            console.log('📧 Email payload:', {
              type: 'quiz-result',
              to: user.email,
              userName: user.displayName || user.email?.split('@')[0] || 'Student',
              topic: formValues.topic,
              score,
              total: quiz.length,
              percentage,
              timeTaken: timeTaken,
              date: new Date().toISOString()
            });

            // Send email with timeout for better UX
            const emailPromise = fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'quiz-result',
                to: user.email,
                userName: user.displayName || user.email?.split('@')[0] || 'Student',
                topic: formValues.topic,
                score,
                total: quiz.length,
                percentage,
                timeTaken: timeTaken,
                date: new Date().toISOString()
              })
            });

            // Add timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Email timeout')), 5000)
            );

            try {
              const emailResponse = await Promise.race([emailPromise, timeoutPromise]) as Response;
              const emailResult = await emailResponse.json();
              
              if (emailResponse.ok && emailResult.success) {
                console.log('✅ Email sent:', emailResult.messageId);
                toast({
                  title: "Quiz Complete! 📧",
                  description: `Results sent to ${user.email}. Check your inbox!`,
                  duration: 5000,
                });
              } else {
                console.error('❌ Email failed:', emailResult.error);
                toast({
                  title: "Quiz Complete!",
                  description: `Quiz saved successfully. Email failed: ${emailResult.error || 'Unknown error'}`,
                  variant: "default",
                });
              }
            } catch (emailError: any) {
              console.error('❌ Email error:', emailError.message);
              toast({
                title: "Quiz Complete!",
                description: `Quiz saved successfully. Email error: ${emailError.message}`,
                variant: "default",
              });
            }
          }
        } catch (emailSectionError: any) {
          console.error('❌ Email section error:', emailSectionError.message);
          toast({
            title: "Quiz Complete!",
            description: "Quiz saved successfully. Email system encountered an error.",
            variant: "default",
          });
        }

        console.log('🎉 Quiz submission completed successfully');
        console.log('🎉 Email sending completed (check logs above for details)');
      } else {
        console.error('❌ Missing required data for quiz submission:', {
          hasQuiz: !!quiz,
          hasFormValues: !!formValues,
          hasUser: !!user,
          userUid: user?.uid
        });
        throw new Error('Missing required data for quiz submission');
      }
    } catch (error: any) {
      console.error('❌ Error submitting quiz:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      // Show user-friendly error message based on error type
      if (error.code === 'PERMISSION_DENIED' || error.message?.includes('permission')) {
        toast({
          title: "Permission Error",
          description: "Unable to save to cloud. Your results are saved locally. Please check your internet connection.",
          variant: "destructive",
        });
      } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('network')) {
        toast({
          title: "Network Error", 
          description: "Connection issue detected. Your results are saved locally and will sync when online.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Quiz Submission Error",
          description: "There was an issue saving your quiz results. Your answers have been saved locally.",
          variant: "destructive",
        });
      }
      
      // Don't reset showResults - let user see their results even if save failed
      // setShowResults(false); // Reset to allow retry
    } finally {
      setIsSubmitting(false);
    }

    // Scroll to top after a brief delay to ensure results are rendered
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, [quiz, userAnswers, formValues, user, calculateScore, timeLeft, isSubmitting, showResults]);


  useEffect(() => {
    const initializeQuiz = async () => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const urlParams = new URLSearchParams(window.location.search);
        const isSharedAccess = urlParams.get('shared') === 'true';

        // Check for shared quiz data in sessionStorage
        const sharedQuizData = sessionStorage.getItem('sharedQuizData');

        if (sharedQuizData && isSharedAccess) {
            try {
                const sharedData = JSON.parse(sharedQuizData) as {
                    quiz: any;
                    formValues: QuizFormValues;
                    isShared?: boolean;
                };

                // Ensure shared quiz data has proper type structure
                let quizData: Quiz = [];
                if (Array.isArray(sharedData.quiz)) {
                    quizData = sharedData.quiz.map((q: any) => ({
                        type: q.type || (q.answers && q.answers.length > 0 ? "multiple-choice" : "descriptive"),
                        question: q.question || "",
                        smiles: q.smiles,
                        answers: q.answers,
                        correctAnswer: q.correctAnswer
                    }));
                }

                if (quizData.length > 0) {
                    setQuiz(quizData);
                    setFormValues(sharedData.formValues);
                    setComprehensionText(null); // Shared quizzes don't have comprehension text
                    setUserAnswers(new Array(quizData.length).fill(null));
                    setTimeLeft(sharedData.formValues.timeLimit * 60);
                    setShowResults(false);

                    // Clear shared data to prevent conflicts
                    sessionStorage.removeItem('sharedQuizData');
                    return;
                }
            } catch (error) {
                console.error('Error parsing shared quiz data:', error);
                sessionStorage.removeItem('sharedQuizData');
            }
        }

        const mockTestAnswers = (window as any).__MOCK_TEST_ANSWERS__;
    console.debug('GenerateQuizPage init: found __MOCK_TEST_ANSWERS__', { mockTestAnswers });
        if (initialQuiz && initialFormValues && mockTestAnswers) {
      // Ensure shape is an array; if not attempt to extract possible wrapped property
      let answersArray: any = mockTestAnswers;
      if (!Array.isArray(answersArray) && typeof answersArray === 'object' && answersArray !== null) {
        // Try common keys
        if (Array.isArray(answersArray.answers)) {
          answersArray = answersArray.answers;
        } else if (Array.isArray(answersArray.allUserAnswers)) {
          answersArray = answersArray.allUserAnswers;
        } else {
          console.warn('GenerateQuizPage: received non-array mock answers, attempting best-effort conversion', { mockTestAnswers });
          // As a last resort, wrap single scalar into array
          answersArray = [answersArray];
        }
      }

      console.debug('GenerateQuizPage init: using answersArray length', { length: Array.isArray(answersArray) ? answersArray.length : 'not-array' });
      setQuiz(initialQuiz);
      setFormValues(initialFormValues);
      setUserAnswers(Array.isArray(answersArray) ? answersArray : new Array(initialQuiz.length).fill(null));
      setShowResults(true);
      delete (window as any).__MOCK_TEST_ANSWERS__;
      return;
        }

        if (initialQuiz && initialFormValues) {
            // Handle both data shapes: { quiz: Quiz[] } or Quiz[] directly
            let quizData: Quiz = [];
            
            if (Array.isArray(initialQuiz)) {
                // Ensure each question has the required type property
                quizData = initialQuiz.map((q: any) => ({
                    type: q.type || (q.answers && q.answers.length > 0 ? "multiple-choice" : "descriptive"),
                    question: q.question || "",
                    smiles: q.smiles,
                    answers: q.answers,
                    correctAnswer: q.correctAnswer
                }));
            } else if ((initialQuiz as any).questions) {
                // If it's in the { questions: [] } format
                quizData = (initialQuiz as any).questions.map((q: any) => ({
                    type: q.type || (q.answers && q.answers.length > 0 ? "multiple-choice" : "descriptive"),
                    question: q.question || "",
                    smiles: q.smiles,
                    answers: q.answers,
                    correctAnswer: q.correctAnswer
                }));
            }

            if (quizData.length > 0) {
                setQuiz(quizData);
                setComprehensionText(initialComprehensionText || null);
                setUserAnswers(new Array(quizData.length).fill(null));
                setTimeLeft(initialFormValues.timeLimit * 60);
                setFormValues({
                    topic: initialFormValues.topic,
                    difficulty: initialFormValues.difficulty,
                    numberOfQuestions: initialFormValues.numberOfQuestions,
                    questionTypes: initialFormValues.questionTypes,
                    questionStyles: initialFormValues.questionStyles,
                    timeLimit: initialFormValues.timeLimit,
                    specificInstructions: initialFormValues.specificInstructions
                });
                setShowResults(false);
                return;
            }
        }

        if (user && !isSharedAccess) {
            const savedState = await getQuizState(user.uid);
            if (savedState && savedState.quiz && savedState.formValues) {
                // Handle IndexedDB QuizState which has different format than component state
                let quizData: Quiz = [];
                
                if (Array.isArray(savedState.quiz)) {
                    // If it's already an array, ensure each question has the required type property
                    quizData = savedState.quiz.map((q: any) => ({
                        type: q.type || (q.answers && q.answers.length > 0 ? "multiple-choice" : "descriptive"),
                        question: q.question || "",
                        smiles: q.smiles,
                        answers: q.answers,
                        correctAnswer: q.correctAnswer
                    }));
                } else if (savedState.quiz?.questions) {
                    // If it's in the { questions: [] } format
                    quizData = savedState.quiz.questions.map((q: any) => ({
                        type: q.type || (q.answers && q.answers.length > 0 ? "multiple-choice" : "descriptive"),
                        question: q.question || "",
                        smiles: q.smiles,
                        answers: q.answers,
                        correctAnswer: q.correctAnswer
                    }));
                }

                // Only set state if we have valid quiz data
                if (quizData.length > 0) {
                    setQuiz(quizData);
                    setComprehensionText(savedState.comprehensionText || null);
                    setCurrentQuestion(savedState.currentQuestion || 0);
                    setUserAnswers(savedState.userAnswers || []);
                    setTimeLeft(savedState.timeLeft || 0);

                    // Convert IndexedDB formValues to component format
                    if (savedState.formValues) {
                        setFormValues({
                            topic: savedState.formValues.topic || "",
                            difficulty: (savedState.formValues.difficulty as "easy" | "medium" | "hard" | "master") || "medium",
                            numberOfQuestions: savedState.formValues.numberOfQuestions || 10,
                            questionTypes: ["Multiple Choice"], // Default fallback
                            questionStyles: ["Knowledge-based"], // Default fallback
                            timeLimit: savedState.formValues.quizType === "timed" ? 10 : 60, // Default fallback
                            specificInstructions: ""
                        });
                    }
                    setShowResults(false);
                    return;
                }
            }
        }

        setQuiz(null);
        setShowResults(false);
    };

    initializeQuiz();
  }, [user, initialQuiz, initialFormValues, initialComprehensionText]);


  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<BookmarkedQuestion[]>([]);

  useEffect(() => {
    async function loadBookmarks() {
        if (user) {
            const bookmarks = await getBookmarks(user.uid);
            setBookmarkedQuestions(bookmarks);
        }
    }
    loadBookmarks();
  }, [user]);

  useEffect(() => {
    async function persistState() {
        if (user && quiz && !showResults && !initialQuiz) {
            // Convert component state to IndexedDB compatible format
            const quizStateForDB = {
                // IndexedDB expects { questions: [] } format
                quiz: { questions: quiz, topic: formValues?.topic || '', difficulty: formValues?.difficulty || 'medium' } as any,
                comprehensionText,
                currentQuestion,
                userAnswers,
                timeLeft,
                formValues: formValues ? {
                    // This won't perfectly map all fields, but saves the essential ones
                    ...formValues,
                    quizType: formValues.timeLimit > 0 ? 'timed' : 'practice',
                    includeComprehension: !!comprehensionText
                } as any : null,
            };
            await saveQuizState(user.uid, quizStateForDB);
        }
    }
    persistState();
  }, [quiz, comprehensionText, currentQuestion, userAnswers, timeLeft, formValues, showResults, user, initialQuiz]);


  useEffect(() => {
    if (quiz && !showResults && timeLeft > 0) {
      // Clear any existing timer before starting a new one
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    // Cleanup function to clear the interval when the component unmounts
    // or when the dependencies change.
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quiz, showResults, timeLeft, handleSubmit]);

  const handleGenerateQuiz = async (values: QuizFormValues) => {
    setIsGenerating(true);
    setFormValues(values);
    setGenerationProgress(0);

    const interval = setInterval(() => {
        setGenerationProgress(prev => {
            if (prev >= 95) {
                clearInterval(interval);
                return prev;
            }
            return prev + 5;
        })
    }, 500);

    setQuiz(null);
    setComprehensionText(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResults(false);
    setExplanations({});

    try {
      const recentQuizHistory = user ? (await getQuizResults(user.uid)).slice(0, 5) : [];
      const historyForAI = recentQuizHistory.map(r => ({ topic: r.topic, percentage: r.percentage }));

      const response = await fetch("/api/ai/custom-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          isPro: isPro,
          userAge: user?.age,
          userClass: user?.className,
          recentQuizHistory: historyForAI,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate quiz");
      }

      const result = await response.json();
      clearInterval(interval);
      setGenerationProgress(100);

      setTimeout(() => {
        if (!result.quiz || result.quiz.length === 0) {
           throw new Error("The AI returned an empty quiz. This can happen with very niche topics. Please try broadening your topic or rephrasing your instructions.");
        }
        setQuiz(result.quiz);
        setComprehensionText(result.comprehensionText || null);
        setUserAnswers(new Array(result.quiz.length).fill(null));
        setTimeLeft(values.timeLimit * 60);
        setIsGenerating(false);
        setFormValues(values);
      }, 500)

    } catch (error: any) {
        clearInterval(interval);
        setIsGenerating(false);
        setFormValues(null);

        let errorMessage = "An unexpected error occurred while generating your quiz.";
        let errorTitle = "Error Generating Quiz";

        console.error("Quiz generation error:", error);

        // Handle specific error types from the error object
        if (error.message && (error.message.includes("rate limit") || error.message.includes("429"))) {
          errorTitle = "Rate Limit Reached";
          errorMessage = "You've made too many requests. Please wait a minute and try again.";
        } else if (error.message && (error.message.includes("overloaded") || error.message.includes("503"))) {
          errorTitle = "Service Overloaded";
          errorMessage = "Our AI service is currently busy. Please try again in a few minutes.";
        } else if (error.message && (error.message.includes("Empty") || error.message.includes("no quiz") || error.message.includes("broaden"))) {
          errorTitle = "Content Issue";
          errorMessage = "The AI couldn't generate a valid quiz for this topic. Try broadening your topic or providing more context.";
        } else if (error.message && error.message.includes("Failed to generate")) {
          errorTitle = "Server Error";
          errorMessage = "Our servers are having issues. Please try again in a moment.";
        } else if (error.message && error.message.includes("timeout")) {
          errorTitle = "Request Timeout";
          errorMessage = "The request took too long. Please try again.";
        } else if (error.message) {
          // Use the actual error message from the server
          errorMessage = error.message;
        }

        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
        });
    }
  };


  const handleAnswer = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (quiz?.length ?? 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getExplanation = async (questionIndex: number) => {
    if (!quiz || !formValues) return;
    const question = quiz[questionIndex];
    setExplanations((prev) => ({
      ...prev,
      [questionIndex]: { ...prev[questionIndex], isLoading: true, explanation: null },
    }));

    try {
      const response = await fetch("/api/generate-explanation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.question,
          studentAnswer: userAnswers[questionIndex] || "",
          correctAnswer: question.correctAnswer || "N/A",
          topic: formValues.topic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate explanation");
      }

      const result = await response.json();
      setExplanations((prev) => ({
        ...prev,
        [questionIndex]: { ...prev[questionIndex], isLoading: false, explanation: result.explanation },
      }));
    } catch (error) {
      toast({
        title: "Error Generating Explanation",
        description: "An error occurred while generating the explanation. Please try again.",
        variant: "destructive",
      });
       setExplanations((prev) => ({
        ...prev,
        [questionIndex]: { ...prev[questionIndex], isLoading: false, explanation: "Could not load explanation." },
      }));
      console.error(error);
    }
  };

  const getSimpleExplanation = async (questionIndex: number) => {
    if (!quiz || !formValues) return;
    const question = quiz[questionIndex];
    setExplanations((prev) => ({
      ...prev,
      [questionIndex]: { ...prev[questionIndex], isSimpleLoading: true, simpleExplanation: null },
    }));

    try {
      const response = await fetch("/api/generate-simple-explanation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.question,
          correctAnswer: question.correctAnswer || "N/A",
          topic: formValues.topic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate simple explanation");
      }

      const result = await response.json();
      setExplanations((prev) => ({
          ...prev,
          [questionIndex]: { ...prev[questionIndex], isSimpleLoading: false, simpleExplanation: result.explanation },
      }));
    } catch (error) {
        toast({
            title: "Error Simplifying",
            description: "Could not generate a simpler explanation at this time.",
            variant: "destructive",
        });
        setExplanations((prev) => ({
            ...prev,
            [questionIndex]: { ...prev[questionIndex], isSimpleLoading: false, simpleExplanation: "Could not load simple explanation." },
        }));
    }
  }

  const handleGenerateFlashcards = async () => {
    if (!quiz || !formValues) return;
    const incorrectQuestions = quiz
        .map((q, i) => ({ ...q, userAnswer: userAnswers[i] }))
        .filter(q => q.correctAnswer !== q.userAnswer && q.type !== 'descriptive');

    if (incorrectQuestions.length === 0) {
        toast({ title: "Nothing to review!", description: "You answered all questions correctly." });
        return;
    }

    setIsGeneratingFlashcards(true);
    setGeneratedFlashcards(null);

    try {
      const response = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: formValues.topic,
          incorrectQuestions: incorrectQuestions.map(q => ({
            question: q.question,
            userAnswer: q.userAnswer || null,
            correctAnswer: q.correctAnswer || '',
          })),
          isPro: user?.plan === 'Pro' || false,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate flashcards");
      }

      if (!result.flashcards || result.flashcards.length === 0) {
        toast({ title: "No flashcards generated", description: "The AI didn't find any concepts from your incorrect answers to turn into flashcards." });
      } else {
        setGeneratedFlashcards(result.flashcards);
        setShowFlashcardViewer(true);
      }
    } catch (error: any) {
        console.error('Flashcard generation error:', error);
        toast({
          title: "Error Generating Flashcards",
          description: error.message || "Could not generate flashcards at this time.",
          variant: "destructive"
        });
    } finally {
        setIsGeneratingFlashcards(false);
    }
  }


  const downloadQuestions = async () => {
    if (!quiz || !formValues) return;
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    let y = 45;
    const pageHeight = 270;
    const margin = 20;
    const maxWidth = doc.internal.pageSize.getWidth() - (margin * 2);

    const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight) {
            doc.addPage();
            y = 45;
        }
    };

    quiz.forEach((q, i) => {
        checkPageBreak(30);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(doc.splitTextToSize(`${i + 1}. ${q.question}`, maxWidth), margin, y);
        y += (doc.splitTextToSize(`${i + 1}. ${q.question}`, maxWidth).length * 5) + 5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        if (q.answers) {
            q.answers.forEach((a, ansIndex) => {
                checkPageBreak(5);
                const letter = String.fromCharCode(65 + ansIndex);
                doc.text(doc.splitTextToSize(`${letter}. ${a}`, maxWidth - 5), margin + 5, y);
                y += (doc.splitTextToSize(`- ${a}`, maxWidth - 5).length * 4) + 3;
            });
        }

        y += 5;
    });

    if (formValues.questionTypes.includes('Multiple Choice')) {
        doc.addPage();
        y = 45;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text("Answer Key", margin, y);
        y += 10;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        quiz.forEach((q, i) => {
            if(q.type === 'multiple-choice') {
                checkPageBreak(5);
                 const correctAnswerLetter = String.fromCharCode(65 + (q.answers?.findIndex(ans => ans === q.correctAnswer) ?? 0));
                doc.text(`${i + 1}. ${correctAnswerLetter}`, margin, y);
                y += 6;
            }
        });
    }

    addPdfHeaderAndFooter(doc, formValues.topic, formValues.difficulty, isPro);
    doc.save(`${formValues.topic.replace(/\s+/g, '_')}_quiz.pdf`);
  };

  const downloadResultCard = async () => {
    if (!quiz || !formValues) return;
    const { default: jsPDF } = await import('jspdf');
    const { score, percentage, totalScorable } = calculateScore();
    const doc = new jsPDF();

    addPdfHeaderAndFooter(doc, "Quiz Result Card", formValues.difficulty, isPro);

    let y = 50;

    doc.setFontSize(14);
    doc.text(`Student: ${user?.displayName || 'N/A'}`, 20, y);
    y += 10;
    doc.text(`Topic: ${formValues.topic}`, 20, y);
    y += 15;

    doc.setFontSize(16);
    doc.text(`Score: ${score}/${totalScorable}`, 20, y);
    y += 10;
    doc.text(`Percentage: ${percentage.toFixed(0)}%`, 20, y);
    y += 10;
    doc.text(`Status: ${percentage >= 50 ? 'Pass' : 'Fail'}`, 20, y);

    doc.save('quiz_result_card.pdf');
  };

  const toggleBookmark = async (question: string, correctAnswer: string) => {
    if(!formValues || !user) {
      console.log('❌ Cannot bookmark: missing formValues or user');
      return;
    }

    try {
      const isCurrentlyBookmarked = bookmarkedQuestions.some(bm => bm.question === question);
      const bookmarkId = btoa(question).replace(/[^a-zA-Z0-9]/g, '_'); // Safe Firebase key

      console.log('📌 Toggling bookmark:', { question: question.substring(0, 50), isCurrentlyBookmarked });

      if (isCurrentlyBookmarked) {
        // Remove from Firebase and local state
        const bookmarkRef = ref(db, `bookmarks/${user.uid}/${bookmarkId}`);
        await set(bookmarkRef, null);
        await deleteBookmark(user.uid, question);
        setBookmarkedQuestions(prev => prev.filter(bm => bm.question !== question));
        
        toast({
          title: "Bookmark Removed",
          description: "Question removed from bookmarks",
        });
      } else {
        const newBookmark: BookmarkedQuestion = {
          userId: user.uid,
          question,
          correctAnswer,
          topic: formValues.topic
        };
        
        // Save to Firebase and local state
        const bookmarkRef = ref(db, `bookmarks/${user.uid}/${bookmarkId}`);
        await set(bookmarkRef, newBookmark);
        await saveBookmark(newBookmark);
        setBookmarkedQuestions(prev => [...prev, newBookmark]);
        
        toast({
          title: "Bookmark Added",
          description: "Question saved to bookmarks",
        });
      }
    } catch (error) {
      console.error('❌ Bookmark error:', error);
      toast({
        title: "Bookmark Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetQuiz = async () => {
    if(initialQuiz) {
        // Check which prep section this quiz came from and redirect accordingly
        if (window.location.pathname.includes('/mdcat/')) {
           window.location.href = '/mdcat';
        } else if (window.location.pathname.includes('/ecat/')) {
            window.location.href = '/ecat';
        } else if (window.location.pathname.includes('/nts/')) {
            window.location.href = '/nts';
        } else {
            // Fallback for other initial quizzes
            window.location.href = '/exam-prep';
        }
        return;
    }
    if (user) {
        await deleteQuizState(user.uid);
    }
    setQuiz(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResults(false);
    setExplanations({});
    setFormValues(null);
    formMethods.reset();
    window.scrollTo(0, 0);
  };

  const retryIncorrect = () => {
    if (!quiz || !formValues) return;
    const incorrectQuestions = quiz.filter((q, i) => q.correctAnswer !== userAnswers[i] && q.type !== 'descriptive');
    if (incorrectQuestions.length === 0) {
        toast({
            title: "No incorrect answers!",
            description: "You got everything right. Well done!",
        });
        return;
    }

    const newFormValues = {
        ...formValues,
        topic: `Retry: ${formValues.topic}`,
        numberOfQuestions: incorrectQuestions.length,
        timeLimit: Math.max(5, Math.ceil(incorrectQuestions.length * 0.75)), // Adjust time limit
        questionStyles: [], // Use default styles for retry
    };

    setQuiz(incorrectQuestions);
    setFormValues(newFormValues);
    setCurrentQuestion(0);
    setUserAnswers(new Array(incorrectQuestions.length).fill(null));
    setTimeLeft(newFormValues.timeLimit * 60);
    setShowResults(false);
    setIsSubmitting(false); // Reset submission state
    setExplanations({});
    window.scrollTo(0, 0);
  };

    const formatExplanation = (text: string | null) => {
        if (!text) return null;
        return text
            .split(/(\*\*.*?\*\*)/g) // Split by bold markdown
            .map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index}>{part.slice(2, -2)}</strong>;
                }
                return part;
            });
    };

  // --- Conditional Rendering ---

  if (showFlashcardViewer) {
    return (
      <SafeComponent fallback={<QuizLoadingSkeleton />}>
        <FlashcardViewer flashcards={generatedFlashcards as any || []} onBack={() => setShowFlashcardViewer(false)} />
      </SafeComponent>
    );
  }


  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60svh] text-center p-4">
        <div className="relative">
            <BrainCircuit className="h-20 w-20 text-primary" />
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
                <Sparkles className="h-8 w-8 text-accent animate-pulse" />
            </motion.div>
        </div>
        <h2 className="text-2xl font-semibold mb-2 mt-6">Generating Your Quiz...</h2>
        <p className="text-muted-foreground max-w-sm mb-6">Please wait while our AI crafts the perfect quiz for you.</p>
        <div className="w-full max-w-sm">
           <Progress value={generationProgress} />
           <p className="text-sm mt-2 text-primary font-medium">{generationProgress}%</p>
        </div>
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  if (quiz && !showResults) {
    const currentQ = quiz[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.length) * 100;

    return (
      <FormProvider {...formMethods}>
        <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">Question {currentQuestion + 1} of {quiz.length}</p>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                </div>
            </div>
            <Progress value={progress} className="h-2 w-full mb-6" />

           {comprehensionText && (
                <Card className="w-full max-w-4xl mx-auto mb-8 bg-muted/50">
                    <CardHeader>
                        <CardTitle>Reading Passage</CardTitle>
                        <CardDescription>Read the passage below to answer the following questions.</CardDescription>
                    </CardHeader>
                    <CardContent className="prose prose-sm dark:prose-invert max-h-48 overflow-y-auto p-4 border rounded-lg bg-background">
                        <RichContentRenderer content={comprehensionText} />
                    </CardContent>
                </Card>
            )}

          <AnimatePresence mode="wait">
              <motion.div
                  key={currentQuestion}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="w-full"
              >
                <div className="space-y-6">
                    <div className="text-center text-xl sm:text-2xl font-semibold leading-relaxed min-h-[6rem]">
                        <RichContentRenderer content={currentQ.question} smiles={currentQ.smiles} />
                    </div>
                    <div className="w-full max-w-md mx-auto">
                      {currentQ.type === 'descriptive' ? (
                          <Textarea
                              value={userAnswers[currentQuestion] || ""}
                              onChange={(e) => handleAnswer(e.target.value)}
                              placeholder="Type your answer here..."
                              rows={5}
                              className="text-base"
                          />
                      ) : (
                          <RadioGroup
                              value={userAnswers[currentQuestion] || ""}
                              onValueChange={handleAnswer}
                              className="grid grid-cols-1 gap-3"
                          >
                              {(currentQ.answers || []).map((answer, index) => {
                              return (
                                  <FormItem key={index} className="flex flex-row items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value={answer} id={`q${currentQuestion}a${index}`} className="hidden peer" />
                                      </FormControl>
                                      <Label htmlFor={`q${currentQuestion}a${index}`} className="flex-1 text-base font-normal cursor-pointer rounded-xl border p-4 peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:border-primary transition-all">
                                          <RichContentRenderer content={answer} />
                                      </Label>
                                  </FormItem>
                              )
                              })}
                          </RadioGroup>
                      )}
                    </div>
                </div>
              </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between w-full">
            <Button onClick={handleBack} size="lg" variant="outline" disabled={currentQuestion === 0}>
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
            </Button>
            <Button onClick={handleNext} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                {currentQuestion === quiz.length - 1 ? "Submit Quiz" : "Next Question"}
                {currentQuestion !== quiz.length - 1 && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </div>
        </div>
      </FormProvider>
    );
  }

  if (showResults && quiz && formValues) {
    const { score, percentage, totalScorable } = calculateScore();
    const incorrectAnswers = quiz.filter((q, i) => q.correctAnswer !== userAnswers[i] && q.type !== 'descriptive');

    return (
       <div className="max-w-4xl mx-auto">
            <PageHeader title="Quiz Results" description={`You scored ${score} out of ${totalScorable}.`} />
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                         <CardTitle>Result Details</CardTitle>
                         <div className="flex flex-wrap gap-2">
                            <Button variant="outline" onClick={downloadQuestions}><Download className="mr-2 h-4 w-4" /> Questions</Button>
                            <Button onClick={downloadResultCard}><Download className="mr-2 h-4 w-4" /> Result Card</Button>
                         </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
                        <Card className="p-4 bg-muted/50">
                            <CardTitle className="text-3xl font-bold">{score}/{totalScorable}</CardTitle>
                            <CardDescription>Score</CardDescription>
                        </Card>
                         <Card className="p-4 bg-muted/50">
                            <CardTitle className="text-3xl font-bold">{percentage.toFixed(0)}%</CardTitle>
                             <CardDescription>Percentage</CardDescription>
                        </Card>
                         <Card className="p-4 bg-muted/50">
                            <CardTitle className={cn("text-3xl font-bold", percentage >= 50 ? "text-primary" : "text-destructive")}>{percentage >= 50 ? 'Pass' : 'Fail'}</CardTitle>
                             <CardDescription>Status</CardDescription>
                        </Card>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">Review Your Answers</h3>
                        <div className="space-y-4">
                            {quiz.map((q, index) => {
                                const isCorrect = q.correctAnswer === userAnswers[index];
                                const explanationState = explanations[index];
                                const isBookmarked = bookmarkedQuestions.some(bm => bm.question === q.question);

                                return (
                                    <Card key={index} className={cn("bg-muted/30", isCorrect ? "border-primary/20" : "border-destructive/20")}>
                                        <CardHeader className="flex flex-row justify-between items-start pb-2">
                                            <div className="font-semibold flex-1 pr-4"><RichContentRenderer content={`${index + 1}. ${q.question}`} smiles={q.smiles} /></div>
                                            {q.correctAnswer && (
                                                <Button variant="ghost" size="icon" onClick={() => toggleBookmark(q.question, q.correctAnswer || "")}>
                                                    <Star className={cn("h-5 w-5", isBookmarked ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
                                                    <span className="sr-only">Bookmark</span>
                                                </Button>
                                            )}
                                        </CardHeader>
                                        <CardContent className="p-4 sm:p-6 pt-2">
                                            <div className="text-sm mt-2 space-y-1">
                                                 <p className={cn("flex items-start gap-2", isCorrect ? 'text-primary' : 'text-destructive')}>
                                                    {isCorrect ? <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" /> : <XCircle className="h-4 w-4 shrink-0 mt-0.5" />}
                                                    <span>Your answer: <RichContentRenderer content={userAnswers[index] || "Skipped"} inline /></span>
                                                 </p>
                                                 {!isCorrect && q.correctAnswer && (
                                                     <p className="text-primary flex items-start gap-2">
                                                        <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                                        <span>Correct answer: <RichContentRenderer content={q.correctAnswer} inline /></span>
                                                     </p>
                                                 )}
                                                 {q.type === 'descriptive' && !q.correctAnswer && (
                                                    <p className="flex items-start gap-2 text-muted-foreground">
                                                         <MessageSquareQuote className="h-4 w-4 shrink-0 mt-0.5" />
                                                         <span>Your Answer: {userAnswers[index] || "Not answered"}</span>
                                                    </p>
                                                 )}
                                            </div>

                                            {!isCorrect && q.type !== 'descriptive' && (
                                                <div className="mt-4 space-y-2">
                                                    {explanationState?.explanation && (
                                                        <Alert className="border-accent/50 text-accent-foreground bg-accent/10">
                                                            <AlertTitle className="text-accent-foreground/90 flex items-center gap-2"><Brain className="h-4 w-4" /> Detailed Explanation</AlertTitle>
                                                            <AlertDescription className="prose prose-sm max-w-none">{formatExplanation(explanationState.explanation)}</AlertDescription>
                                                        </Alert>
                                                    )}
                                                    {explanationState?.simpleExplanation && (
                                                         <Alert className="border-accent/50 text-accent-foreground bg-accent/10">
                                                            <AlertTitle className="text-accent-foreground/90 flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Simple Explanation</AlertTitle>
                                                            <AlertDescription className="prose prose-sm max-w-none">{formatExplanation(explanationState.simpleExplanation)}</AlertDescription>
                                                         </Alert>
                                                    )}
                                                    <div className="flex flex-wrap gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => getExplanation(index)} disabled={explanationState?.isLoading}>
                                                            {explanationState?.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                                            Detailed Explanation
                                                        </Button>
                                                        <Button variant="outline" size="sm" onClick={() => getSimpleExplanation(index)} disabled={explanationState?.isSimpleLoading}>
                                                            {explanationState?.isSimpleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                                            Explain Like I'm 5
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
                {/* Social Sharing Section */}
                <div className="border-t pt-6">
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-200 dark:border-blue-800">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                                    <Share2 className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                                        🎉 Great job! Ready to share?
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 dark:text-gray-300">
                                        Help others learn and grow your knowledge network!
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center border">
                                    <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                                    <div className="text-sm font-semibold">Help Friends Learn</div>
                                    <div className="text-xs text-gray-500">Share knowledge with others</div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center border">
                                    <MessageCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
                                    <div className="text-sm font-semibold">Join Community</div>
                                    <div className="text-xs text-gray-500">Connect with learners worldwide</div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center border">
                                    <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
                                    <div className="text-sm font-semibold">Earn Recognition</div>
                                    <div className="text-xs text-gray-500">Get likes and build credibility</div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                                <div className="text-center space-y-3">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        🚀 Your knowledge can inspire others!
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Shared quizzes typically get 5-15 attempts from friends and followers
                                    </div>
                                    <QuizSharingDialog
                                        quiz={quiz}
                                        formValues={formValues as any}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                 <CardFooter className="flex flex-wrap justify-center gap-2 pt-4">
                    <Button onClick={resetQuiz}><Redo className="mr-2 h-4 w-4" /> {initialQuiz ? 'Go to Prep Home' : 'Take Another Quiz'}</Button>
                    {incorrectAnswers.length > 0 && (
                        <Button onClick={retryIncorrect} variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Retry Incorrect</Button>
                    )}
                    {incorrectAnswers.length > 0 && (
                        <Button onClick={handleGenerateFlashcards} variant="outline" disabled={isGeneratingFlashcards}>
                            {isGeneratingFlashcards ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                            Generate Flashcards
                        </Button>
                    )}
                    <Button variant="outline" asChild><Link href="/"><LayoutDashboard className="mr-2 h-4 w-4"/> Back to Dashboard</Link></Button>
                </CardFooter>
            </Card>
       </div>
    );
  }

  return (
    <FormProvider {...formMethods}>
      <SafeComponent fallback={<QuizLoadingSkeleton />}>
        <QuizSetupForm onGenerateQuiz={handleGenerateQuiz} />
      </SafeComponent>
    </FormProvider>
  );
}
