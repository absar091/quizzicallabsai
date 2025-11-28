
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles, Download, Replace, AlertTriangle } from "lucide-react";
import { GraduationCap, User, Calendar, Clock, Exam, Columns, Square, FileText as FileTextIcon } from "@phosphor-icons/react";


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
// Dynamic import for AI function
type GenerateCustomQuizOutput = any;
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";


import { useAuth } from "@/hooks/useAuth";


type Quiz = GenerateCustomQuizOutput["quiz"];
type QuizVariant = {
    variant: string;
    questions: Quiz;
}

const formSchema = z.object({
  schoolName: z.string().min(1, "School name is required."),
  className: z.string().min(1, "Class name is required."),
  subject: z.string().min(1, "Subject/Topic is required."),
  numberOfQuestions: z.number().min(1).max(55),
  numberOfVariants: z.number().min(1).max(5),
  difficulty: z.enum(["easy", "medium", "hard", "master"]),
  questionTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one question type.",
  }),
  age: z.coerce.number().min(5, "Age must be at least 5.").max(100).optional(),
  includeAnswerKey: z.boolean().default(true),
  includeAnswerLines: z.boolean().default(true),
  testDate: z.string().optional(),
  timeLimit: z.coerce.number().min(1).optional(),
  totalMarks: z.coerce.number().min(1).optional(),
  teacherName: z.string().optional(),
  layoutStyle: z.enum(['single-column', 'two-column']).default('single-column'),
});

type PaperFormValues = z.infer<typeof formSchema>;

const questionTypeOptions = [
    { id: "Multiple Choice", label: "Multiple Choice" },
    { id: "Descriptive", label: "Short/Long Questions" },
]

