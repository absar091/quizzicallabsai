
"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, UploadCloud, ArrowLeft, CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { generateQuizFromDocument, GenerateQuizFromDocumentOutput } from "@/ai/flows/generate-quiz-from-document";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";

const formSchema = z.object({
  document: z.any().refine((files) => files?.length == 1, "Please upload a document."),
  quizLength: z.number().min(1).max(55),
});

type Quiz = GenerateQuizFromDocumentOutput["quiz"];

export default function GenerateFromDocumentPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quizLength: 5,
    },
  });

  const fileRef = form.register("document");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setQuiz(null);
    setShowResults(false);
    setUserAnswers([]);

    const file = values.document[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const dataUri = reader.result as string;
      try {
        const result = await generateQuizFromDocument({
          documentDataUri: dataUri,
          quizLength: values.quizLength,
        });
        setQuiz(result.quiz);
        setUserAnswers(new Array(result.quiz.length).fill(null));
      } catch (error) {
        toast({
          title: "Error Generating Quiz",
          description: "An error occurred while generating the quiz from the document. Please try again.",
          variant: "destructive",
        });
        console.error(error);
      } finally {
        setIsGenerating(false);
      }
    };

    reader.readAsDataURL(file);
  }
  
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const calculateScore = useCallback(() => {
    return quiz?.reduce((score, question, index) => {
      return score + (question.correctAnswerIndex === userAnswers[index] ? 1 : 0);
    }, 0) ?? 0;
  }, [quiz, userAnswers]);


  const resetQuiz = () => {
    setQuiz(null);
    setShowResults(false);
    setUserAnswers([]);
    setFileName(null);
    form.reset();
  }

  if (showResults && quiz) {
     const score = calculateScore();
     const total = quiz.length;
     const percentage = (score / total) * 100;
      return (
       <div className="max-w-4xl mx-auto">
        <PageHeader title="Quiz Results" description={`You scored ${score} out of ${total}.`} />
        <Card>
            <CardHeader>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <Card className="pt-6 bg-muted/50">
                        <CardTitle className="text-4xl font-bold">{score}/{total}</CardTitle>
                        <CardDescription>Score</CardDescription>
                    </Card>
                     <Card className="pt-6 bg-muted/50">
                        <CardTitle className="text-4xl font-bold">{percentage.toFixed(0)}%</CardTitle>
                        <CardDescription>Percentage</CardDescription>
                    </Card>
                     <Card className="pt-6 bg-muted/50">
                        <CardTitle className={cn("text-4xl font-bold", percentage >= 50 ? "text-primary" : "text-destructive")}>{percentage >= 50 ? 'Pass' : 'Fail'}</CardTitle>
                        <CardDescription>Status</CardDescription>
                    </Card>
                </div>
            </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {quiz.map((q, i) => {
                const isCorrect = userAnswers[i] === q.correctAnswerIndex;
                return (
                 <div key={i} className={cn("p-4 border rounded-lg", isCorrect ? "border-primary bg-primary/10" : "border-destructive bg-destructive/10")}>
                    <p className="font-semibold">{i + 1}. {q.question}</p>
                    <div className="mt-2 text-sm space-y-1">
                        <p className={cn("flex items-center gap-2", isCorrect ? 'text-primary' : 'text-destructive')}>
                            {isCorrect ? <CheckCircle className="h-4 w-4"/> : <XCircle className="h-4 w-4"/>}
                            Your answer: {userAnswers[i] !== null ? q.answers[userAnswers[i] as number] : "Not answered"}
                        </p>
                       {!isCorrect && <p className="text-primary ml-6">Correct answer: {q.answers[q.correctAnswerIndex]}</p>}
                    </div>
                </div>
                )
            })}
          </CardContent>
           <CardFooter>
            <Button onClick={resetQuiz} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Take another quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (isGenerating) {
     return (
        <div className="flex flex-col items-center justify-center h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-xl text-muted-foreground">Generating quiz from your document...</p>
            <p className="text-sm text-muted-foreground mt-2">This may take a moment.</p>
        </div>
    )
  }
  
  if (quiz) {
    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader title="Quiz from Document" description="Answer the questions below." />
            <Card>
                <CardContent className="pt-6 space-y-6">
                    {quiz.map((q, qIndex) => (
                        <div key={qIndex}>
                            <p className="font-semibold text-lg">{qIndex + 1}. {q.question}</p>
                            <div className="mt-4 space-y-3">
                                {q.answers.map((ans, ansIndex) => (
                                    <label key={ansIndex} className="flex items-center p-4 rounded-md border has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-all duration-200 cursor-pointer">
                                        <input type="radio" id={`q${qIndex}a${ansIndex}`} name={`q${qIndex}`} value={ansIndex} onChange={() => handleAnswerSelect(qIndex, ansIndex)} className="mr-3 h-4 w-4 accent-primary" />
                                        <span className="flex-1 text-base">{ans}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    
                </CardContent>
                 <CardFooter>
                    <Button onClick={() => setShowResults(true)} disabled={userAnswers.some(a => a === null)} size="lg">Submit Quiz</Button>
                </CardFooter>
            </Card>
        </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Quiz from Document"
        description="Upload your study materials (PDF, DOCX) to create a quiz."
      />

      <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Parameters</CardTitle>
               <CardDescription>Upload a document and specify the number of questions you want.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Study Document</FormLabel>
                        <FormControl>
                          <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-accent">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">PDF, DOCX (MAX. 10MB)</p>
                                    {fileName && <p className="mt-2 text-xs text-primary">{fileName}</p>}
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" {...fileRef} onChange={(e) => {
                                  field.onChange(e.target.files);
                                  setFileName(e.target.files?.[0]?.name ?? null);
                                }} accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quizLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Questions: <span className="font-bold text-primary">{field.value}</span></FormLabel>
                        <FormControl>
                           <Slider
                            onValueChange={(value) => field.onChange(value[0])}
                            defaultValue={[field.value]}
                            max={55}
                            min={1}
                            step={1}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" size="lg" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Quiz...
                      </>
                    ) : (
                      "Generate Quiz"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
      </div>
    </>
  );
}
