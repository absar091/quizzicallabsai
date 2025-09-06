'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Sparkles, Eye, Settings, FileText, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card';
import { EnhancedProgress } from '@/components/ui/enhanced-progress';
import { TopicStep } from './steps/topic-step';
import { DifficultyStep } from './steps/difficulty-step';
import { QuestionSettingsStep } from './steps/question-settings-step';
import { QuizConfigStep } from './steps/quiz-config-step';
import { FineTuningStep } from './steps/fine-tuning-step';
import { ReviewStep } from './steps/review-step';
import { useIsMobile } from '@/hooks/use-mobile';

const quizFormSchema = z.object({
  topic: z.string().min(1, "Topic is required."),
  difficulty: z.string().min(1, "Difficulty is required."),
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

export type QuizWizardFormValues = z.infer<typeof quizFormSchema>;

interface QuizWizardProps {
  onGenerateQuiz: (values: QuizWizardFormValues) => void;
  isGenerating?: boolean;
  className?: string;
}

const steps = [
  {
    id: 'topic',
    title: 'Topic Name',
    description: 'Enter the topic you want to create a quiz for',
    icon: FileText,
    component: TopicStep,
  },
  {
    id: 'difficulty',
    title: 'Style',
    description: 'Choose the difficulty level for your quiz',
    icon: Brain,
    component: DifficultyStep,
  },
  {
    id: 'config',
    title: 'Questions & Time',
    description: 'Set the number of questions and time limit',
    icon: Settings,
    component: QuizConfigStep,
  },
  {
    id: 'instructions',
    title: 'Specific Instructions',
    description: 'Add any special instructions for the AI (optional)',
    icon: Sparkles,
    component: FineTuningStep,
  },
  {
    id: 'review',
    title: 'Review & Generate',
    description: 'Review your settings and generate your quiz',
    icon: Eye,
    component: ReviewStep,
  },
];

export function QuizWizard({ onGenerateQuiz, isGenerating = false, className }: QuizWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const formMethods = useForm<QuizWizardFormValues>({
    resolver: zodResolver(quizFormSchema),
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

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = async () => {
    const isValid = await formMethods.trigger();
    if (isValid && !isLastStep) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = async (stepIndex: number) => {
    if (stepIndex < currentStep) {
      // Allow going back to previous steps
      setDirection(-1);
      setCurrentStep(stepIndex);
    } else if (stepIndex > currentStep) {
      // Validate current step before proceeding
      const isValid = await formMethods.trigger();
      if (isValid) {
        setDirection(1);
        setCurrentStep(stepIndex);
      }
    }
  };

  const handleGenerate = (values: QuizWizardFormValues) => {
    onGenerateQuiz(values);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <FormProvider {...formMethods}>
      <div className={cn('max-w-4xl mx-auto', className)}>
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gradient">Create Your Quiz</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const isClickable = index <= currentStep;

              return (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => handleStepClick(index)}
                    disabled={!isClickable}
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200',
                      isCompleted && 'bg-primary border-primary text-primary-foreground',
                      isCurrent && 'border-primary text-primary bg-primary/10',
                      !isCompleted && !isCurrent && 'border-muted-foreground/30 text-muted-foreground',
                      isClickable && 'hover:border-primary/50 cursor-pointer'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </button>

                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'flex-1 h-0.5 mx-2 sm:mx-4 transition-colors duration-200 min-w-4',
                        isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <EnhancedProgress
            value={progress}
            className="mb-4"
            animated
          />

          {/* Current Step Info */}
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-1">{currentStepData.title}</h2>
            <p className="text-muted-foreground">{currentStepData.description}</p>
          </div>
        </div>

        {/* Step Content */}
        <EnhancedCard className="min-h-[500px]">
          <EnhancedCardContent className="p-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="min-h-[400px]"
              >
                <currentStepData.component />
              </motion.div>
            </AnimatePresence>
          </EnhancedCardContent>
        </EnhancedCard>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-8 gap-4">
          <EnhancedButton
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstStep}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            animation="scale"
            className="w-full sm:w-auto"
          >
            Previous
          </EnhancedButton>

          <div className="flex items-center justify-center w-full sm:w-auto">
            {!isLastStep ? (
              <EnhancedButton
                variant="gradient"
                onClick={handleNext}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                animation="scale"
                className="w-full sm:w-auto"
              >
                Next
              </EnhancedButton>
            ) : (
              <EnhancedButton
                variant="gradient"
                onClick={formMethods.handleSubmit(handleGenerate)}
                loading={isGenerating}
                loadingText="Generating Quiz..."
                leftIcon={<Sparkles className="w-4 h-4" />}
                animation="scale"
                size="lg"
                className="w-full sm:w-auto"
              >
                Generate Quiz
              </EnhancedButton>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
