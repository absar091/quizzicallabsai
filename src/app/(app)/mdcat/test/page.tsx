
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

function MdcatTestFlow() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const subject = searchParams.get('subject');
    const chapter = searchParams.get('chapter');
    const topic = searchParams.get('topic');
    const difficulty = searchParams.get('difficulty') || 'hard';
    const questionStyles = searchParams.get('questionStyles') || 'Past Paper Style';

    useEffect(() => {
        if (!topic) {
            setError("No topic specified for the test.");
            setIsLoading(false);
            return;
        }

        const generateTest = async () => {
            try {
                const result = await generateCustomQuiz({
                    topic: topic,
                    difficulty: difficulty as any,
                    numberOfQuestions: 50,
                    questionTypes: ["Multiple Choice"],
                    questionStyles: questionStyles.split(','),
                    timeLimit: 50,
                    userAge: null,
                    userClass: "MDCAT Student",
                });
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
    }, [topic, difficulty, questionStyles, toast]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-xl text-muted-foreground">Preparing your MDCAT test for "{topic}"...</p>
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
                 timeLimit: 50,
            }}
         />
    }
    
    return null; // Should not be reached
}

function MdcatTestPage() {
    const searchParams = useSearchParams();
    const subject = searchParams.get('subject');
    const chapter = searchParams.get('chapter');

    if (subject && chapter) {
        return <MdcatTestFlow />;
    }

    return (
        <div className="max-w-2xl mx-auto">
             <PageHeader title="MDCAT Test Setup" description="Configure your chapter test." />
             <Card>
                <CardHeader>
                    <CardTitle>Test Details</CardTitle>
                    <CardDescription>You are about to start a test. Click below to configure and start your quiz.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p><strong>Subject:</strong> <span className="capitalize">{subject || 'Not selected'}</span></p>
                    <p><strong>Chapter:</strong> {chapter || 'Not selected'}</p>
                     <Button asChild className="mt-6 w-full" size="lg" disabled={!subject || !chapter}>
                        <Link href={`/generate-quiz?topic=${encodeURIComponent(chapter || '')}&difficulty=hard&questionStyles=Past Paper Style`}>
                           Proceed to Custom Quiz Setup
                        </Link>
                    </Button>
                </CardContent>
             </Card>
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
