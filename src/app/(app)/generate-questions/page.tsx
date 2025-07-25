
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, BookOpen } from "lucide-react";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { generatePracticeQuestions, GeneratePracticeQuestionsOutput } from "@/ai/flows/generate-practice-questions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Practice Question Generator",
    description: "Instantly generate practice questions for any subject and topic. Choose difficulty, question type, and number of questions to create the perfect study set.",
};

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  topic: z.string().min(1, "Topic is required."),
  difficulty: z.enum(["easy", "medium", "hard"]),
  numberOfQuestions: z.coerce.number().min(1).max(55),
  questionType: z.enum(["multiple choice", "true/false", "short answer"]),
});

type Question = GeneratePracticeQuestionsOutput['questions'][0];

export default function GenerateQuestionsPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [visibleAnswers, setVisibleAnswers] = useState<Record<number, boolean>>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      topic: "",
      difficulty: "medium",
      numberOfQuestions: 5,
      questionType: "multiple choice",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setQuestions(null);
    setVisibleAnswers({});
    try {
      const result = await generatePracticeQuestions(values);
      setQuestions(result.questions);
    } catch (error) {
      toast({
        title: "Error Generating Questions",
        description: "An error occurred while generating practice questions. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }

  const toggleAnswerVisibility = (index: number) => {
    setVisibleAnswers(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <>
      <PageHeader
        title="Practice Questions"
        description="Generate practice questions for any subject and topic instantly."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="bg-card/80 backdrop-blur-sm sticky top-24">
            <CardHeader>
              <CardTitle>Question Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Biology" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Photosynthesis" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="questionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a question type" />
                            </Trigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="multiple choice">Multiple Choice</SelectItem>
                            <SelectItem value="true/false">True/False</SelectItem>
                            <SelectItem value="short answer">Short Answer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numberOfQuestions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Questions</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Questions"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="min-h-[400px] bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Generated Questions</CardTitle>
              <CardDescription>Click on a question to see the options and reveal the answer.</CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating && (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {questions && (
                 <Accordion type="single" collapsible className="w-full space-y-4">
                  {questions.map((q, index) => (
                    <AccordionItem value={`item-${index}`} key={index} className="border-b-0">
                       <Card className="bg-background/70">
                        <AccordionTrigger className="text-left p-6 hover:no-underline">
                          <span className="flex-1 font-semibold">{index + 1}. {q.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          {q.options && (
                            <div className="mb-4">
                              <h4 className="font-semibold mb-3 text-sm text-muted-foreground">Options:</h4>
                              <ul className="space-y-2">
                                {q.options.map((opt, i) => (
                                  <li key={i} className={cn(
                                    "p-3 rounded-md border text-sm",
                                    visibleAnswers[index] && opt === q.answer ? "border-primary bg-primary/10 font-semibold" : "bg-muted/50"
                                    )}
                                  >
                                    {opt}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {visibleAnswers[index] ? (
                            <div className="space-y-4">
                              <Alert className="border-primary/50 text-primary-900 dark:text-primary-200 bg-primary/10">
                                  <AlertTitle className="text-primary dark:text-primary-300 font-bold">Correct Answer</AlertTitle>
                                  <AlertDescription className="text-primary/90 dark:text-primary-200/90">
                                      {q.answer}
                                  </AlertDescription>
                              </Alert>
                               <Alert variant="default" className="bg-muted/50">
                                <AlertTitle className="font-semibold">Explanation</AlertTitle>
                                <AlertDescription>
                                  {q.explanation}
                                </AlertDescription>
                              </Alert>
                            </div>
                          ) : (
                            <Button onClick={() => toggleAnswerVisibility(index)} variant="outline">
                              <Eye className="mr-2 h-4 w-4" />
                              Show Answer
                            </Button>
                          )}
                        </AccordionContent>
                      </Card>
                    </AccordionItem>
                  ))}
                 </Accordion>
              )}
              {!isGenerating && !questions && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Your generated questions will appear here.</p>
                  <p className="text-xs text-muted-foreground mt-1">Fill out the form to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
