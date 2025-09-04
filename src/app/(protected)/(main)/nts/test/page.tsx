
"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import GenerateQuizPage, { Quiz } from "../../../(main)/generate-quiz/page";
import { Loader2, BrainCircuit, Sparkles, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// Dynamic import for AI function
import { motion } from "framer-motion";

function NtsTestFlow() {
    const searchParams = useSearchParams();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const generateTest = useCallback(async () => {
        const category = searchParams.get('category');
        const subject = searchParams.get('subject');
        const chapter = searchParams.get('chapter');
        const numQuestions = 25; // Subject portion has 25 MCQs

        if (!category || !subject || !chapter) {
            setError("Invalid test parameters. Please go back and select a category and topic.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Construct a more detailed topic for the AI
            const topicForAI = `NTS test for category '${category}' on the subject of '${subject}', focusing specifically on the chapter: '${chapter}'. Questions should be past-paper style and appropriate for this test level.`;
            
            const response = await fetch('/api/ai/nts-quiz', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(quizInput)
            });
            
            if (!response.ok) throw new Error('Failed to generate quiz');
            const result = await response.json();
            
            if (result.error) throw new Error(result.error);
            const aiResult = await generateNtsQuiz({
                category: category,
                topic: topicForAI,
                numberOfQuestions: numQuestions,
            });
            if (!aiResult.quiz || aiResult.quiz.length === 0) {
                throw new Error("The AI returned an empty quiz. Please try again.");
            }
            // The output of generateNtsQuiz is slightly different, so we format it for GenerateQuizPage
            const formattedQuiz = aiResult.quiz.map(q => ({
                question: q.question,
                answers: q.answers,
                correctAnswer: q.correctAnswer,
                type: 'multiple-choice' as const, // Explicitly set type
            }));

            setQuiz(formattedQuiz);
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
                <h2 className="text-2xl font-semibold mb-2 mt-6">Preparing your NTS test for "{searchParams.get('chapter')}"...</h2>
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
                    <Link href="/nts">Back to NTS Prep</Link>
                </Button>
            </div>
        );
    }

    if (quiz) {
        const category = searchParams.get('category') || "NTS";
        const subject = searchParams.get('subject') || "";
        const chapter = searchParams.get('chapter') || "";
        const numQuestions = 25;

        return <GenerateQuizPage 
            initialQuiz={quiz} 
            initialFormValues={{
                 topic: `NTS: ${subject} - ${chapter}`,
                 difficulty: 'medium' as any, // NTS is generally medium
                 numberOfQuestions: quiz.length,
                 questionTypes: ["Multiple Choice"],
                 questionStyles: [],
                 timeLimit: numQuestions,
                 specificInstructions: `NTS ${category} test on ${subject} - ${chapter}`
            }}
         />
    }
    
    return null; // Should not be reached
}

function NtsTestPage() {
    const searchParams = useSearchParams();
    const category = searchParams.get('category');
    const subject = searchParams.get('subject');
    const chapter = searchParams.get('chapter');
    
    if (category && subject && chapter) {
        return <NtsTestFlow />;
    }

    return (
        <div className="max-w-2xl mx-auto text-center">
             <PageHeader title="NTS Test Setup Error" description="Could not start the test because the category, subject or chapter was not specified correctly." />
             <Button asChild>
                 <Link href="/nts">
                    Back to NTS Home
                 </Link>
             </Button>
        </div>
    )
}

export default function NtsTestSuspenseWrapper() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[60svh] text-center p-4">
                <div className="relative">
                    <BrainCircuit className="h-20 w-20 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2 mt-6">Loading Test...</h2>
            </div>
        }>
            <NtsTestPage />
        </Suspense>
    )
}

    
