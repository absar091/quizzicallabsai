
"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
// Dynamic import for AI function
type GenerateCustomQuizOutput = any;
const GenerateQuizPage = dynamic(() => import('../../../(main)/generate-quiz/page'), { 
    loading: () => <div className="flex items-center justify-center min-h-[60svh]"><Loader2 className="h-8 w-8 animate-spin" /></div> 
});
import { Loader2 } from "lucide-react";
import { BrainCircuit } from "lucide-react";
import { Sparkles } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
// Dynamic import for AI function
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { QuizGenerationLoading } from "@/components/enhanced-loading";
import { GenerationAd } from "@/components/ads/ad-banner";

function EcatTestFlow() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [comprehensionText, setComprehensionText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(25);

    const generateTest = useCallback(async () => {
        const subject = searchParams.get('subject');
        const topic = searchParams.get('topic');
        const numQuestions = searchParams.get('numQuestions');
        const difficulty = searchParams.get('difficulty') || 'hard';
        const questionStyles = ['Past Paper Style', 'Conceptual', 'Numerical'];
        const specificInstructions = searchParams.get('specificInstructions') || `Generate an ECAT-level test for the topic: ${topic}`;

        if (!topic) {
            setError("No topic specified for the test.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const quizInput = {
                topic: `ECAT ${subject} - ${topic}`,
                difficulty: difficulty as any,
                numberOfQuestions: Number(numQuestions) || 55,
                questionTypes: ["Multiple Choice"],
                questionStyles: questionStyles,
                timeLimit: Number(numQuestions) || 55,
                isPro: user?.plan === 'Pro',
                userAge: user?.age,
                userClass: "ECAT Student",
                specificInstructions: specificInstructions
            };
            const response = await fetch('/api/ai/custom-quiz', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(quizInput)
            });
            
            if (!response.ok) throw new Error('Failed to generate quiz');
            const result = await response.json();
            
            if (result.error) throw new Error(result.error);

             if (!result.quiz || result.quiz.length === 0) {
                throw new Error("The AI returned an empty quiz. Please try again.");
            }
            setQuiz(result.quiz);
            setComprehensionText(result.comprehensionText || null);
        } catch (err: any) {
            let errorMessage = "An unexpected error occurred while generating the test.";
             if (err?.message?.includes("429") || err?.message?.includes("overloaded")) {
                errorMessage = "The AI model is currently overloaded. Please wait a moment and try again.";
            } else if (err?.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [searchParams]);
    
    useEffect(() => {
        generateTest();
    }, [generateTest]);

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 95) {
                        clearInterval(interval);
                        return prev;
                    }
                    return prev + Math.random() * 10 + 5; // Random progress between 5-15%
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isLoading]);

    if (isLoading) {
        return (
            <div>
                <QuizGenerationLoading
                    progress={progress}
                    onRetry={generateTest}
                />
                <div className="mt-8">
                    <GenerationAd />
                </div>
            </div>
        )
    }

    if (error) {
         return (
            <div className="flex flex-col items-center justify-center min-h-[60svh] text-center p-4">
                <div className="p-4 bg-destructive/10 rounded-full mb-4">
                    <AlertTriangle className="h-10 w-10 text-destructive"/>
                </div>
                <PageHeader title="Could Not Generate Test" description={error}/>
                <Button asChild>
                    <Link href="/ecat">Back to ECAT Prep</Link>
                </Button>
            </div>
        );
    }

    if (quiz) {
        const topic = searchParams.get('topic');
        const numQuestions = searchParams.get('numQuestions');
        const difficulty = searchParams.get('difficulty') || 'hard';
        const questionStyles = ['Past Paper Style', 'Conceptual', 'Numerical'];
        const specificInstructions = searchParams.get('specificInstructions') || `Generate an ECAT-level test for the topic: ${topic}`;
        return <GenerateQuizPage 
            initialQuiz={quiz} 
            initialComprehensionText={comprehensionText || undefined}
            initialFormValues={{
                 topic: `ECAT: ${topic}` || "ECAT Test",
                 difficulty: difficulty as any,
                 numberOfQuestions: quiz.length,
                 questionTypes: ["Multiple Choice"],
                 questionStyles: questionStyles,
                 timeLimit: Number(numQuestions) || 55,
                 specificInstructions: specificInstructions
            }}
         />
    }
    
    return null; // Should not be reached
}

function EcatTestPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const subject = searchParams.get('subject');
    const topic = searchParams.get('topic');

    // Handle mock test logic here in the future
    if (searchParams.has('mock-test')) {
        router.replace('/ecat/mock-test');
         return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-xl text-muted-foreground">Redirecting to Mock Test...</p>
            </div>
        );
    }
    
    if (subject && topic) {
        return <EcatTestFlow />;
    }

    return (
        <div className="max-w-2xl mx-auto text-center">
             <PageHeader title="ECAT Test Setup Error" description="Could not start the test because the subject or topic was not specified correctly." />
             <Button asChild>
                 <Link href="/ecat">
                    Back to ECAT Home
                 </Link>
             </Button>
        </div>
    )
}


export default function EcatTestSuspenseWrapper() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[60svh] text-center p-4">
                <div className="relative">
                    <BrainCircuit className="h-20 w-20 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2 mt-6">Loading Test...</h2>
            </div>
        }>
            <EcatTestPage />
        </Suspense>
    )
}
