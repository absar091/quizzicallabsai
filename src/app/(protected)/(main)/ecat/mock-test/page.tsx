
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import dynamic from 'next/dynamic';
// Dynamic import for AI function
type GenerateCustomQuizOutput = any;
type GenerateCustomQuizInput = any;
const GenerateQuizPage = dynamic(() => import('@/app/(protected)/(main)/generate-quiz/page'), { 
    loading: () => <div className="flex items-center justify-center min-h-[60svh]"><Loader2 className="h-8 w-8 animate-spin" /></div> 
});
import { Loader2, AlertTriangle, Sparkles, BrainCircuit } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

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
    
    const topicForAI = `ECAT Mock Test - ${section.subject}`;

    const quizParams: GenerateCustomQuizInput = {
      topic: topicForAI,
      difficulty: 'hard', // ECAT is generally 'hard'
      numberOfQuestions: section.numQuestions,
      questionTypes: ['Multiple Choice'],
      questionStyles: ['Past Paper Style', 'Conceptual', 'Numerical'],
      timeLimit: section.time,
      userAge: null,
      userClass: 'ECAT Student',
      specificInstructions: `Generate questions for the ${section.subject} section of a full ECAT mock exam. Ensure questions are strictly based on the official ECAT syllabus and cover a wide range of topics.`
    };

    try {
      // Get auth token
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      
      if (!token) {
        throw new Error('Please sign in to generate ECAT mock tests');
      }

      const response = await fetch('/api/ai/custom-quiz', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(quizParams)
      });
      
      if (!response.ok) throw new Error('Failed to generate quiz');
      const result = await response.json();
      
      if (result.error) throw new Error(result.error);
      if (!result.quiz || result.quiz.length === 0) {
        throw new Error("The AI returned an empty quiz. Please try again.");
      }
      setGeneratedQuiz(result.quiz);
      setTestState('taking');
    } catch (err: any) {
      console.error(`ECAT Mock Test Error for ${section.subject}:`, err);
      let errorMessage = `Failed to generate the ${section.subject} section.`;
      
      if (err.message?.includes('quota') || err.message?.includes('rate limit')) {
        errorMessage += ' API quota exceeded. Please try again in a few minutes.';
      } else if (err.message?.includes('timeout') || err.message?.includes('overloaded')) {
        errorMessage += ' The AI service is temporarily busy. Please try again.';
      } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
        errorMessage += ' Network connection issue. Please check your internet and try again.';
      } else {
        errorMessage += ' Please try again or contact support if the issue persists.';
      }
      
      setError(errorMessage);
      setTestState('idle');
    }
  };

  const handleSectionComplete = (sectionAnswers: (string | null)[]) => {
    try {
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
    } catch (error) {
      console.error('Error completing section:', error);
      setError('Failed to proceed to next section. Please try again.');
      setTestState('idle');
    }
  };
  
  // Custom hook to override the default submit behavior of GenerateQuizPage
  const useMockTestQuizSubmit = (callback: (answers: (string | null)[]) => void) => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).__MOCK_TEST_SUBMIT_OVERRIDE__ = callback;
            return () => {
                delete (window as any).__MOCK_TEST_SUBMIT_OVERRIDE__;
            };
        }
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
    
  // We need to pass the user's answers to the results page. Ensure the
  // answers array length matches the questions length to avoid scoring bugs.
  if (typeof window !== 'undefined') {
    const questionsLen = allQuestions.length;
    const answersLen = allUserAnswers.length;
    let finalAnswers = allUserAnswers.slice(0, questionsLen);
    if (answersLen < questionsLen) {
      finalAnswers = finalAnswers.concat(new Array(questionsLen - answersLen).fill(null));
      console.warn('ECAT Mock Test: answers array was shorter than questions; padding with nulls', { questionsLen, answersLen });
    } else if (answersLen > questionsLen) {
      console.warn('ECAT Mock Test: answers array longer than questions; trimming extra answers', { questionsLen, answersLen });
    }
    (window as any).__MOCK_TEST_ANSWERS__ = finalAnswers;
  }
    
    return (
         <GenerateQuizPage 
            initialQuiz={allQuestions} 
            initialFormValues={finalQuizFormValues}
         />
    );
  }

  return null;
}
