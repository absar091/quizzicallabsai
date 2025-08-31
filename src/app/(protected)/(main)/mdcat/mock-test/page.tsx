
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { generateCustomQuiz, GenerateCustomQuizOutput, GenerateCustomQuizInput } from '@/ai/flows/generate-custom-quiz';
import GenerateQuizPage from '@/app/(protected)/(main)/generate-quiz/page';
import { Loader2, AlertTriangle, Sparkles, BrainCircuit } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { mdcatSyllabus } from '@/lib/mdcat-syllabus';
import { motion } from 'framer-motion';

type Quiz = GenerateCustomQuizOutput['quiz'];

const MOCK_TEST_CONFIG = [
  { subject: 'Biology', numQuestions: 81, time: 81, slug: 'biology' },
  { subject: 'Chemistry', numQuestions: 45, time: 45, slug: 'chemistry' },
  { subject: 'Physics', numQuestions: 36, time: 36, slug: 'physics' },
  { subject: 'English', numQuestions: 9, time: 9, slug: 'english' },
  { subject: 'Logical Reasoning', numQuestions: 9, time: 9, slug: 'logical-reasoning' },
];

const TOTAL_QUESTIONS = MOCK_TEST_CONFIG.reduce((acc, curr) => acc + curr.numQuestions, 0);
const TOTAL_TIME = MOCK_TEST_CONFIG.reduce((acc, curr) => acc + curr.time, 0);

export default function MdcatMockTestPage() {
  const { user } = useAuth();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [testState, setTestState] = useState<'idle' | 'generating' | 'taking' | 'finished'>('idle');
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
  const [allUserAnswers, setAllUserAnswers] = useState<(string | null)[]>([]);
  const [allQuestions, setAllQuestions] = useState<Quiz>([]);
  const [error, setError] = useState<string | null>(null);

  const generateSectionQuiz = async (sectionIndex: number) => {
    if (sectionIndex >= MOCK_TEST_CONFIG.length) {
      setTestState('finished');
      return;
    }

    setTestState('generating');
    setError(null);
    setGeneratedQuiz(null);
    const section = MOCK_TEST_CONFIG[sectionIndex];
    
    const topicForAI = `MDCAT Mock Test - ${section.subject}`;

    const quizParams: GenerateCustomQuizInput = {
      topic: topicForAI,
      difficulty: 'master',
      numberOfQuestions: section.numQuestions,
      questionTypes: ['Multiple Choice'],
      questionStyles: ['Past Paper Style', 'Conceptual'],
      timeLimit: section.time,
      userAge: null,
      userClass: 'MDCAT Student',
      specificInstructions: `Generate questions for the ${section.subject} section of a full MDCAT mock exam. Ensure questions are strictly based on the official MDCAT syllabus and cover a wide range of chapters within that subject.`
    };

    try {
      const result = await generateCustomQuiz(quizParams);
      if (!result.quiz || result.quiz.length === 0) {
        throw new Error("The AI returned an empty quiz. Please try again.");
      }
      setGeneratedQuiz(result.quiz);
      setTestState('taking');
    } catch (err: any) {
      setError(`Failed to generate the ${section.subject} section. The AI model may be overloaded. Please try again later.`);
      setTestState('idle');
    }
  };

  const handleSectionComplete = (sectionAnswers: (string | null)[]) => {
    if (generatedQuiz) {
        setAllUserAnswers(prev => [...prev, ...sectionAnswers]);
        setAllQuestions(prev => [...prev, ...generatedQuiz]);
    }
    const nextSectionIndex = currentSectionIndex + 1;
    setCurrentSectionIndex(nextSectionIndex);
    if (nextSectionIndex < MOCK_TEST_CONFIG.length) {
        generateSectionQuiz(nextSectionIndex);
    } else {
        setTestState('finished');
    }
  };
  
  // Custom hook to override the default submit behavior of GenerateQuizPage
  const useMockTestQuizSubmit = (callback: (answers: (string | null)[]) => void) => {
    useEffect(() => {
        // This replaces the default implementation with our callback
        (window as any).__MOCK_TEST_SUBMIT_OVERRIDE__ = callback;
        return () => {
            delete (window as any).__MOCK_TEST_SUBMIT_OVERRIDE__;
        };
    }, [callback]);
  };
  
  useMockTestQuizSubmit(handleSectionComplete);


  if (testState === 'idle') {
    return (
      <div>
        <PageHeader
          title="MDCAT Full-Length Mock Test"
          description={`Simulate the real exam with ${TOTAL_QUESTIONS} MCQs.`}
        />
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important!</AlertTitle>
              <AlertDescription>
                This mock test will be generated and taken **section by section** to ensure a smooth experience.
              </AlertDescription>
            </Alert>
            <div className="mt-6 space-y-3">
                <p>The test will proceed in the following order:</p>
                <ul className="list-decimal list-inside text-muted-foreground">
                    {MOCK_TEST_CONFIG.map(section => (
                        <li key={section.subject}>{section.subject}: {section.numQuestions} MCQs ({section.time} minutes)</li>
                    ))}
                </ul>
                 <p className="font-semibold">Your total time for all sections is {TOTAL_TIME} minutes.</p>
                 {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button size="lg" onClick={() => generateSectionQuiz(0)}>
              Start Mock Test
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (testState === 'generating') {
    const section = MOCK_TEST_CONFIG[currentSectionIndex];
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
            <h2 className="text-2xl font-semibold mb-2 mt-6">Generating {section.subject} Section...</h2>
            <p className="text-muted-foreground max-w-sm mb-6">({section.numQuestions} MCQs) This may take a moment.</p>
        </div>
    )
  }
  
  if (testState === 'taking' && generatedQuiz) {
    const section = MOCK_TEST_CONFIG[currentSectionIndex];
    const sectionFormValues = {
        topic: `MDCAT Mock Test - ${section.subject}`,
        difficulty: 'master' as const,
        numberOfQuestions: section.numQuestions,
        questionTypes: ['Multiple Choice'],
        questionStyles: ['Past Paper Style'],
        timeLimit: section.time,
        specificInstructions: ''
    };

    return (
        <>
        <div className="mb-4">
             <h2 className="text-xl font-bold text-center">Section: {section.subject}</h2>
             <Progress value={((currentSectionIndex) / MOCK_TEST_CONFIG.length) * 100} className="mt-2" />
        </div>
        <GenerateQuizPage
            key={currentSectionIndex} // Force re-mount for each section
            initialQuiz={generatedQuiz}
            initialFormValues={sectionFormValues}
        />
        </>
    );
  }

  if (testState === 'finished') {
     const finalQuizFormValues = {
        topic: `MDCAT Full Mock Test Result`,
        difficulty: 'master' as const,
        numberOfQuestions: TOTAL_QUESTIONS,
        questionTypes: ['Multiple Choice'],
        questionStyles: ['Past Paper Style'],
        timeLimit: TOTAL_TIME,
        specificInstructions: ''
    };
    
    // We need to pass the user's answers to the results page.
    (window as any).__MOCK_TEST_ANSWERS__ = allUserAnswers;
    
    return (
         <GenerateQuizPage 
            initialQuiz={allQuestions} 
            initialFormValues={finalQuizFormValues}
         />
    );
  }

  return null;
}
