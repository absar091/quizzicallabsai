
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, BookOpen, Download, AlertTriangle, BrainCircuit } from "lucide-react";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { generatePracticeQuestions, GeneratePracticeQuestionsOutput } from "@/ai/flows/generate-practice-questions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  topic: z.string().min(1, "Topic(s) or chapter(s) are required."),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  numberOfQuestions: z.number().min(1).max(55),
  questionType: z.enum(["multiple choice", "true/false", "short answer"]).optional(),
  learningStyle: z.string().optional(),
});

type Question = GeneratePracticeQuestionsOutput['questions'][0];

const addPdfHeaderAndFooter = (doc: any) => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text("Quizzicallabs AI", 20, 15);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        // Watermark
        doc.saveGraphicsState();
        doc.setFontSize(60);
        doc.setTextColor(220, 220, 220); // Light grey
        doc.setGState(new (doc as any).GState({opacity: 0.5}));
        doc.text("Quizzicallabs AI", pageWidth / 2, 150, { angle: 45, align: 'center' });
        doc.restoreGraphicsState();

        // Footer
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
    }
}


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
      numberOfQuestions: 10,
      questionType: "multiple choice",
      learningStyle: "",
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

  const downloadPdf = async () => {
    if (!questions) return;
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const topic = form.getValues('topic');
    let y = 30;
    const margin = 20;
    const maxWidth = doc.internal.pageSize.getWidth() - (margin * 2);
    const pageHeight = 270;

    const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight) {
            doc.addPage();
            y = 30;
        }
    };

    doc.setFontSize(18);
    doc.text(`Practice Questions: ${form.getValues('subject')}`, margin, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Topic(s): ${topic}`, margin, y);
    y += 15;


    questions.forEach((q, index) => {
        checkPageBreak(50); // Estimate height for a question block
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        const questionText = doc.splitTextToSize(`${index + 1}. ${q.question}`, maxWidth);
        doc.text(questionText, margin, y);
        y += (questionText.length * 5) + 5;

        doc.setFont('helvetica', 'normal');
        if (q.options) {
            q.options.forEach((opt, i) => {
                checkPageBreak(5);
                const optionText = doc.splitTextToSize(`(${String.fromCharCode(97 + i)}) ${opt}`, maxWidth - 5);
                doc.text(optionText, margin + 5, y);
                y += (optionText.length * 4) + 2;
            });
        }
        
        y += 3;
        doc.setFont('helvetica', 'bold');
        checkPageBreak(5);
        const answerText = doc.splitTextToSize(`Answer: ${q.answer}`, maxWidth);
        doc.text(answerText, margin, y);
        y += (answerText.length * 5);
        
        doc.setFont('helvetica', 'italic');
        checkPageBreak(10);
        const explanationText = doc.splitTextToSize(`Explanation: ${q.explanation}`, maxWidth);
        doc.text(explanationText, margin, y);
        y += (explanationText.length * 5) + 10;
    });
    
    addPdfHeaderAndFooter(doc);

    doc.save(`${form.getValues('subject').replace(/s+/g, '_')}_practice_questions.pdf`);
  };

  return (
    <>
      <PageHeader
        title="Practice Questions"
        description="Generate practice questions for any subject and topic instantly."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
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
                        <FormLabel>Topic(s) / Chapter(s)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., Photosynthesis, Cell Respiration" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">You can enter multiple topics or chapters, separated by commas.</FormDescription>
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
                            </SelectTrigger>
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
                        <Alert className="mt-2 text-xs p-2">
                           <AlertTriangle className="h-4 w-4"/>
                           <AlertDescription>
                             The AI-generated count may sometimes vary slightly from your selection.
                           </AlertDescription>
                        </Alert>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="learningStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Learning Style (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., visual, analogies, simple examples" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" size="lg" disabled={isGenerating}>
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
          <Card className="min-h-[400px]">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Generated Questions</CardTitle>
                <CardDescription>Click on a question to see the options and reveal the answer.</CardDescription>
              </div>
              {questions && questions.length > 0 && (
                <Button onClick={downloadPdf} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              )}
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
                       <Card className="bg-muted/50">
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
                                    visibleAnswers[index] && opt === q.answer ? "border-primary bg-primary/10 font-semibold" : "bg-muted"
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
                               <Alert variant="default" className="bg-background">
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
                  <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
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