export default function GeneratePaperPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizVariants, setQuizVariants] = useState<QuizVariant[] | null>(null);
  const [formValues, setFormValues] = useState<PaperFormValues | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  const form = useForm<PaperFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: "",
      className: "",
      subject: "",
      numberOfQuestions: 10,
      numberOfVariants: 1,
      difficulty: "medium",
      questionTypes: ["Multiple Choice"],
      includeAnswerKey: true,
      includeAnswerLines: true,
      age: undefined,
      testDate: "",
      timeLimit: undefined,
      totalMarks: undefined,
      teacherName: "",
      layoutStyle: 'single-column',
    },
  });

  const watchQuestionTypes = form.watch('questionTypes');

    async function onSubmit(values: PaperFormValues) {
    setIsGenerating(true);
    setQuizVariants(null);
    setFormValues(values);
    setGenerationProgress(0);

    try {
        const variants: QuizVariant[] = [];
        for (let i = 0; i < values.numberOfVariants; i++) {
            const progress = ((i + 1) / values.numberOfVariants) * 100;
            setGenerationProgress(progress);
            
            // Get auth token
            const { getAuth } = await import('firebase/auth');
            const auth = getAuth();
            const token = await auth.currentUser?.getIdToken();
            
            if (!token) {
              throw new Error('Please sign in to generate exam papers');
            }

            const response = await fetch('/api/ai/custom-quiz', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                ...values,
                isPro: user?.plan === 'Pro',
                userAge: user?.age,
                userClass: user?.className
              })
            });
            
            if (!response.ok) throw new Error('Failed to generate quiz');
            const result = await response.json();
            
            if (result.error) throw new Error(result.error);

            if (!result.quiz || result.quiz.length === 0) {
              throw new Error(`The AI failed to generate questions for Variant ${String.fromCharCode(65 + i)}. Please try adjusting the topic or difficulty.`);
            }

            variants.push({
                variant: String.fromCharCode(65 + i), // A, B, C...
                questions: result.quiz,
            });
        }
        setQuizVariants(variants);
    } catch (error: any) {
      toast({
        title: "Error Generating Paper",
        description: error.message || "An error occurred while generating questions. The AI model might be busy. Please try again.",
        variant: "destructive",
      });
    } finally {
        setIsGenerating(false);
    }
  }

  const downloadPdf = async () => {
    if (!quizVariants || !formValues) return;
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });
    
    quizVariants.forEach((variantData, variantIndex) => {
        if(variantIndex > 0) {
            doc.addPage();
        }
        
        const { variant, questions } = variantData;
        const isTwoColumn = formValues.layoutStyle === 'two-column' && !formValues.questionTypes.includes('Descriptive');
        
        let y = 15;
        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const contentWidth = isTwoColumn ? (pageWidth / 2) - margin - (margin / 4) : pageWidth - margin * 2;
        const midPoint = pageWidth / 2 + (margin/4);

        const addHeader = (docInstance: any) => {
            docInstance.setFont('helvetica', 'bold');
            docInstance.setFontSize(16);
            docInstance.text(formValues.schoolName.toUpperCase(), pageWidth / 2, y, { align: 'center' });
            y += 8;

            docInstance.setFont('helvetica', 'normal');
            docInstance.setFontSize(12);
            let subjectLine = `Class: ${formValues.className} – Subject: ${formValues.subject}`;
            if (quizVariants.length > 1) {
                subjectLine += ` (Version: ${variant})`;
            }
            docInstance.text(subjectLine, pageWidth / 2, y, { align: 'center' });
            y += 8;

            docInstance.setFontSize(10);
            let dateLine = formValues.testDate ? `Date: ${new Date(formValues.testDate).toLocaleDateString()}` : '';
            let marksLine = formValues.totalMarks ? `Total Marks: ${formValues.totalMarks}` : '';
            docInstance.text(dateLine, margin, y + 5);
            docInstance.text(marksLine, margin, y + 10);

            let teacherLine = formValues.teacherName ? `Teacher: ${formValues.teacherName}` : '';
            let timeLine = formValues.timeLimit ? `Time Allowed: ${formValues.timeLimit} minutes` : '';
            docInstance.text(teacherLine, pageWidth - margin, y + 5, { align: 'right' });
            docInstance.text(timeLine, pageWidth - margin, y + 10, { align: 'right' });

            y += 15;
            docInstance.setLineWidth(0.5);
            docInstance.line(margin, y, pageWidth - margin, y);
            y += 10;
        };

        const addFooter = (docInstance: any, pageNum: number) => {
             docInstance.setFontSize(8);
             docInstance.setTextColor(150);
             docInstance.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }
        
        let currentPage = 1;
        addHeader(doc);
        addFooter(doc, currentPage);

        let currentColumn = 1;
        let y_col1 = y;
        let y_col2 = y;
        
        questions.forEach((q, i) => {
            const questionText = `${i + 1}. ${q.question}`;
            const questionLines = doc.splitTextToSize(questionText, contentWidth);
            let neededHeight = (questionLines.length * 5) + 5;

            if (q.type === 'multiple-choice' && q.answers) {
                q.answers.forEach((ans) => {
                    const answerLines = doc.splitTextToSize(`(A) ${ans}`, contentWidth - 8);
                    neededHeight += (answerLines.length * 4) + 2;
                });
            } else if (q.type === 'descriptive' && formValues.includeAnswerLines) {
                neededHeight += 25; // Space for written answer
            }
            
            let current_y = isTwoColumn ? (currentColumn === 1 ? y_col1 : y_col2) : y;
            let current_x = isTwoColumn ? (currentColumn === 1 ? margin : midPoint) : margin;

            if (current_y + neededHeight > pageHeight - 20) {
                if (isTwoColumn && currentColumn === 1) {
                    currentColumn = 2;
                    current_y = y_col2;
                    current_x = midPoint;
                } else {
                    doc.addPage();
                    currentPage++;
                    y = 15;
                    addHeader(doc);
                    addFooter(doc, currentPage);
                    currentColumn = 1;
                    y_col1 = y;
                    y_col2 = y;
                    current_y = y;
                    current_x = margin;
                }
            }

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.text(questionLines, current_x, current_y, { maxWidth: contentWidth });
            current_y += questionLines.length * 5 + 3;
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);

            if (q.type === 'multiple-choice' && q.answers) {
                q.answers.forEach((ans, ansIndex) => {
                    const answerLetter = `(${String.fromCharCode(65 + ansIndex)})`;
                    const answerText = doc.splitTextToSize(`${answerLetter} ${ans}`, contentWidth - 8);
                    doc.text(answerText, current_x + 5, current_y);
                    current_y += answerText.length * 4 + 2;
                });
            } else if (q.type === 'descriptive' && formValues.includeAnswerLines) {
                current_y += 5;
                doc.setLineWidth(0.2);
                for(let j=0; j<3; j++) {
                     if (current_y + 7 > pageHeight - 20) {
                        if (isTwoColumn && currentColumn === 1) {
                             currentColumn = 2;
                             current_y = y_col2;
                        } else {
                            doc.addPage(); currentPage++; y=15; addHeader(doc); addFooter(doc, currentPage); currentColumn=1; y_col1=y; y_col2=y; current_y=y;
                        }
                     }
                     doc.line(current_x, current_y, current_x + contentWidth, current_y);
                     current_y += 7;
                }
            }
            current_y += 8;

            if(isTwoColumn) {
                if (currentColumn === 1) y_col1 = current_y; else y_col2 = current_y;
            } else {
                y = current_y;
            }
        });

        // Answer Key Page
        if (formValues.includeAnswerKey) {
            const mcqs = questions.filter(q => q.type === 'multiple-choice' && q.correctAnswer);
            if (mcqs.length > 0) {
                doc.addPage();
                currentPage++;
                y = 15;
                addHeader(doc);
                addFooter(doc, currentPage);

                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text("Answer Key", pageWidth / 2, y, { align: 'center' });
                y += 15;

                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');

                const numColumns = 4;
                const colWidth = (pageWidth - margin * 2) / numColumns;
                const rowsPerColumn = Math.ceil(mcqs.length / numColumns);
                
                mcqs.forEach((q, i) => {
                    const col = Math.floor(i / rowsPerColumn);
                    const row = i % rowsPerColumn;

                    const originalIndex = questions.findIndex(origQ => origQ.question === q.question);
                    const correctAnswerLetter = String.fromCharCode(65 + (q.answers?.findIndex(ans => ans === q.correctAnswer) ?? 0));
                    const keyText = `${originalIndex + 1}. ${correctAnswerLetter}`;
                    
                    const xPos = margin + (col * colWidth);
                    const yPos = y + (row * 8);

                    doc.text(keyText, xPos, yPos);
                });
            }
        }
    });

    doc.save(`${formValues.subject}_paper_${quizVariants?.length > 1 ? `${quizVariants.length}_variants` : ''}.pdf`);
  };


  if (isGenerating) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[60svh] text-center p-4">
        <Loader2 className="h-12 w-12 text-primary mb-4 animate-spin" />
        <h2 className="text-2xl font-semibold mb-2">Generating Your Paper...</h2>
        <p className="text-muted-foreground max-w-sm mb-6">
            {quizVariants ? `Generating variant ${quizVariants.length + 1} of ${formValues?.numberOfVariants}...` : 'Starting AI generation...'}
        </p>
        <div className="w-full max-w-sm">
           <Progress value={generationProgress} />
           <p className="text-sm mt-2 text-primary font-medium">{generationProgress.toFixed(0)}%</p>
        </div>
      </div>
    );
  }

  if (quizVariants && formValues) {
    return (
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Paper Generated Successfully" description={`Your exam paper with ${quizVariants.length} variant(s) is ready.`} />
        <Card>
          <CardHeader>
            <CardTitle>{formValues.schoolName}</CardTitle>
            <CardDescription>
                {`Class: ${formValues.className} | Subject: ${formValues.subject}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Accordion type="single" collapsible className="w-full">
                {quizVariants.map((variantData, index) => (
                   <AccordionItem value={`item-${index}`} key={index}>
                     <AccordionTrigger>Version {variantData.variant}</AccordionTrigger>
                     <AccordionContent>
                        <div className="space-y-4 max-h-[50vh] overflow-y-auto p-4 border rounded-lg">
                            {variantData.questions.map((q, i) => (
                                <div key={i}>
                                    <p className="font-semibold">{i+1}. {q.question}</p>
                                    {q.type === 'multiple-choice' && q.answers && (
                                        <ul className="list-disc list-inside pl-4 mt-1 text-sm">
                                            {q.answers.map((ans, j) => <li key={j}>{ans}</li>)}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                     </AccordionContent>
                   </AccordionItem>
                ))}
            </Accordion>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row gap-4">
            <Button onClick={downloadPdf} size="lg"><Download className="mr-2 h-4 w-4" /> Download All as PDF</Button>
            <Button onClick={() => setQuizVariants(null)} variant="outline"><Replace className="mr-2 h-4 w-4" /> Generate New Paper</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Generate Exam Paper"
        description="A tool for teachers to create and download formatted test papers for students."
      />

      <Card className="max-w-3xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                 <h3 className="text-lg font-semibold border-b pb-2 mb-4">Paper Details</h3>
              </div>
              
              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><GraduationCap className="h-4 w-4"/> School Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Springfield High" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teacherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><User className="h-4 w-4"/> Teacher's Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mr. Saleem" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                 <h3 className="text-lg font-semibold border-b pb-2 mb-4 mt-4">Content Details</h3>
              </div>
               <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center gap-2"><FileTextIcon className="h-4 w-4"/> Subject / Topic</FormLabel>
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
                    <FormItem className="md:col-span-2">
                      <FormLabel>Difficulty Level (For AI generation)</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2"
                        >
                          {["easy", "medium", "hard", "master"].map((level) => (
                             <FormItem key={level} className="flex-1">
                                <FormControl>
                                   <RadioGroupItem value={level} id={level} className="sr-only peer" />
                                </FormControl>
                                <Label htmlFor={level} className="flex h-full flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer capitalize">
                                  {level}
                                </Label>
                              </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
               <FormField
                  control={form.control}
                  name="questionTypes"
                  render={() => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Question Types</FormLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {questionTypeOptions.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="questionTypes"
                            render={({ field }) => (
                                <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                                  <FormControl>
                                    <Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => (checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id)))} />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer flex-1">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               <FormField
                control={form.control}
                name="numberOfQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Questions per Variant: <span className="text-primary font-bold">{field.value}</span></FormLabel>
                    <FormControl>
                      <Slider onValueChange={(value) => field.onChange(value[0])} defaultValue={[field.value]} max={55} min={1} step={1} />
                    </FormControl>
                    <Alert className="mt-2 text-xs p-2">
                      <AlertTriangle className="h-4 w-4"/>
                      <AlertDescription>
                        We recommend selecting ~5 more questions than required, as the AI-generated count may sometimes vary slightly.
                      </AlertDescription>
                    </Alert>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="numberOfVariants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Variants: <span className="text-primary font-bold">{field.value}</span></FormLabel>
                    <FormControl>
                      <Slider onValueChange={(value) => field.onChange(value[0])} defaultValue={[field.value]} max={5} min={1} step={1} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="md:col-span-2 space-y-4">
               <FormField
                  control={form.control}
                  name="includeAnswerKey"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-muted/50">
                      <div className="space-y-0.5">
                        <FormLabel>Include Answer Key</FormLabel>
                        <CardDescription className="text-xs">
                          Append a separate answer key page for multiple-choice questions.
                        </CardDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="includeAnswerLines"
                  render={({ field }) => (
                    <FormItem className={cn("flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-muted/50", { 'hidden': !watchQuestionTypes.includes('Descriptive') })}>
                      <div className="space-y-0.5">
                        <FormLabel>Include Answer Lines</FormLabel>
                        <CardDescription className="text-xs">
                          Add blank lines for descriptive/short answer questions.
                        </CardDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="md:col-span-2">
                 <h3 className="text-lg font-semibold border-b pb-2 mb-4 mt-4">Formatting Details</h3>
              </div>
                <FormField
                  control={form.control}
                  name="layoutStyle"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Layout Style</FormLabel>
                      {watchQuestionTypes.includes('Descriptive') && (
                        <Alert variant="destructive" className="text-xs p-2 mt-1">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Two-column layout is disabled when "Descriptive" questions are selected to ensure proper formatting. The paper will be generated in a single column.
                          </AlertDescription>
                        </Alert>
                      )}
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={watchQuestionTypes.includes('Descriptive') ? 'single-column' : field.value}
                          className="grid grid-cols-2 gap-4 pt-2"
                        >
                           <FormItem>
                               <FormControl>
                                  <RadioGroupItem value="single-column" id="single-column" className="sr-only peer" />
                               </FormControl>
                               <Label htmlFor="single-column" className="flex h-full flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer capitalize">
                                 <Square className="h-6 w-6 mb-2"/>
                                 Single Column
                               </Label>
                             </FormItem>
                             <FormItem>
                               <FormControl>
                                  <RadioGroupItem value="two-column" id="two-column" className="sr-only peer" disabled={watchQuestionTypes.includes('Descriptive')} />
                               </FormControl>
                               <Label htmlFor="two-column" className="flex h-full flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer capitalize disabled:cursor-not-allowed disabled:opacity-50">
                                  <Columns className="h-6 w-6 mb-2"/>
                                  Two Column
                               </Label>
                             </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
               <FormField
                control={form.control}
                name="className"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><User className="h-4 w-4"/> Class</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 10th Grade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><User className="h-4 w-4"/> Average Student Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 16" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="testDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Calendar className="h-4 w-4"/> Test Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="timeLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Clock className="h-4 w-4"/> Time Limit (Minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 45" {...field} value={field.value ?? ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="totalMarks"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center gap-2"><Exam className="h-4 w-4"/> Total Marks</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50" {...field} value={field.value ?? ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isGenerating} size="lg" className="w-full">
                {isGenerating ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Generate Paper</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
