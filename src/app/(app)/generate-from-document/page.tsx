
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { generateQuizFromDocument, GenerateQuizFromDocumentOutput } from "@/ai/flows/generate-quiz-from-document";
import { DocumentQuizQuestion } from "@/lib/types";

const formSchema = z.object({
  document: z.any().refine((file) => file?.length == 1, "Please upload a document."),
  quizLength: z.coerce.number().min(1, "Please enter a number of questions.").max(20),
});

export default function GenerateFromDocumentPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState<DocumentQuizQuestion[] | null>(null);

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

    const file = values.document[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const dataUri = reader.result as string;
      try {
        const result: GenerateQuizFromDocumentOutput = await generateQuizFromDocument({
          documentDataUri: dataUri,
          quizLength: values.quizLength,
        });
        const parsedQuiz = JSON.parse(result.quiz);
        setQuiz(parsedQuiz.questions);
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

  return (
    <div>
      <PageHeader
        title="Quiz from Document"
        description="Upload your study materials (PDF, DOCX) to create a quiz."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Study Document</FormLabel>
                        <FormControl>
                          <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">PDF, DOCX (MAX. 5MB)</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" {...fileRef} />
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
                        <FormLabel>Number of Questions</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isGenerating}>
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
        <div className="lg:col-span-2">
          <Card className="min-h-[400px]">
            <CardHeader>
              <CardTitle>Generated Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              {isGenerating && (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {quiz && (
                <div className="space-y-6">
                  {quiz.map((q, index) => (
                    <div key={index}>
                      <p className="font-semibold">{index + 1}. {q.question}</p>
                      <ul className="mt-2 space-y-1 list-disc list-inside">
                        {q.answers.map((ans, ansIndex) => (
                          <li key={ansIndex} className={ansIndex === q.correctAnswerIndex ? 'text-green-600' : ''}>{ans}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {!isGenerating && !quiz && (
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">Your generated quiz will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
