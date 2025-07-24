
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles, BookOpen, Brain, Lightbulb, HelpCircle } from "lucide-react";

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

  return (
    <div>
      <PageHeader
        title="AI Study Guide Generator"
        description="Enter any topic to get a comprehensive, AI-generated study guide."
      />

      <div className="max-w-2xl mx-auto">
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle>Enter Your Topic</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., The French Revolution, Quantum Mechanics, Machine Learning" {...field} />
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
            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-primary mb-4" />
                    <CardTitle className="text-3xl">{studyGuide.title}</CardTitle>
                    <CardDescription>{studyGuide.summary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                    <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Brain className="h-5 w-5" /> Key Concepts</h3>
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
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Lightbulb className="h-5 w-5" /> Simple Analogies</h3>
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
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><HelpCircle className="h-5 w-5" /> Quiz Yourself</h3>
                         <Accordion type="single" collapsible className="w-full">
                            {studyGuide.quizYourself.map((item, index) => (
                               <AccordionItem value={`quiz-${index}`} key={index}>
                                 <AccordionTrigger>{item.question}</AccordionTrigger>
                                 <AccordionContent>
                                    <Alert className="mt-2 border-green-500 text-green-500 bg-green-500/10">
                                        <AlertTitle className="text-green-600">Answer</AlertTitle>
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
