
"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { generateCustomQuiz } from "@/ai/flows/generate-custom-quiz";
import GenerateQuizPage, { Quiz } from "../../generate-quiz/page";
import { Loader2, BrainCircuit, Sparkles, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

function MdcatTestFlow() {
    const searchParams = useSearchParams();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const subject = searchParams.get('subject');
    const topic = searchParams.get('topic');
    const numQuestions = searchParams.get('numQuestions');
    const difficulty = searchParams.get('difficulty') || 'hard';
    
    // This was the source of the bug. The `questionStyles` were coming from the URL,
    // but were often empty for these tests, causing the AI to hang.
    // We now hardcode them to ensure the AI always has valid instructions.
    const questionStyles = ['Past Paper Style', 'Conceptual'];

    const generateTest = useCallback(async () => {
        if (!topic || !subject) {
            setError("No topic specified for the test.");
            setIsLoading(false);
            return;
        }

        const fullTopicForAI = `MDCAT ${subject} - ${topic}`;
        setIsLoading(true);
        setError(null);

        try {
            const result = await generateCustomQuiz({
                topic: fullTopicForAI,
                difficulty: difficulty as any,
                numberOfQuestions: Number(numQuestions) || 20,
                questionTypes: ["Multiple Choice"],
                questionStyles: questionStyles,
                timeLimit: Number(numQuestions) || 20,
                userAge: null,
                userClass: "MDCAT Student",
                specificInstructions: `Generate an MDCAT-level test for the topic: ${topic}. Questions should be strictly based on the official MDCAT syllabus.`
            });
            if (!result.quiz || result.quiz.length === 0) {
                throw new Error("The AI returned an empty quiz. Please try again.");
            }
            setQuiz(result.quiz);
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
    }, [topic, subject, difficulty, numQuestions, questionStyles]);

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
                <h2 className="text-2xl font-semibold mb-2 mt-6">Preparing your MDCAT test for "{topic}"...</h2>
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
                    <Link href="/mdcat">Back to MDCAT Prep</Link>
                </Button>
            </div>
        );
    }

    if (quiz) {
        return <GenerateQuizPage 
            initialQuiz={quiz} 
            initialFormValues={{
                 topic: `MDCAT: ${topic}` || "MDCAT Test",
                 difficulty: difficulty as any,
                 numberOfQuestions: quiz.length,
                 questionTypes: ["Multiple Choice"],
                 questionStyles: questionStyles,
                 timeLimit: Number(numQuestions) || 20,
                 specificInstructions: ""
            }}
         />
    }
    
    return null; // Should not be reached
}

function MdcatTestPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const subject = searchParams.get('subject');
    const topic = searchParams.get('topic');

    // Handle mock test logic here
    if (searchParams.has('mock-test')) {
        router.replace('/mdcat/mock-test');
        return (
             <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-xl text-muted-foreground">Redirecting to Mock Test...</p>
            </div>
        );
    }

    if (subject && topic) {
        return <MdcatTestFlow />;
    }

    return (
        <div className="max-w-2xl mx-auto text-center">
             <PageHeader title="MDCAT Test Setup Error" description="Could not start the test because the subject or topic was not specified correctly." />
             <Button asChild>
                 <Link href="/mdcat">
                    Back to MDCAT Home
                 </Link>
             </Button>
        </div>
    )
}


export default function MdcatTestSuspenseWrapper() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[60svh] text-center p-4">
                <div className="relative">
                    <BrainCircuit className="h-20 w-20 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2 mt-6">Loading Test...</h2>
            </div>
        }>
            <MdcatTestPage />
        </Suspense>
    )
}
