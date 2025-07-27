
"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter, notFound } from "next/navigation";
import { GenerateQuizPage, Quiz } from "../../generate-quiz/page";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

// Since the main component is client-side, we can just re-export it.
// However, we'll wrap it in a new component to handle the specific logic for MDCAT tests.

function MdcatTest() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const subject = searchParams.get('subject');
    const chapter = searchParams.get('chapter');

    if (!subject || !chapter) {
        // Or render a message asking them to select a chapter
        return (
            <div className="text-center">
                <PageHeader title="Invalid Test" description="Please select a subject and chapter to start an MDCAT test."/>
                <Button asChild>
                    <Link href="/mdcat">Back to MDCAT Prep</Link>
                </Button>
            </div>
        );
    }
    
    // Here you could pass pre-filled form values to the GenerateQuizPage
    // For now, we will let the user set the number of questions etc.
    // The topic will be pre-filled from the chapter name.
    
    // This is a simplified approach. We're re-using the `GenerateQuizPage` component.
    // We would need to modify `GenerateQuizPage` to accept initial values via props to pre-fill the form.
    // For this iteration, we will just use the GenerateQuizPage as is, which means the user will have to
    // manually enter the topic again. A future improvement would be to pass props.
    
    // For now, redirecting to the generate-quiz page with query params is a better approach
    // as it doesn't require complex state sharing between pages.
    // Let's modify GenerateQuizPage to read from query params.
    
    // The component is large so we are not going to render it directly.
    // Instead we will show a "start test" page that redirects to generate-quiz
    
    return (
        <div className="max-w-2xl mx-auto">
             <PageHeader title="MDCAT Chapter Test" description="Prepare for your test on the selected chapter." />
             <Card>
                <CardHeader>
                    <CardTitle>Test Details</CardTitle>
                    <CardDescription>You are about to start a test for the following chapter. Click below to configure and start your quiz.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p><strong>Subject:</strong> <span className="capitalize">{subject}</span></p>
                    <p><strong>Chapter:</strong> {chapter}</p>
                     <Button asChild className="mt-6 w-full" size="lg">
                        <Link href={`/generate-quiz?topic=${encodeURIComponent(chapter)}&difficulty=hard&questionStyles=Past Paper Style`}>
                           Proceed to Quiz Setup
                        </Link>
                    </Button>
                </CardContent>
             </Card>
        </div>
    )
}


export default function MdcatTestPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MdcatTest />
        </Suspense>
    )
}
