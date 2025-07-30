
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { generateCustomQuiz, GenerateCustomQuizOutput } from "@/ai/flows/generate-custom-quiz";
import GenerateQuizPage, { Quiz } from "../../generate-quiz/page";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";


function MdcatTestFlow() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const subject = searchParams.get('subject');
    const topic = searchParams.get('topic');
    const numQuestions = searchParams.get('numQuestions');
    const difficulty = searchParams.get('difficulty') || 'hard';
    const questionStyles = searchParams.get('questionStyles') || 'Past Paper Style';

    useEffect(() => {
        if (!topic || !subject) {
            setError("No topic specified for the test.");
            setIsLoading(false);
            return;
        }
        
        const fullTopicForAI = `MDCAT ${subject} - ${topic}`;

        const generateTest = async () => {
            try {
                const result = await generateCustomQuiz({
                    topic: fullTopicForAI,
                    difficulty: difficulty as any,
                    numberOfQuestions: Number(numQuestions) || 20,
                    questionTypes: ["Multiple Choice"],
                    questionStyles: questionStyles.split(','),
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
                }
                setError(errorMessage);
                toast({
                    title: "Failed to Generate Test",
                    description: errorMessage,
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        generateTest();
    }, [topic, subject, difficulty, questionStyles, toast, numQuestions]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-xl text-muted-foreground text-center">Preparing your MDCAT test for "{topic}"...</p>
                <p className="text-sm text-muted-foreground mt-2">This may take a moment.</p>
            </div>
        )
    }

    if (error) {
         return (
            <div className="text-center">
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
                 topic: topic || "MDCAT Test",
                 difficulty: difficulty as any,
                 numberOfQuestions: quiz.length,
                 questionTypes: ["Multiple Choice"],
                 questionStyles: questionStyles.split(','),
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
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-xl text-muted-foreground">Loading test parameters...</p>
            </div>
        }>
            <MdcatTestPage />
        </Suspense>
    )
}
