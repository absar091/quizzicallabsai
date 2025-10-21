
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import dynamic from 'next/dynamic';
// Dynamic import for AI function
const GenerateQuizPage = dynamic(() => import('@/app/(protected)/(main)/generate-quiz/page'), { 
    loading: () => <div className="flex items-center justify-center min-h-[60svh]"><Loader2 className="h-8 w-8 animate-spin" /></div> 
});
type Quiz = any[];
import { Loader2 } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
import { BookUser } from 'lucide-react';
import { BrainCircuit } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ntsSyllabus } from '@/lib/nts-syllabus';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

const MOCK_TEST_SECTIONS = [
  { name: 'Verbal Reasoning', numQuestions: 20, time: 25 },
  { name: 'Quantitative Reasoning', numQuestions: 20, time: 25 },
  { name: 'Analytical Reasoning', numQuestions: 20, time: 25 },
  { name: 'Subject Portion', numQuestions: 30, time: 45 },
];

const TOTAL_QUESTIONS = MOCK_TEST_SECTIONS.reduce((acc, curr) => acc + curr.numQuestions, 0);
const TOTAL_TIME = MOCK_TEST_SECTIONS.reduce((acc, curr) => acc + curr.time, 0);

export default function NtsMockTestPage() {
  const { user } = useAuth();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [testState, setTestState] = useState<'idle' | 'generating' | 'taking' | 'finished'>('idle');
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
  const [allUserAnswers, setAllUserAnswers] = useState<(string | null)[]>([]);
  const [allQuestions, setAllQuestions] = useState<Quiz>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const generateSectionQuiz = async (sectionIndex: number) => {
    if (!selectedCategory) {
      setError("Please select your NAT category first.");
      setTestState('idle');
      return;
    }

    if (sectionIndex >= MOCK_TEST_SECTIONS.length) {
      setTestState('finished');
      return;
    }

    setTestState('generating');
    setError(null);
    setGeneratedQuiz(null);
    const section = MOCK_TEST_SECTIONS[sectionIndex];
    let topicForAI = `NTS Mock Test - ${section.name}`;

    if (section.name === 'Subject Portion') {
      const categoryData = ntsSyllabus[selectedCategory];
      topicForAI = `NTS Subject Portion for ${categoryData.name}`;
    }

    try {
      const response = await fetch('/api/ai/nts-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          topic: topicForAI,
          numberOfQuestions: section.numQuestions,
          isPro: false,
        })
      });
      
      if (!response.ok) throw new Error('Failed to generate quiz');
      const result = await response.json();
      
      if (result.error) throw new Error(result.error);
      if (!result.quiz || result.quiz.length === 0) {
        throw new Error("The AI returned an empty quiz for this section. Please try again.");
      }
      
      const formattedQuiz = result.quiz.map(q => ({
        ...q,
        type: 'multiple-choice' as const,
        question: q.question,
        answers: q.answers || [],
        correctAnswer: q.correctAnswer,
      }));

      setGeneratedQuiz(formattedQuiz);
      setTestState('taking');
    } catch (err: any) {
      console.error(`NTS Mock Test Error for ${section.name}:`, err);
      let errorMessage = `Failed to generate the ${section.name} section.`;
      
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
      if (nextSectionIndex < MOCK_TEST_SECTIONS.length) {
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
          title="NTS / NAT Full-Length Mock Test"
          description={`Simulate the real exam with ${TOTAL_QUESTIONS} MCQs in ${TOTAL_TIME} minutes.`}
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
                This mock test is generated section-by-section. First, select your NAT category.
              </AlertDescription>
            </Alert>
            <div className="mt-6 space-y-4">
                <p>The test contains the following sections:</p>
                <ul className="list-decimal list-inside text-muted-foreground">
                    {MOCK_TEST_SECTIONS.map(section => (
                        <li key={section.name}>{section.name}: {section.numQuestions} MCQs</li>
                    ))}
                </ul>
                <div className="space-y-2">
                    <Label htmlFor="nat-category" className="font-semibold">Select your NAT Category:</Label>
                    <Select onValueChange={setSelectedCategory} value={selectedCategory || ''}>
                        <SelectTrigger id="nat-category">
                            <SelectValue placeholder="Select a category..." />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(ntsSyllabus).map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     {error && <p className="text-sm text-destructive mt-2">{error}</p>}
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="lg" onClick={() => generateSectionQuiz(0)} disabled={!selectedCategory}>
              Start Mock Test
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (testState === 'generating') {
    const section = MOCK_TEST_SECTIONS[currentSectionIndex];
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
            <h2 className="text-2xl font-semibold mb-2 mt-6">Generating {section.name} Section...</h2>
            <p className="text-muted-foreground max-w-sm mb-6">({section.numQuestions} MCQs) This may take a moment.</p>
        </div>
    )
  }
  
  if (testState === 'taking' && generatedQuiz) {
    const section = MOCK_TEST_SECTIONS[currentSectionIndex];
    const sectionFormValues = {
        topic: `NAT Mock Test - ${section.name}`,
        difficulty: 'medium' as const,
        numberOfQuestions: section.numQuestions,
        questionTypes: ['Multiple Choice'],
        questionStyles: [],
        timeLimit: section.time,
        specificInstructions: ''
    };

    return (
        <>
        <div className="mb-4">
             <h2 className="text-xl font-bold text-center">Section: {section.name}</h2>
             <Progress value={((currentSectionIndex) / MOCK_TEST_SECTIONS.length) * 100} className="mt-2" />
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
        topic: `NTS/NAT Full Mock Test Result (${selectedCategory})`,
        difficulty: 'medium' as const,
        numberOfQuestions: TOTAL_QUESTIONS,
        questionTypes: ['Multiple Choice'],
        questionStyles: [],
        timeLimit: TOTAL_TIME,
        specificInstructions: ''
    };
    
  if (typeof window !== 'undefined') {
    const questionsLen = allQuestions.length;
    const answersLen = allUserAnswers.length;
    let finalAnswers = allUserAnswers.slice(0, questionsLen);
    if (answersLen < questionsLen) {
      finalAnswers = finalAnswers.concat(new Array(questionsLen - answersLen).fill(null));
      console.warn('NTS Mock Test: answers array was shorter than questions; padding with nulls', { questionsLen, answersLen });
    } else if (answersLen > questionsLen) {
      console.warn('NTS Mock Test: answers array longer than questions; trimming extra answers', { questionsLen, answersLen });
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
