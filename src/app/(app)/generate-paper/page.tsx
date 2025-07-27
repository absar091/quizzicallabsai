
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles, Download, FileText, School, User, Calendar, Clock, Sigma, Columns2, Square } from "lucide-react";
import jsPDF from 'jspdf';

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
import { generateCustomQuiz, GenerateCustomQuizOutput } from "@/ai/flows/generate-custom-quiz";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

type Quiz = GenerateCustomQuizOutput["quiz"];

const formSchema = z.object({
  schoolName: z.string().min(1, "School name is required."),
  className: z.string().min(1, "Class name is required."),
  subject: z.string().min(1, "Subject/Topic is required."),
  numberOfQuestions: z.number().min(1).max(50),
  difficulty: z.enum(["easy", "medium", "hard", "master"]),
  age: z.coerce.number().min(5, "Age must be at least 5.").max(100).optional(),
  includeAnswerKey: z.boolean().default(true),
  testDate: z.string().optional(),
  timeLimit: z.coerce.number().min(1).optional(),
  totalMarks: z.coerce.number().min(1).optional(),
  teacherName: z.string().optional(),
  layoutStyle: z.enum(['single-column', 'two-column']).default('single-column'),
});

type PaperFormValues = z.infer<typeof formSchema>;

export default function GeneratePaperPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Quiz | null>(null);
  const [formValues, setFormValues] = useState<PaperFormValues | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  const form = useForm<PaperFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: "",
      className: "",
      subject: "",
      numberOfQuestions: 10,
      difficulty: "medium",
      includeAnswerKey: true,
      age: undefined,
      testDate: "",
      timeLimit: undefined,
      totalMarks: undefined,
      teacherName: "",
      layoutStyle: 'single-column',
    },
  });

  async function onSubmit(values: PaperFormValues) {
    setIsGenerating(true);
    setQuestions(null);
    setFormValues(values);
    setGenerationProgress(0);

    const interval = setInterval(() => {
        setGenerationProgress(prev => {
            if (prev >= 95) {
                clearInterval(interval);
                return prev;
            }
            return prev + 5;
        })
    }, 500);

    try {
      const result = await generateCustomQuiz({
        topic: values.subject,
        difficulty: values.difficulty,
        numberOfQuestions: values.numberOfQuestions,
        questionTypes: ["Multiple Choice"],
        questionStyles: ["Knowledge-based", "Conceptual"],
        userAge: values.age || null,
        userClass: values.className,
      });
      clearInterval(interval);
      setGenerationProgress(100);
      setQuestions(result.quiz);
    } catch (error) {
      clearInterval(interval);
      toast({
        title: "Error Generating Paper",
        description: "An error occurred while generating questions. The AI model might be busy. Please try again.",
        variant: "destructive",
      });
    } finally {
        setTimeout(() => setIsGenerating(false), 500);
    }
  }

  const downloadPdf = () => {
    if (!questions || !formValues) return;
    const doc = new jsPDF();

    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margin * 2;
    const contentStartY = 45;
    const contentEndY = pageHeight - 15;
    
    let pageNumber = 1;
    let totalPages = 1; // Start with 1, will calculate later

    const addHeader = () => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text(formValues.schoolName.toUpperCase(), pageWidth / 2, 15, { align: 'center' });
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);

        let subjectLine = `Class: ${formValues.className} \u2013 Subject: ${formValues.subject}`;
        doc.text(subjectLine, pageWidth / 2, 22, { align: 'center' });

        doc.setFontSize(10);
        let dateLine = formValues.testDate ? `Date: ${new Date(formValues.testDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : '';
        let marksLine = formValues.totalMarks ? `Total Marks: ${formValues.totalMarks}` : '';
        doc.text(dateLine, margin, 30);
        doc.text(marksLine, margin, 35);
        
        let teacherLine = formValues.teacherName ? `Teacher: ${formValues.teacherName}` : '';
        let timeLine = formValues.timeLimit ? `Time Allowed: ${formValues.timeLimit} minutes` : '';
        doc.text(teacherLine, pageWidth - margin, 30, { align: 'right' });
        doc.text(timeLine, pageWidth - margin, 35, { align: 'right' });

        doc.setLineWidth(0.5);
        doc.line(margin, 40, pageWidth - margin, 40);
    };
    
    const addFooter = (pageNum: number, totalNum: number) => {
        doc.setLineWidth(0.2);
        doc.line(margin, contentEndY, pageWidth - margin, contentEndY);
        doc.setFontSize(8);
        doc.text(`Page ${pageNum} of ${totalNum}`, pageWidth - margin, contentEndY + 5, {align: 'right'});
    };

    const renderTwoColumnLayout = () => {
        const columnWidth = (contentWidth - 10) / 2;
        let columnHeights = [contentStartY, contentStartY];
        let currentColumn = 0;
        
        const questionDocs: { text: string[], height: number }[] = questions.map((q, i) => {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            const questionText = doc.splitTextToSize(`${i + 1}. ${q.question}`, columnWidth);
            
            doc.setFont('helvetica', 'normal');
            const answersText = q.answers.map((ans, ansIndex) => {
                const letter = String.fromCharCode(65 + ansIndex);
                return doc.splitTextToSize(`${letter}. ${ans}`, columnWidth - 5);
            }).flat();
            
            const totalHeight = (questionText.length * 4.5) + (answersText.length * 4.5) + 6;
            return { text: [...questionText, ...answersText], height: totalHeight, question: q };
        });

        // Pre-calculate total pages
        let tempY = [contentStartY, contentStartY];
        let tempCol = 0;
        let tempPageCount = 1;
        questionDocs.forEach(qDoc => {
             if (tempY[tempCol] + qDoc.height > contentEndY) {
                tempCol++;
                if (tempCol > 1) {
                    tempPageCount++;
                    tempCol = 0;
                    tempY = [contentStartY, contentStartY];
                }
                 tempY[tempCol] = contentStartY;
            }
            tempY[tempCol] += qDoc.height;
        });
        totalPages = tempPageCount + (formValues.includeAnswerKey ? 1 : 0);

        addHeader();

        questions.forEach((q, i) => {
            doc.setFontSize(10);
            const questionText = doc.splitTextToSize(`${i + 1}. ${q.question}`, columnWidth);
            const answersText = q.answers.map((ans, ansIndex) => doc.splitTextToSize(`${String.fromCharCode(65 + ansIndex)}. ${ans}`, columnWidth - 5));
            const totalHeight = (questionText.length * 4.5) + (answersText.flat().length * 4.5) + 6;

            if (columnHeights[currentColumn] + totalHeight > contentEndY) {
                currentColumn++;
                if (currentColumn > 1) {
                    addFooter(pageNumber, totalPages);
                    doc.addPage();
                    pageNumber++;
                    currentColumn = 0;
                    columnHeights = [contentStartY, contentStartY];
                    addHeader();
                } else {
                     columnHeights[currentColumn] = contentStartY;
                }
            }
            
            let yPos = columnHeights[currentColumn];
            const xPos = margin + (currentColumn * (columnWidth + 10));

            doc.setFont('helvetica', 'bold');
            doc.text(questionText, xPos, yPos);
            yPos += questionText.length * 4.5 + 2;

            doc.setFont('helvetica', 'normal');
            answersText.forEach(ansLines => {
                doc.text(ansLines, xPos + 5, yPos);
                yPos += ansLines.length * 4.5;
            });
            
            columnHeights[currentColumn] = yPos + 4;
        });

        for (let i = 1; i <= pageNumber; i++) {
            doc.setPage(i);
            addFooter(i, totalPages);
            if (i < pageNumber || columnHeights[1] > contentStartY) {
              doc.setLineWidth(0.2);
              doc.line(pageWidth / 2, contentStartY - 2, pageWidth / 2, contentEndY);
            }
        }
    }
    
    // Clear the default blank page
    doc.deletePage(1);

    if (formValues.layoutStyle === 'two-column') {
        renderTwoColumnLayout();
    } else {
      // Single Column Logic (condensed for brevity, similar principle)
        let y = contentStartY;
        const qDocs = questions.map((q, i) => {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            const qText = doc.splitTextToSize(`${i + 1}. ${q.question}`, contentWidth);
            doc.setFont('helvetica', 'normal');
            const aText = q.answers.map((a,idx) => doc.splitTextToSize(`${String.fromCharCode(65 + idx)}. ${a}`, contentWidth - 5)).flat();
            return { height: (qText.length * 4.5) + (aText.length * 4.5) + 6 };
        });
        
        let tempPageCount = 1;
        let tempY = contentStartY;
        qDocs.forEach(qDoc => {
             if (tempY + qDoc.height > contentEndY) {
                tempPageCount++;
                tempY = contentStartY;
            }
            tempY += qDoc.height;
        });
        totalPages = tempPageCount + (formValues.includeAnswerKey ? 1 : 0);
        
        doc.addPage();
        addHeader();
        
        questions.forEach((q, i) => {
            const qText = doc.splitTextToSize(`${i + 1}. ${q.question}`, contentWidth);
            const aText = q.answers.map((a,idx) => doc.splitTextToSize(`${String.fromCharCode(65 + idx)}. ${a}`, contentWidth - 5));
            const totalHeight = (qText.length * 4.5) + (aText.flat().length * 4.5) + 6;
            
            if(y + totalHeight > contentEndY){
                addFooter(pageNumber, totalPages);
                doc.addPage();
                pageNumber++;
                y = contentStartY;
                addHeader();
            }

            doc.setFont('helvetica', 'bold');
            doc.text(qText, margin, y);
            y += qText.length * 4.5 + 2;

            doc.setFont('helvetica', 'normal');
            aText.forEach(lines => {
                doc.text(lines, margin + 5, y);
                y += lines.length * 4.5;
            });
            y += 4;
        });
        addFooter(pageNumber, totalPages);
        doc.deletePage(1); // Remove the first blank page that was added
    }


    if (formValues.includeAnswerKey) {
        doc.addPage();
        pageNumber++;
        addHeader();
        let y = contentStartY + 10;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Answer Key", pageWidth / 2, y, { align: 'center' });
        y += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const answerColumnWidth = 35;
        const columns = 4;
        const rowsPerColumn = Math.ceil(questions.length / columns);
        
        for (let i = 0; i < questions.length; i++) {
            const col = Math.floor(i / rowsPerColumn);
            const row = i % rowsPerColumn;
            
            const xPos = margin + (col * answerColumnWidth);
            const yPos = y + (row * 8);

            if (yPos > contentEndY) { // Failsafe, should not happen with this logic
                // This would need a new page, but we assume the key fits
            }

            const q = questions[i];
            const correctAnswerLetter = String.fromCharCode(65 + q.answers.findIndex(ans => ans === q.correctAnswer));
            const keyText = `${i + 1}. ${correctAnswerLetter}`;
            doc.text(keyText, xPos, yPos);
        }
        addFooter(pageNumber, totalPages);
    }

    doc.save(`${formValues.subject}_paper.pdf`);
  };

  if (isGenerating) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[60svh] text-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Generating Your Paper...</h2>
        <p className="text-muted-foreground max-w-sm mb-6">Our AI is preparing the questions. Please wait a moment.</p>
        <div className="w-full max-w-sm">
           <Progress value={generationProgress} />
           <p className="text-sm mt-2 text-primary font-medium">{generationProgress}%</p>
        </div>
      </div>
    );
  }

  if (questions && formValues) {
    return (
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Paper Generated Successfully" description="Your exam paper is ready. You can preview it below or download it as a PDF." />
        <Card>
          <CardHeader>
            <CardTitle>{formValues.schoolName}</CardTitle>
            <CardDescription>
                {`Class: ${formValues.className} | Subject: ${formValues.subject}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[50vh] overflow-y-auto p-4 border rounded-lg">
                {questions.map((q, i) => (
                    <div key={i}>
                        <p className="font-semibold">{i+1}. {q.question}</p>
                        <ul className="list-disc list-inside pl-4 mt-1">
                            {q.answers.map((ans, j) => <li key={j}>{ans}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row gap-4">
            <Button onClick={downloadPdf} size="lg"><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
            <Button onClick={() => setQuestions(null)} variant="outline">Generate Another Paper</Button>
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
                    <FormLabel className="flex items-center gap-2"><School className="h-4 w-4"/> School Name</FormLabel>
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
                    <FormLabel className="flex items-center gap-2"><FileText className="h-4 w-4"/> Subject / Topic</FormLabel>
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
                name="numberOfQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions: <span className="text-primary font-bold">{field.value}</span></FormLabel>
                    <FormControl>
                      <Slider onValueChange={(value) => field.onChange(value[0])} defaultValue={[field.value]} max={50} min={1} step={1} />
                    </FormControl>
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="includeAnswerKey"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-muted/50">
                      <div className="space-y-0.5">
                        <FormLabel>Include Answer Key</FormLabel>
                        <CardDescription className="text-xs">
                          Append an answer key on the last page.
                        </CardDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              
              <div className="md:col-span-2">
                 <h3 className="text-lg font-semibold border-b pb-2 mb-4 mt-4">Formatting Details</h3>
              </div>
                <FormField
                  control={form.control}
                  name="layoutStyle"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Layout Style</FormLabel>
                      <CardDescription className="text-xs mb-2">"Two Column" is recommended to save paper on prints.</CardDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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
                                  <RadioGroupItem value="two-column" id="two-column" className="sr-only peer" />
                               </FormControl>
                               <Label htmlFor="two-column" className="flex h-full flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer capitalize">
                                  <Columns2 className="h-6 w-6 mb-2"/>
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
                    <FormLabel className="flex items-center gap-2"><Sigma className="h-4 w-4"/> Total Marks</FormLabel>
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

    