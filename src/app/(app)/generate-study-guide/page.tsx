
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles, BookOpen, Brain, Lightbulb, HelpCircle, Download } from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { generateStudyGuide, GenerateStudyGuideOutput } from "@/ai/flows/generate-study-guide";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  topic: z.string().min(3, "Please enter a topic."),
});

export default function GenerateStudyGuidePage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [studyGuide, setStudyGuide] = useState<GenerateStudyGuideOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setStudyGuide(null);
    try {
      const result = await generateStudyGuide(values);
      setStudyGuide(result);
    } catch (error) {
      toast({
        title: "Error Generating Study Guide",
        description: "An error occurred while generating the study guide. The AI model might be busy. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }
  
  const downloadStudyGuide = () => {
    if (!studyGuide) return;
    
    const doc = new jsPDF();
    const topic = form.getValues('topic');
    let y = 15;
    const pageHeight = 280;
    const margin = 10;
    const maxWidth = 180;
    
    const checkPageBreak = (neededHeight: number) => {
        if(y + neededHeight > pageHeight) {
            doc.addPage();
            y = 15;
        }
    }

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(studyGuide.title, margin, y);
    y += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(studyGuide.summary, maxWidth);
    checkPageBreak(summaryLines.length * 5);
    doc.text(summaryLines, margin, y);
    y += (summaryLines.length * 5) + 10;

    // Key Concepts
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    checkPageBreak(10);
    doc.text("Key Concepts", margin, y);
    y += 8;

    studyGuide.keyConcepts.forEach(concept => {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        const conceptLines = doc.splitTextToSize(concept.concept, maxWidth);
        checkPageBreak(conceptLines.length * 5 + 15);
        doc.text(conceptLines, margin, y);
        y+= conceptLines.length * 5;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const definitionLines = doc.splitTextToSize(concept.definition, maxWidth);
        doc.text(definitionLines, margin, y);
        y+= definitionLines.length * 5;

        doc.setFont('helvetica', 'italic');
        const importanceLines = doc.splitTextToSize(`Importance: ${concept.importance}`, maxWidth);
        doc.text(importanceLines, margin, y);
        y += (importanceLines.length * 5) + 5;
    });

    // Analogies
    checkPageBreak(15);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("Simple Analogies", margin, y);
    y += 8;
    
    studyGuide.analogies.forEach(analogy => {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'italic');
        const analogyLines = doc.splitTextToSize(`"${analogy.analogy}"`, maxWidth);
        checkPageBreak(analogyLines.length * 5 + 10);
        doc.text(analogyLines, margin, y);
        y += analogyLines.length * 5;

        doc.setFont('helvetica', 'normal');
        doc.text(`(This explains: ${analogy.concept})`, margin, y);
        y += 10;
    });

    // Quiz Yourself
    checkPageBreak(15);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("Quiz Yourself", margin, y);
    y += 8;

    studyGuide.quizYourself.forEach(quiz => {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        const questionLines = doc.splitTextToSize(`Q: ${quiz.question}`, maxWidth);
        checkPageBreak(questionLines.length * 5 + 10);
        doc.text(questionLines, margin, y);
        y+= questionLines.length * 5;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const answerLines = doc.splitTextToSize(`A: ${quiz.answer}`, maxWidth);
        doc.text(answerLines, margin, y);
        y += 10;
    });

    doc.save(`study_guide_${topic.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  };

  return (
    <div>
      <PageHeader
        title="AI Study Guide Generator"
        description="Enter any topic to get a comprehensive, AI-generated study guide."
      />

      <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Topic</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="e.g., The French Revolution, Quantum Mechanics..." {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="lg" className="h-12" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Guide
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
      </div>

       {isGenerating && (
          <div className="flex flex-col items-center justify-center text-center mt-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-xl text-muted-foreground">Our AI is building your study guide...</p>
          </div>
        )}

      {studyGuide && (
        <div className="max-w-4xl mx-auto mt-12">
            <Card>
                <CardHeader className="border-b pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                     <div className="flex-1">
                        <CardTitle className="text-3xl">{studyGuide.title}</CardTitle>
                        <CardDescription className="mt-2">{studyGuide.summary}</CardDescription>
                     </div>
                     <Button variant="outline" onClick={downloadStudyGuide}>
                        <Download className="h-4 w-4 mr-2"/>
                        Download as PDF
                    </Button>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                    <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Brain className="h-5 w-5 text-primary" /> Key Concepts</h3>
                         <Accordion type="single" collapsible className="w-full">
                            {studyGuide.keyConcepts.map((item, index) => (
                               <AccordionItem value={`item-${index}`} key={index}>
                                 <AccordionTrigger>{item.concept}</AccordionTrigger>
                                 <AccordionContent className="space-y-3">
                                   <p>{item.definition}</p>
                                   <Alert variant="default" className="bg-muted/50">
                                     <AlertTitle className="font-semibold">Why it's important</AlertTitle>
                                     <AlertDescription>{item.importance}</AlertDescription>
                                   </Alert>
                                 </AccordionContent>
                               </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary" /> Simple Analogies</h3>
                        <div className="space-y-4">
                        {studyGuide.analogies.map((item, index) => (
                             <Card key={index} className="bg-muted/30">
                                <CardContent className="pt-6">
                                    <p className="font-semibold italic">"{item.analogy}"</p>
                                    <p className="text-sm text-muted-foreground mt-2">This helps explain the concept of <span className="font-medium text-primary">{item.concept}</span>.</p>
                                </CardContent>
                             </Card>
                        ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><HelpCircle className="h-5 w-5 text-primary" /> Quiz Yourself</h3>
                         <Accordion type="single" collapsible className="w-full">
                            {studyGuide.quizYourself.map((item, index) => (
                               <AccordionItem value={`quiz-${index}`} key={index}>
                                 <AccordionTrigger>{item.question}</AccordionTrigger>
                                 <AccordionContent>
                                    <Alert className="mt-2 border-primary/50 text-primary bg-primary/10">
                                        <AlertTitle className="text-primary">Answer</AlertTitle>
                                        <AlertDescription>{item.answer}</AlertDescription>
                                    </Alert>
                                 </AccordionContent>
                               </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
