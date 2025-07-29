
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { generateCustomQuiz, GenerateCustomQuizOutput, GenerateCustomQuizInput } from '@/ai/flows/generate-custom-quiz';
import GenerateQuizPage from '@/app/(app)/generate-quiz/page';
import { Loader2, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

type Quiz = GenerateCustomQuizOutput['quiz'];

const MOCK_TEST_CONFIG = [
  { subject: 'Physics', numQuestions: 30, time: 30 },
  { subject: 'Mathematics', numQuestions: 30, time: 30 },
  { subject: 'Chemistry', numQuestions: 30, time: 30 }, // This is a placeholder
  { subject: 'English', numQuestions: 10, time: 10 },
];

const TOTAL_QUESTIONS = MOCK_TEST_CONFIG.reduce((acc, curr) => acc + curr.numQuestions, 0);
const TOTAL_TIME = MOCK_TEST_CONFIG.reduce((acc, curr) => acc + curr.time, 0);


export default function EcatMockTestPage() {
  const { user } = useAuth();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [testState, setTestState] = useState<'idle' | 'generating' | 'taking' | 'finished'>('idle');
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
  const [allUserAnswers, setAllUserAnswers] = useState<(string | null)[]>([]);
  const [allQuestions, setAllQuestions] = useState<Quiz>([]);
  const [error, setError] = useState<string | null>(null);
  const [optionalSubject, setOptionalSubject] = useState<'Chemistry' | 'Computer Science' | null>(null);


  const generateSectionQuiz = async (sectionIndex: number) => {
    if (!optionalSubject) {
      setError("Please select an optional subject first.");
      setTestState('idle'); // Go back to selection
      return;
    }
    
    // Dynamically create the config based on the selected subject
    const dynamicMockTestConfig = [
        MOCK_TEST_CONFIG[0], // Physics
        MOCK_TEST_CONFIG[1], // Mathematics
        { subject: optionalSubject, numQuestions: 30, time: 30 }, // Optional Subject
        MOCK_TEST_CONFIG[3], // English
    ];

    if (sectionIndex >= dynamicMockTestConfig.length) {
      setTestState('finished');
      return;
    }

    setTestState('generating');
    setError(null);
    setGeneratedQuiz(null);
    const section = dynamicMockTestConfig[sectionIndex];
    
    const quizParams: GenerateCustomQuizInput = {
      topic: `ECAT Mock Test - ${section.subject}`,
      difficulty: 'hard', // ECAT is generally 'hard'
      numberOfQuestions: section.numQuestions,
      questionTypes: ['Multiple Choice'],
      questionStyles: ['Past Paper Style', 'Conceptual', 'Numerical'],
      timeLimit: section.time,
      userAge: null,
      userClass: 'ECAT Student',
      specificInstructions: `Generate questions strictly based on the ECAT syllabus for ${section.subject}. Focus on a mix of conceptual and numerical problems typical for UET entrance exams.`
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
      setTestState('idle'); // Revert to allow re-selection
    }
  };

  const handleSectionComplete = (sectionAnswers: (string | null)[]) => {
    if (generatedQuiz) {
        setAllUserAnswers(prev => [...prev, ...sectionAnswers]);
        setAllQuestions(prev => [...prev, ...generatedQuiz]);
    }
    const nextSectionIndex = currentSectionIndex + 1;
    setCurrentSectionIndex(nextSectionIndex);

    const dynamicMockTestConfig = optionalSubject ? [
        MOCK_TEST_CONFIG[0], MOCK_TEST_CONFIG[1], { subject: optionalSubject, numQuestions: 30, time: 30 }, MOCK_TEST_CONFIG[3]
    ] : MOCK_TEST_CONFIG;
    
    if (nextSectionIndex < dynamicMockTestConfig.length) {
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
          title="ECAT Full-Length Mock Test"
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
            <div className="mt-6 space-y-4">
                <p>The test will proceed in the following order:</p>
                <ul className="list-decimal list-inside text-muted-foreground">
                    <li>Physics: 30 MCQs</li>
                    <li>Mathematics: 30 MCQs</li>
                    <li>Chemistry OR Computer Science: 30 MCQs</li>
                    <li>English: 10 MCQs</li>
                </ul>
                <div className="space-y-2">
                    <p className="font-semibold">Select your optional subject:</p>
                    <div className="flex gap-4">
                        <Button
                            variant={optionalSubject === 'Chemistry' ? 'default' : 'outline'}
                            onClick={() => setOptionalSubject('Chemistry')}
                        >
                            Chemistry
                        </Button>
                        <Button
                            variant={optionalSubject === 'Computer Science' ? 'default' : 'outline'}
                            onClick={() => setOptionalSubject('Computer Science')}
                        >
                            Computer Science
                        </Button>
                    </div>
                     {error && <p className="text-sm text-destructive mt-2">{error}</p>}
                </div>
                 <p className="font-semibold">Your total time for all sections is {TOTAL_TIME} minutes.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="lg" onClick={() => generateSectionQuiz(0)} disabled={!optionalSubject}>
              Start Mock Test
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (testState === 'generating') {
    const dynamicMockTestConfig = optionalSubject ? [
        MOCK_TEST_CONFIG[0], MOCK_TEST_CONFIG[1], { subject: optionalSubject, numQuestions: 30, time: 30 }, MOCK_TEST_CONFIG[3]
    ] : MOCK_TEST_CONFIG;
    const section = dynamicMockTestConfig[currentSectionIndex];
    
    return (
        <div className="flex flex-col items-center justify-center h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-xl text-muted-foreground text-center">Generating {section.subject} Section ({section.numQuestions} MCQs)...</p>
            <p className="text-sm text-muted-foreground mt-2">This may take a moment.</p>
        </div>
    )
  }
  
  if (testState === 'taking' && generatedQuiz) {
    const dynamicMockTestConfig = optionalSubject ? [
        MOCK_TEST_CONFIG[0], MOCK_TEST_CONFIG[1], { subject: optionalSubject, numQuestions: 30, time: 30 }, MOCK_TEST_CONFIG[3]
    ] : MOCK_TEST_CONFIG;
    const section = dynamicMockTestConfig[currentSectionIndex];
    
    const sectionFormValues = {
        topic: `ECAT Mock Test - ${section.subject}`,
        difficulty: 'hard' as const,
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
             <Progress value={((currentSectionIndex) / dynamicMockTestConfig.length) * 100} className="mt-2" />
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
        topic: `ECAT Full Mock Test Result`,
        difficulty: 'hard' as const,
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
