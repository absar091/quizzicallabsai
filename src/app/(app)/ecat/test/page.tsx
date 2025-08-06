
"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { generateCustomQuiz, GenerateCustomQuizOutput } from "@/ai/flows/generate-custom-quiz";
import GenerateQuizPage, { Quiz } from "../../generate-quiz/page";
import { Loader2, BrainCircuit, Sparkles, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

function EcatTestFlow() {
    const searchParams = useSearchParams();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [comprehensionText, setComprehensionText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const subject = searchParams.get('subject');
    const topic = searchParams.get('topic');
    const numQuestions = searchParams.get('numQuestions');
    const difficulty = searchParams.get('difficulty') || 'hard';
    
    // Fix: Use hardcoded styles appropriate for ECAT to prevent AI from stalling on empty array.
    const questionStyles = ['Past Paper Style', 'Conceptual', 'Numerical'];
    
    const specificInstructions = searchParams.get('specificInstructions') || `Generate an ECAT-level test for the topic: ${topic}`;

    const generateTest = useCallback(async () => {
        if (!topic) {
            setError("No topic specified for the test.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const result = await generateCustomQuiz({
                topic: `ECAT ${subject} - ${topic}`,
                difficulty: difficulty as any,
                numberOfQuestions: Number(numQuestions) || 20,
                questionTypes: ["Multiple Choice"],
                questionStyles: questionStyles,
                timeLimit: Number(numQuestions) || 20,
                userAge: null,
                userClass: "ECAT Student",
                specificInstructions: specificInstructions
            });
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
    }, [topic, subject, difficulty, questionStyles, numQuestions, specificInstructions]);
    

    useEffect(() => {
        generateTest();
    }, [generateTest]);

    if (isLoading) {
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
                <h2 className="text-2xl font-semibold mb-2 mt-6">Preparing your ECAT test for "{topic}"...</h2>
                <p className="text-muted-foreground max-w-sm mb-6">This may take a moment.</p>
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
        return <GenerateQuizPage 
            initialQuiz={quiz} 
            initialComprehensionText={comprehensionText || undefined}
            initialFormValues={{
                 topic: `ECAT: ${topic}` || "ECAT Test",
                 difficulty: difficulty as any,
                 numberOfQuestions: quiz.length,
                 questionTypes: ["Multiple Choice"],
                 questionStyles: questionStyles,
                 timeLimit: Number(numQuestions) || 20,
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
